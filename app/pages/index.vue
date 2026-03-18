<script setup lang="ts">
import type { Pet } from '~/types/pet'

const { pets, loading, error, fetchPets } = usePets()
onMounted(fetchPets)

// 当前选中宠物的下标
const selectedIndex = ref(0)
const selectedPet = computed<Pet | undefined>(() => pets.value[selectedIndex.value])

// 根据生日计算年龄
function calcAge(birthday?: string): string {
  if (!birthday) return '--'
  const birth = new Date(birthday)
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (months < 1) return '不到 1 个月'
  if (months < 12) return `${months} 个月`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years} 岁 ${rem} 个月` : `${years} 岁`
}

// 打招呼文案
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6)  return '夜深了'
  if (h < 11) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

// 物种展示文字
function speciesLabel(species?: string) {
  if (species === 'cat') return '猫咪'
  if (species === 'dog') return '狗狗'
  return '宠物'
}

// 物种默认 Emoji
function speciesEmoji(species?: string) {
  if (species === 'cat') return '🐱'
  if (species === 'dog') return '🐶'
  return '🐾'
}

// Mock 今日状态（后续按 selectedPet.id 拉取真实数据）
const statusCards = computed(() => [
  { icon: '⚖️', label: '体重', value: '--', unit: 'kg' },
  { icon: '🩺', label: '最近体检', value: '--', unit: '' },
  { icon: '💉', label: '疫苗状态', value: '正常', unit: '' },
  { icon: '🐛', label: '驱虫状态', value: '正常', unit: '' },
])

// Mock 提醒数据
const reminders = ref([
  { id: 1, icon: '💉', title: '狂犬病疫苗复打', time: '3 天后', status: 'warning' },
  { id: 2, icon: '🐛', title: '体内驱虫', time: '已过期 2 天', status: 'error' },
  { id: 3, icon: '🛁', title: '下次洗澡', time: '7 天后', status: 'normal' },
])

// Mock 洗护记录
const groomings = ref([
  { label: '上次洗澡', date: '2026-03-10' },
  { label: '上次美容', date: '2026-03-01' },
  { label: '上次剪甲', date: '2026-03-05' },
])
</script>

<template>
  <div class="px-4 pt-4 pb-4 space-y-4">
    <!-- ===== 加载中 ===== -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-3">
      <div class="w-10 h-10 rounded-full border-4 border-[#EADBC8] border-t-[#C9B7A3] animate-spin" />
      <p class="text-sm text-[#A1A1AA]">加载中…</p>
    </div>

    <!-- ===== 空状态 ===== -->
    <div v-if="!loading && !pets.length" class="flex flex-col items-center justify-center py-24 space-y-4">
      <p class="text-6xl">🐾</p>
      <p class="text-[#18181B] font-semibold text-lg">还没有宠物档案</p>
      <p class="text-sm text-[#71717A] text-center">快来添加你的第一只宝贝吧！</p>
      <NuxtLink
        to="/pets/new"
        class="mt-2 px-6 py-2.5 rounded-full text-sm font-medium text-white"
        style="background-color: var(--warm-deep)"
      >
        + 添加宠物
      </NuxtLink>
    </div>

    <!-- ===== 主内容（有宠物时显示）===== -->
    <template v-if="!loading && pets.length">

      <!-- ── Header ── -->
      <div class="flex items-center justify-between pt-1">
        <div>
          <p class="text-xs text-[#A1A1AA] font-normal">{{ greeting }}，</p>
          <h1 class="text-xl font-bold text-[#18181B] leading-tight">
            {{ selectedPet?.name ?? '我的宝贝' }} 今天怎么样？
          </h1>
        </div>
        <NuxtLink
          to="/pets/new"
          class="w-9 h-9 rounded-full flex items-center justify-center text-white text-lg shadow-sm"
          style="background-color: var(--warm-deep)"
        >
          <UIcon name="i-heroicons-plus" class="text-base" />
        </NuxtLink>
      </div>

      <!-- ── 宠物切换器（头像圆圈行）── -->
      <div class="flex items-center gap-3 overflow-x-auto py-1 no-scrollbar">
        <button
          v-for="(pet, i) in pets"
          :key="pet.id"
          class="flex flex-col items-center gap-1 flex-shrink-0 transition-opacity"
          :class="selectedIndex === i ? 'opacity-100' : 'opacity-40'"
          @click="selectedIndex = i"
        >
          <div
            class="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-2xl transition-all"
            :class="selectedIndex === i
              ? 'ring-2 ring-offset-2 ring-[#C9B7A3]'
              : 'ring-1 ring-[#E4E4E7]'"
            style="background-color: var(--warm-light)"
          >
            <img v-if="pet.avatar_url" :src="pet.avatar_url" class="w-full h-full object-cover" />
            <span v-else>{{ speciesEmoji(pet.species) }}</span>
          </div>
          <span class="text-xs font-medium text-[#3F3F46] max-w-[56px] truncate">{{ pet.name }}</span>
        </button>
      </div>

      <!-- ── 宠物主卡片 ── -->
      <NuxtLink
        :to="`/pets/${selectedPet?.id}`"
        class="block rounded-3xl p-5 shadow-sm active:scale-[0.98] transition-transform"
        style="background-color: var(--warm-light)"
      >
        <div class="flex items-center gap-4">
          <!-- 头像 -->
          <div
            class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center text-3xl flex-shrink-0"
            style="background-color: var(--warm-primary)"
          >
            <img v-if="selectedPet?.avatar_url" :src="selectedPet.avatar_url" class="w-full h-full object-cover" />
            <span v-else>{{ speciesEmoji(selectedPet?.species) }}</span>
          </div>
          <!-- 信息 -->
          <div class="flex-1 min-w-0">
            <p class="text-lg font-bold text-[#18181B] truncate">{{ selectedPet?.name }}</p>
            <p class="text-sm text-[#71717A]">
              {{ selectedPet?.breed || speciesLabel(selectedPet?.species) }}
            </p>
            <div class="flex items-center gap-3 mt-1">
              <span v-if="selectedPet?.gender" class="text-xs text-[#A1A1AA]">
                {{ selectedPet.gender === 'male' ? '♂ 男生' : selectedPet.gender === 'female' ? '♀ 女生' : '' }}
              </span>
              <span class="text-xs text-[#A1A1AA]">{{ calcAge(selectedPet?.birthday) }}</span>
            </div>
          </div>
          <!-- 箭头 -->
          <UIcon name="i-heroicons-chevron-right" class="text-[#C9B7A3] text-xl flex-shrink-0" />
        </div>
      </NuxtLink>

      <!-- ── AI 今日建议卡片 ── -->
      <NuxtLink
        to="/chat"
        class="block rounded-3xl p-5 bg-white border active:scale-[0.98] transition-transform"
        style="border-color: var(--warm-deep)"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
            style="background-color: var(--warm-light)"
          >
            ✨
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-[#18181B]">AI 今日建议</p>
            <p class="text-sm text-[#71717A] mt-1 leading-relaxed">
              {{ selectedPet?.name ? `今天天气不错，适合带 ${selectedPet.name} 出去散散步。注意饮水量，保持规律作息。` : '选择一只宠物后，我会为它生成专属建议。' }}
            </p>
          </div>
          <UIcon name="i-heroicons-chevron-right" class="text-[#C9B7A3] text-base flex-shrink-0 mt-0.5" />
        </div>
      </NuxtLink>

      <!-- ── 今日状态 2×2 方格 ── -->
      <div>
        <p class="text-sm font-semibold text-[#18181B] mb-3">今日状态</p>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="card in statusCards"
            :key="card.label"
            class="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1"
          >
            <span class="text-xl">{{ card.icon }}</span>
            <p class="text-base font-bold text-[#18181B]">
              {{ card.value }}<span v-if="card.unit" class="text-xs font-normal text-[#71717A] ml-0.5">{{ card.unit }}</span>
            </p>
            <p class="text-xs text-[#71717A]">{{ card.label }}</p>
          </div>
        </div>
      </div>

      <!-- ── 提醒模块 ── -->
      <div>
        <p class="text-sm font-semibold text-[#18181B] mb-3">提醒事项</p>
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div
            v-for="(item, idx) in reminders"
            :key="item.id"
            class="flex items-center gap-3 px-4 py-3"
            :class="idx < reminders.length - 1 ? 'border-b border-[#E4E4E7]' : ''"
          >
            <!-- 图标 -->
            <span class="text-lg w-7 text-center flex-shrink-0">{{ item.icon }}</span>
            <!-- 内容 -->
            <div class="flex-1 min-w-0">
              <p class="text-sm text-[#3F3F46] font-medium truncate">{{ item.title }}</p>
            </div>
            <!-- 时间标签 -->
            <span
              class="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
              :class="{
                'bg-[#FEF3C7] text-[#B45309]': item.status === 'warning',
                'bg-[#FEE2E2] text-[#B91C1C]': item.status === 'error',
                'bg-[#F4F4F5] text-[#71717A]': item.status === 'normal',
              }"
            >
              {{ item.time }}
            </span>
          </div>
        </div>
      </div>

      <!-- ── 最近洗护 ── -->
      <div>
        <p class="text-sm font-semibold text-[#18181B] mb-3">最近洗护</p>
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div
            v-for="(g, idx) in groomings"
            :key="g.label"
            class="flex items-center justify-between px-4 py-3"
            :class="idx < groomings.length - 1 ? 'border-b border-[#E4E4E7]' : ''"
          >
            <span class="text-sm text-[#71717A]">{{ g.label }}</span>
            <span class="text-sm font-medium text-[#18181B]">{{ g.date }}</span>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
