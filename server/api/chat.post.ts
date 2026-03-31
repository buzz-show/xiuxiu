import { HumanMessage } from '@langchain/core/messages'
import { buildPetAssistantGraph } from '../utils/agent/graph'
import { setSSEHeaders, formatSSE } from '../utils/stream'

export default defineEventHandler(async (event) => {
  // 1. 鉴权：从 Supabase Auth 获取当前用户
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // 2. 解析请求体
  const body = await readBody<{ message: string; session_id: string; pet_id?: string }>(event)
  if (!body?.message?.trim()) {
    throw createError({ statusCode: 400, message: 'message is required' })
  }
  if (!body?.session_id) {
    throw createError({ statusCode: 400, message: 'session_id is required' })
  }

  const client = await serverSupabaseClient(event)

  // 3. 验证 session 归属当前用户
  const { data: session, error: sessionError } = await client
    .from('chat_sessions')
    .select('id')
    .eq('id', body.session_id)
    .eq('user_id', user.id)
    .single()

  if (sessionError || !session) {
    throw createError({ statusCode: 404, message: 'Session not found' })
  }

  // 4. 持久化用户消息
  await client.from('chat_messages').insert({
    session_id: body.session_id,
    user_id: user.id,
    role: 'user',
    content: body.message.trim(),
  })

  // 5. 设置 SSE 响应头
  setSSEHeaders(event)

  // 6. 构建 Agent 并流式调用（session_id 直接作为 LangGraph thread_id）
  const graph = await buildPetAssistantGraph(user.id)
  const config = { configurable: { thread_id: body.session_id } }

  const stream = await graph.stream(
    {
      messages: [new HumanMessage(body.message)],
      userId: user.id,
      petId: body.pet_id,
    },
    { ...config, streamMode: 'messages' },
  )

  // 7. 将 LangGraph 流转发为 SSE，并在结束后持久化 assistant 消息
  return sendStream(event, new ReadableStream({
    async start(controller) {
      let assistantContent = ''
      try {
        for await (const [chunk, metadata] of stream) {
          if (
            metadata.langgraph_node === 'agent' &&
            chunk.content &&
            typeof chunk.content === 'string'
          ) {
            assistantContent += chunk.content
            controller.enqueue(new TextEncoder().encode(
              formatSSE({ type: 'delta', content: chunk.content }),
            ))
          }
        }
        // 持久化 assistant 消息并更新会话时间
        if (assistantContent) {
          await Promise.all([
            client.from('chat_messages').insert({
              session_id: body.session_id,
              user_id: user.id,
              role: 'assistant',
              content: assistantContent,
            }),
            client.from('chat_sessions')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', body.session_id),
          ])
        }
        controller.enqueue(new TextEncoder().encode(formatSSE({ type: 'done' })))
      } catch {
        controller.enqueue(new TextEncoder().encode(
          formatSSE({ type: 'error', message: 'Agent error' }),
        ))
      } finally {
        controller.close()
      }
    },
  }))
})
