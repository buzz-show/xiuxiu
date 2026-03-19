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
  const body = await readBody<{ message: string; thread_id: string; pet_id?: string }>(event)
  if (!body?.message?.trim()) {
    throw createError({ statusCode: 400, message: 'message is required' })
  }

  // 3. 设置 SSE 响应头
  setSSEHeaders(event)

  // 4. 构建 Agent 并流式调用
  const graph = buildPetAssistantGraph(user.sub)
  const config = { configurable: { thread_id: body.thread_id } }

  const stream = await graph.stream(
    {
      messages: [new HumanMessage(body.message)],
      userId: user.sub,
      petId: body.pet_id,
    },
    { ...config, streamMode: 'messages' },
  )

  // 5. 将 LangGraph 流转发为 SSE
  return sendStream(event, new ReadableStream({
    async start(controller) {
      try {
        for await (const [chunk, metadata] of stream) {
          if (
            metadata.langgraph_node === 'agent' &&
            chunk.content &&
            typeof chunk.content === 'string'
          ) {
            controller.enqueue(new TextEncoder().encode(
              formatSSE({ type: 'delta', content: chunk.content }),
            ))
          }
        }
        controller.enqueue(new TextEncoder().encode(formatSSE({ type: 'done' })))
      } catch (err) {
        controller.enqueue(new TextEncoder().encode(
          formatSSE({ type: 'error', message: 'Agent error' }),
        ))
      } finally {
        controller.close()
      }
    },
  }))
})
