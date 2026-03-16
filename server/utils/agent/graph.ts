import { StateGraph } from '@langchain/langgraph'
import { ToolNode } from "@langchain/langgraph/prebuilt"
import { AIMessage } from '@langchain/core/messages'
import { AgentState } from './state'
import { createAgentTools } from './tools'
import { createLLM } from '../llm'

const SYSTEM_PROMPT = `你是"秀秀宠物助理"，一个专业、温暖的AI宠物健康顾问。
你能帮助用户：
- 查询和管理宠物的基本档案信息
- 查看宠物的疫苗、驱虫、体检等健康记录
- 回答关于宠物健康、饲养、行为的专业问题
- 在对话中帮用户记录新的健康事件

回答风格：简洁专业，适当使用emoji让回答更生动。当涉及严重健康问题时，建议用户及时就医。
当前日期：${new Date().toLocaleDateString('zh-CN')}`

/**
 * 构建并编译 LangGraph Agent
 * @param userId 当前登录用户 ID，用于 Tool 权限校验
 */
export function buildPetAssistantGraph(userId: string) {
  const tools = createAgentTools(userId)
  const llm = createLLM()
  const llmWithTools = llm.bindTools(tools)

  // 节点：调用 LLM
  async function callModel(state: typeof AgentState.State) {
    const { HumanMessage, SystemMessage } = await import('@langchain/core/messages')
    const messages = [new SystemMessage(SYSTEM_PROMPT), ...state.messages]
    const response = await llmWithTools.invoke(messages)
    return { messages: [response] }
  }

  // 条件边：判断是否需要调用工具
  function shouldContinue(state: typeof AgentState.State) {
    const lastMessage = state.messages.at(-1) as AIMessage
    if (lastMessage?.tool_calls?.length) return 'tools'
    return '__end__'
  }

  const toolNode = new ToolNode(tools)

  const graph = new StateGraph(AgentState)
    .addNode('agent', callModel)
    .addNode('tools', toolNode)
    .addEdge('__start__', 'agent')
    .addConditionalEdges('agent', shouldContinue)
    .addEdge('tools', 'agent')

  return graph.compile()
}
