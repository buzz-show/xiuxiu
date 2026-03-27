import { ChatOpenAI } from '@langchain/openai'

/**
 * LLM 实例工厂 - 统一入口，便于切换服务商（OpenAI / 通义千问）
 */
export function createLLM() {
  const config = useRuntimeConfig()

  // 通过修改 baseURL 和 apiKey 可切换到通义千问兼容接口
  return new ChatOpenAI({
    apiKey: config.openaiApiKey,
    modelName: 'qwen3.5-flash',
    configuration: {
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    },
    temperature: 0.7,
    streaming: true,
  })
}
