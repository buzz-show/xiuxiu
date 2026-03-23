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
 * Tool: 查询即将到期/已过期的提醒
 */
export const getUpcomingRemindersTool = (userId: string) =>
  tool(
    async ({ days_ahead }) => {
      const supabase = createServerSupabaseClient()

      // 获取用户所有宠物
      const { data: pets } = await supabase
        .from('pets')
        .select('id, name')
        .eq('user_id', userId)

      if (!pets?.length) return '用户暂无宠物档案。'

      const petIds = pets.map(p => p.id)
      const today = new Date()
      const futureDate = new Date()
      futureDate.setDate(today.getDate() + (days_ahead ?? 30))

      const { data, error } = await supabase
        .from('health_records')
        .select('pet_id, type, title, next_due_date')
        .in('pet_id', petIds)
        .not('next_due_date', 'is', null)
        .lte('next_due_date', futureDate.toISOString().split('T')[0])
        .order('next_due_date', { ascending: true })

      if (error) return `查询提醒失败：${error.message}`
      if (!data?.length) return `未来 ${days_ahead ?? 30} 天内没有待办提醒。`

      const petMap = Object.fromEntries(pets.map(p => [p.id, p.name]))
      const todayStr = today.toISOString().split('T')[0]

      return JSON.stringify(data.map(r => ({
        pet: petMap[r.pet_id] ?? r.pet_id,
        type: r.type,
        title: r.title,
        due: r.next_due_date,
        overdue: r.next_due_date! < todayStr,
      })))
    },
    {
      name: 'get_upcoming_reminders',
      description: '查询用户宠物即将到期或已过期的健康提醒（疫苗、驱虫、体检等）。当用户询问"最近有什么要做的"、"有什么提醒"时调用。',
      schema: z.object({
        days_ahead: z.number().optional().describe('查询未来多少天内的提醒，默认 30 天'),
      }),
    },
  )

/**
 * Tool: 获取宠物饮食建议
 */
export const getDietaryAdviceTool = (userId: string) =>
  tool(
    async ({ pet_id, concern }) => {
      const supabase = createServerSupabaseClient()

      const { data: pet } = await supabase
        .from('pets')
        .select('name, species, breed, birthday, gender, weight, sterilized')
        .eq('id', pet_id)
        .eq('user_id', userId)
        .single()

      if (!pet) return '无权访问该宠物信息。'

      // 计算年龄
      let ageDesc = '未知年龄'
      if (pet.birthday) {
        const birth = new Date(pet.birthday)
        const now = new Date()
        const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
        if (months < 12) ageDesc = `${months} 个月`
        else ageDesc = `${Math.floor(months / 12)} 岁`
      }

      const profile = `宠物信息：
- 名字：${pet.name}
- 种类：${pet.species === 'cat' ? '猫' : pet.species === 'dog' ? '狗' : '其他'}
- 品种：${pet.breed ?? '未知'}
- 年龄：${ageDesc}
- 性别：${pet.gender === 'male' ? '公' : pet.gender === 'female' ? '母' : '未知'}
- 体重：${pet.weight ? pet.weight + ' kg' : '未知'}
- 是否绝育：${pet.sterilized ? '是' : '否'}
- 具体关注：${concern ?? '日常饮食建议'}`

      return profile
    },
    {
      name: 'get_dietary_advice_context',
      description: '获取宠物基本信息用于生成个性化饮食建议。当用户询问宠物吃什么、喂食量、食物禁忌等饮食相关问题时调用。',
      schema: z.object({
        pet_id: z.string().describe('宠物 ID'),
        concern: z.string().optional().describe('具体的饮食关注点，如"减肥"、"毛发护理"'),
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
    getUpcomingRemindersTool(userId),
    getDietaryAdviceTool(userId),
  ]
}
