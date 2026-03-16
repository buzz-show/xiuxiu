import type { H3Event } from 'h3'

/**
 * 设置 SSE 响应头
 */
export function setSSEHeaders(event: H3Event) {
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no')
}

/**
 * 格式化单条 SSE 消息
 */
export function formatSSE(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`
}
