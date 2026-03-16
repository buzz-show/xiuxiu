import { Annotation, messagesStateReducer } from '@langchain/langgraph'
import type { BaseMessage } from '@langchain/core/messages'

/**
 * Agent 状态定义
 * messagesStateReducer 自动处理消息追加/更新，支持多轮对话
 */
export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  // 当前对话关联的宠物 ID（可选）
  petId: Annotation<string | undefined>({
    reducer: (_, next) => next,
    default: () => undefined,
  }),
  // 当前登录用户 ID，用于 Tool 权限校验
  userId: Annotation<string>({
    reducer: (_, next) => next,
    default: () => '',
  }),
})

export type AgentStateType = typeof AgentState.State
