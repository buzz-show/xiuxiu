import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { createServerSupabaseClient } from '../supabase'

/**
 * Tool: 查询用户的宠物档案列表
 */
export const getPetProfilesTool = (userId: string) =>
  tool(
    async ({ pet_id }) => {
      const supabase = createServerSupabaseClient()
      const query = supabase
        .from('pets')
        .select('id, name, species, breed, birthday, gender, notes')
        .eq('user_id', userId)

      if (pet_id) query.eq('id', pet_id)

      const { data, error } = await query
      if (error) return `查询宠物档案失败：${error.message}`
      if (!data?.length) return '未找到宠物档案，用户还没有添加宠物。'

      return JSON.stringify(data)
    },
    {
      name: 'get_pet_profiles',
      description: '查询用户的宠物档案，包含名字、品种、年龄等基本信息。当用户提问关于"我的猫/狗/宠物"时调用此工具。',
      schema: z.object({
        pet_id: z.string().optional().describe('指定宠物 ID，不传则返回全部宠物'),
      }),
    },
  )

/**
 * Tool: 查询宠物健康记录
 */
export const getHealthRecordsTool = (userId: string) =>
  tool(
    async ({ pet_id, record_type }) => {
      const supabase = createServerSupabaseClient()
      const query = supabase
        .from('health_records')
        .select('date, type, title, note, next_due_date')
        .eq('pet_id', pet_id)
        .order('date', { ascending: false })
        .limit(20)

      if (record_type) query.eq('type', record_type)

      // 验证宠物属于该用户
      const { data: pet } = await supabase
        .from('pets')
        .select('id')
        .eq('id', pet_id)
        .eq('user_id', userId)
        .single()

      if (!pet) return '无权访问该宠物的健康记录。'

      const { data, error } = await query
      if (error) return `查询健康记录失败：${error.message}`
      if (!data?.length) return '该宠物暂无健康记录。'

      return JSON.stringify(data)
    },
    {
      name: 'get_health_records',
      description: '查询宠物的健康记录，包含疫苗、驱虫、体检、疾病等历史记录。',
      schema: z.object({
        pet_id: z.string().describe('宠物 ID'),
        record_type: z
          .enum(['vaccine', 'deworming', 'checkup', 'illness', 'other'])
          .optional()
          .describe('记录类型筛选'),
      }),
    },
  )

/**
 * Tool: 添加健康记录
 */
export const addHealthRecordTool = (userId: string) =>
  tool(
    async ({ pet_id, type, title, date, note, next_due_date }) => {
      const supabase = createServerSupabaseClient()

      // 验证宠物属于该用户
      const { data: pet } = await supabase
        .from('pets')
        .select('id')
        .eq('id', pet_id)
        .eq('user_id', userId)
        .single()

      if (!pet) return '无权为该宠物添加记录。'

      const { error } = await supabase.from('health_records').insert({
        pet_id,
        type,
        title,
        date: date ?? new Date().toISOString().split('T')[0],
        note,
        next_due_date,
      })

      if (error) return `添加记录失败：${error.message}`
      return '健康记录已成功添加。'
    },
    {
      name: 'add_health_record',
      description: '为宠物添加健康记录（如疫苗接种、驱虫、体检）。当用户说"帮我记录..."时调用此工具。',
      schema: z.object({
        pet_id: z.string().describe('宠物 ID'),
        type: z.enum(['vaccine', 'deworming', 'checkup', 'illness', 'other']),
        title: z.string().describe('记录标题，如"狂犬疫苗接种"'),
        date: z.string().optional().describe('记录日期 YYYY-MM-DD，不填则用今天'),
        note: z.string().optional().describe('备注信息'),
        next_due_date: z.string().optional().describe('下次到期日期 YYYY-MM-DD'),
      }),
    },
  )

/**
 * 根据 userId 创建所有 Tools 集合
 */
export function createAgentTools(userId: string) {
  return [
    getPetProfilesTool(userId),
    getHealthRecordsTool(userId),
    addHealthRecordTool(userId),
  ]
}
