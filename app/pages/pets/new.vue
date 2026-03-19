<script setup lang="ts">
// 明确定义页面元数据
definePageMeta({
  layout: false
})
/**
 * 宠物健康 App - 添加宠物档案
 * 技术栈：Nuxt 4, Vue 3, Nuxt UI, Tailwind CSS
 */

// 表单状态管理
// 宠物表单：包含头像、名称、性别、是否绝育、品种、体重、出生日期和到家日期等字段
const petForm = reactive({
  avatar: '',
  name: '',
  gender: 'boy',
  sterilized: false,   // 新增：是否绝育
  breed: '',
  weight: '',          // 新增：体重(kg)
  birthday: new Date().toISOString().split('T')[0],
  homeDate: new Date().toISOString().split('T')[0]
})

// 品种选项
const breeds = [
  { label: '英国短毛猫', value: 'cat_sh' },
  { label: '金毛寻回犬', value: 'dog_golden' },
  { label: '布偶猫', value: 'cat_rag' },
  { label: '其他', value: 'other' }
]

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        petForm.avatar = e.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

const handleSave = () => {
  console.log('Saving pet profile:', petForm)
}

const handleCancel = () => {
  console.log('Cancelled')
}
</script>

<template>
  <div class="min-h-screen bg-[#FFFCF8] font-sans text-zinc-700 selection:bg-[#EADBC8]/30">
    <!-- iOS 风格导航栏 -->
    <header class="sticky top-0 z-10 flex items-center justify-between bg-[#FFFCF8]/80 px-5 py-4 backdrop-blur-md">
      <UButton
        variant="ghost"
        class="text-base font-medium text-[#C9B7A3] hover:bg-transparent"
        @click="handleCancel"
      >
        取消
      </UButton>
      <h1 class="text-xl font-semibold text-zinc-900">建立档案</h1>
      <UButton
        variant="ghost"
        class="text-base font-bold text-[#FDBA74] hover:bg-transparent"
        @click="handleSave"
      >
        保存
      </UButton>
    </header>

    <main class="mx-auto max-w-lg p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <!-- 头像上传区 -->
      <section class="mb-8 flex flex-col items-center">
        <!-- 隐藏的文件上传 input -->
        <input 
          type="file" 
          ref="fileInput" 
          accept="image/*" 
          class="hidden" 
          @change="handleFileChange" 
        />
        <div 
          class="relative flex h-[110px] w-[110px] cursor-pointer items-center justify-center rounded-full bg-[#F5EFE6] shadow-[0_4px_12px_rgba(201,183,163,0.1)] transition-transform active:scale-95"
          @click="triggerFileInput"
        >
          <!-- 头像预览或默认爪子图标 -->
          <img 
            v-if="petForm.avatar" 
            :src="petForm.avatar" 
            class="h-full w-full rounded-full object-cover" 
            alt="头像预览"
          />
          <UIcon 
            v-else
            name="i-heroicons-sparkles" 
            class="h-12 w-12 text-[#C9B7A3]" 
          />
          <!-- 悬浮增加按钮 -->
          <div class="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#FFFCF8] bg-[#FDBA74]">
            <UIcon name="i-heroicons-plus" class="h-4 w-4 text-white" />
          </div>
        </div>
        <p class="mt-3 text-sm text-zinc-400">记录它的可爱瞬间</p>
      </section>

      <!-- 信息输入卡片组 -->
      <div class="space-y-6">
        <!-- 基本信息卡片 -->
        <div class="rounded-[20px] bg-white px-4 py-1 shadow-[0_4px_12px_rgba(201,183,163,0.1)]">
          <!-- 名称 -->
          <div class="flex items-center border-b border-zinc-100 py-4">
            <label class="w-24 text-base font-medium">宠物名称</label>
            <UInput
              v-model="petForm.name"
              variant="none"
              placeholder="比如：年糕"
              class="flex-1 text-right"
              input-class="text-right text-zinc-900 text-base"
            />
          </div>

          <!-- 性别切换 -->
          <div class="flex items-center border-b border-zinc-100 py-4">
            <label class="w-24 text-base font-medium">宠物性别</label>
            <div class="flex flex-1 justify-end gap-3">
              <button
                type="button"
                class="rounded-full px-5 py-1.5 text-sm transition-all"
                :class="petForm.gender === 'boy' ? 'bg-blue-50 text-blue-600 font-semibold' : 'bg-zinc-100 text-zinc-500'"
                @click="petForm.gender = 'boy'"
              >
                男生
              </button>
              <button
                type="button"
                class="rounded-full px-5 py-1.5 text-sm transition-all"
                :class="petForm.gender === 'girl' ? 'bg-[#FBCFE8] text-pink-600 font-semibold' : 'bg-zinc-100 text-zinc-500'"
                @click="petForm.gender = 'girl'"
              >
                女生
              </button>
            </div>
          </div>
          <!-- 是否绝育 -->
          <!-- 是否绝育 -->
          <div class="flex items-center border-b border-zinc-100 py-4">
            <label class="w-24 text-base font-medium">绝育情况</label>
            <div class="flex flex-1 justify-end gap-3">
              <button
                type="button"
                class="rounded-full px-5 py-1.5 text-sm transition-all"
                :class="petForm.sterilized ? 'bg-green-50 text-green-600 font-semibold' : 'bg-zinc-100 text-zinc-500'"
                @click="petForm.sterilized = true"
              >
                已绝育
              </button>
              <button
                type="button"
                class="rounded-full px-5 py-1.5 text-sm transition-all"
                :class="!petForm.sterilized ? 'bg-zinc-200 text-zinc-600 font-semibold' : 'bg-zinc-100 text-zinc-500'"
                @click="petForm.sterilized = false"
              >
                未绝育
              </button>
            </div>
          </div>
          <!-- 体重 -->
          <div class="flex items-center border-b border-zinc-100 py-4">
            <label class="w-24 text-base font-medium">体重 (kg)</label>
            <UInput
              v-model="petForm.weight"
              variant="none"
              type="number"
              placeholder="如：4.5"
              class="flex-1 text-right"
              input-class="text-right text-zinc-900 text-base"
            />
          </div>


          <!-- 品种选择 -->
          <div class="flex items-center py-4">
            <label class="w-24 text-base font-medium">品种</label>
            <div class="flex-1">
              <USelectMenu
                v-model="petForm.breed"
                :options="breeds"
                placeholder="请选择"
                value-attribute="value"
                variant="none"
                class="w-full"
                select-class="text-right text-base text-zinc-900 pr-6"
              />
            </div>
          </div>
        </div>

        <!-- 日期信息卡片 -->
        <div class="rounded-[20px] bg-white px-4 py-1 shadow-[0_4px_12px_rgba(201,183,163,0.1)]">
          <div class="flex items-center border-b border-zinc-100 py-4">
            <label class="w-24 text-base font-medium">出生日期</label>
            <UInput
              v-model="petForm.birthday"
              type="date"
              variant="none"
              class="flex-1 text-right"
              input-class="text-right text-zinc-900 text-base appearance-none bg-transparent"
            />
          </div>

          <div class="flex items-center py-4">
            <label class="w-24 text-base font-medium">到家日期</label>
            <UInput
              v-model="petForm.homeDate"
              type="date"
              variant="none"
              class="flex-1 text-right"
              input-class="text-right text-zinc-900 text-base appearance-none bg-transparent"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- 底部确认按钮：完全还原图片中的“+添加宠物”按钮风格 -->
    <footer class="mt-auto p-10 flex justify-center">
      <UButton
        size="xl"
        class="!bg-[#C9B7A3] hover:!bg-[#C9B7A3]/90 text-white px-10 h-11 rounded-full text-base font-medium shadow-none transition-all active:scale-95 flex items-center justify-center border-none"
        @click="handleSave"
      >
        确认并开启健康记录
      </UButton>
    </footer>
  </div>
</template>

<style scoped>
/* 针对日期选择器的样式修饰 */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}

/* 移除 Nuxt UI 默认的 Focus 环 */
:deep(.relative > input:focus) {
  --tw-ring-color: transparent !important;
}

/* 确保 UButton 内部不带默认阴影或边框 */
:deep(.u-button) {
  box-shadow: none !important;
}
</style>