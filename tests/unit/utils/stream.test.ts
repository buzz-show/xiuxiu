import { describe, it, expect, vi } from 'vitest'
import { formatSSE, setSSEHeaders } from '../../../server/utils/stream'

describe('formatSSE', () => {
  it('formats delta event correctly', () => {
    const result = formatSSE({ type: 'delta', content: 'hello' })
    expect(result).toBe('data: {"type":"delta","content":"hello"}\n\n')
  })

  it('formats done event correctly', () => {
    const result = formatSSE({ type: 'done' })
    expect(result).toBe('data: {"type":"done"}\n\n')
  })

  it('formats error event correctly', () => {
    const result = formatSSE({ type: 'error', message: 'Agent error' })
    expect(result).toBe('data: {"type":"error","message":"Agent error"}\n\n')
  })

  it('output always starts with "data: " and ends with double newline', () => {
    const result = formatSSE({ anything: true })
    expect(result).toMatch(/^data: .+\n\n$/)
  })
})

describe('setSSEHeaders', () => {
  it('sets all four required SSE headers on the event', () => {
    const mockEvent = {} as any
    setSSEHeaders(mockEvent)

    const setHeaderMock = vi.mocked((global as any).setHeader)
    expect(setHeaderMock).toHaveBeenCalledWith(mockEvent, 'Content-Type', 'text/event-stream')
    expect(setHeaderMock).toHaveBeenCalledWith(mockEvent, 'Cache-Control', 'no-cache')
    expect(setHeaderMock).toHaveBeenCalledWith(mockEvent, 'Connection', 'keep-alive')
    expect(setHeaderMock).toHaveBeenCalledWith(mockEvent, 'X-Accel-Buffering', 'no')
    expect(setHeaderMock).toHaveBeenCalledTimes(4)
  })
})
