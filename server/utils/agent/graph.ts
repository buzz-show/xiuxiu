import { StateGraph } from '@langchain/langgraph'
import { ToolNode } from "@langchain/langgraph/prebuilt"
import { AIMessage } from '@langchain/core/messages'
import { AgentState } from './state'
import { createAgentTools } from './tools'
import { createLLM } from '../llm'

const SYSTEM_PROMPT = `你是"嗅嗅宠物助理"，一个专业、温暖的AI宠物健康顾问。

## 你能帮助用户：
- 🐾 **宠物档案**：查询和管理宠物的基本信息（名字、品种、年龄、体重等）
- 💉 **健康记录**：查看疫苗、驱虫、体检等历史记录，帮用户记录新事件
- 🔔 **智能提醒**：查询即将到期或已过期的疫苗/驱虫/体检提醒
- 🍖 **饮食建议**：根据宠物的年龄、品种、体重提供个性化饮食和营养建议
- 🩺 **症状问诊**：当宠物出现不适，帮助分析可能原因并给出护理建议

## 回答规范：
- 语气温暖、简洁专业，有亲切感
- 涉及严重健康问题（持续呕吐、血便、无法站立等）时**必须建议立即就医**
- 饮食建议请结合宠物的具体信息（年龄/品种/体重/是否绝育）给出针对性内容
- 提醒类问题优先调用 get_upcoming_reminders 工具获取真实数据

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
