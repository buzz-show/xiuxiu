<script setup lang="ts">
import type { Pet } from '~/types/pet'

const props = withDefaults(defineProps<{
  initialData?: Partial<Pet>
  submitting?: boolean
  submitLabel?: string
}>(), {
  submitLabel: '保存'
})

const emit = defineEmits<{
  submit: [payload: {
    name: string
    gender: 'male' | 'female'
    species: 'dog' | 'cat' | 'other'
    breed?: string
    birthday?: string
    sterilized: boolean
    weight?: number
    home_date?: string
    notes?: string
    avatar_url?: string
  }]
}>()

// 品种选项
const breeds = [
  { label: '拉布拉多', value: 'dog_lab' },
  { label: '边境牧羊犬', value: 'dog_border' },
  { label: '英国短毛猫', value: 'cat_sh' },
  { label: '金毛寻回犬', value: 'dog_golden' },
  { label: '布偶猫', value: 'cat_rag' },
  { label: '其他', value: 'other' },
]

const getSpecies = (breed: string): 'dog' | 'cat' | 'other' => {
  if (breed.startsWith('dog_')) return 'dog'
  if (breed.startsWith('cat_')) return 'cat'
  return 'other'
}

const initGender = (g?: string) => (g === 'male' ? 'boy' : g === 'female' ? 'girl' : 'boy')

const form = reactive({
  avatarPreview: props.initialData?.avatar_url ?? '',
  newAvatarBase64: '',
  newAvatarMime: '',
  name: props.initialData?.name ?? '',
  gender: initGender(props.initialData?.gender),
  sterilized: props.initialData?.sterilized ?? false,
  weight: props.initialData?.weight != null ? String(props.initialData.weight) : '',
  breed: props.initialData?.breed ?? '',
  birthday: props.initialData?.birthday ?? new Date().toISOString().split('T')[0],
  homeDate: props.initialData?.home_date ?? new Date().toISOString().split('T')[0],
  notes: props.initialData?.notes ?? '',
})

const errors = reactive({ name: '', breed: '' })

const validate = () => {
  errors.name = form.name.trim() ? '' : '请填写宠物名称'
  errors.breed = form.breed ? '' : '请选择品种'
  return !errors.name && !errors.breed
}

const fileInput = ref<HTMLInputElement | null>(null)
const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return
  const file = target.files[0]
  form.newAvatarMime = file.type
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    form.avatarPreview = result
    form.newAvatarBase64 = result.split(',')[1] ?? ''
  }
  reader.readAsDataURL(file)
}

const uploading = ref(false)
const toast = useToast()

const handleSubmit = async () => {
  if (!validate()) return

  uploading.value = true
  try {
    let avatar_url: string | undefined = props.initialData?.avatar_url

    if (form.newAvatarBase64) {
      const { url } = await $fetch<{ url: string }>('/api/pets/avatar', {
        method: 'POST',
        body: { base64: form.newAvatarBase64, mimeType: form.newAvatarMime },
      })
      avatar_url = url
    }

    emit('submit', {
      name: form.name.trim(),
      gender: form.gender === 'boy' ? 'male' : 'female',
      species: getSpecies(form.breed),
      breed: form.breed || undefined,
      birthday: form.birthday || undefined,
      sterilized: form.sterilized,
      weight: form.weight ? Number(form.weight) : undefined,
      home_date: form.homeDate || undefined,
      notes: form.notes || undefined,
      avatar_url,
    })
  } catch (e: any) {
    toast.add({ title: '头像上传失败', description: e?.data?.message ?? '请稍后重试', color: 'error' })
  } finally {
    uploading.value = false
  }
}

const isLoading = computed(() => props.submitting || uploading.value)

defineExpose({ handleSubmit })
</script>

<template>
  <div>
    <!-- 头像上传区 -->
    <section class="mb-8 flex flex-col items-center">
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
        <img
          v-if="form.avatarPreview"
          :src="form.avatarPreview"
          class="h-full w-full rounded-full object-cover"
          alt="头像预览"
        />
        <UIcon
          v-else
          name="i-heroicons-sparkles"
          class="h-12 w-12 text-[#C9B7A3]"
        />
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
        <div class="border-b border-zinc-100">
          <div class="flex items-center py-4">
            <label class="w-24 text-base font-medium">宠物名称</label>
            <UInput
              v-model="form.name"
              variant="none"
              placeholder="比如：年糕"
              class="flex-1 text-right"
              input-class="text-right text-zinc-900 text-base"
              @input="errors.name = ''"
            />
          </div>
          <p v-if="errors.name" class="pb-2 text-right text-xs text-red-400">{{ errors.name }}</p>
        </div>

        <!-- 性别切换 -->
        <div class="flex items-center border-b border-zinc-100 py-4">
          <label class="w-24 text-base font-medium">宠物性别</label>
          <div class="flex flex-1 justify-end gap-3">
            <button
              type="button"
              class="rounded-full px-5 py-1.5 text-sm transition-all"
              :class="form.gender === 'boy' ? 'bg-blue-50 text-blue-600 font-semibold' : 'bg-zinc-100 text-zinc-500'"
              @click="form.gender = 'boy'"
            >
              男生
            </button>
            <button
              type="button"
              class="rounded-full px-5 py-1.5 text-sm transition-all"
              :class="form.gender === 'girl' ? 'bg-[#FBCFE8] text-pink-600 font-semibold' : 'bg-zinc-100 text-zinc-500'"
              @click="form.gender = 'girl'"
            >
              女生
            </button>
          </div>
        </div>

        <!-- 是否绝育 -->
        <div class="flex items-center border-b border-zinc-100 py-4">
          <label class="w-24 text-base font-medium">绝育情况</label>
          <div class="flex flex-1 justify-end gap-3">
            <button
              type="button"
              class="rounded-full px-5 py-1.5 text-sm transition-all"
              :class="form.sterilized ? 'bg-green-50 text-green-600 font-semibold' : 'bg-zinc-100 text-zinc-500'"
              @click="form.sterilized = true"
            >
              已绝育
            </button>
            <button
              type="button"
              class="rounded-full px-5 py-1.5 text-sm transition-all"
              :class="!form.sterilized ? 'bg-zinc-200 text-zinc-600 font-semibold' : 'bg-zinc-100 text-zinc-500'"
              @click="form.sterilized = false"
            >
              未绝育
            </button>
          </div>
        </div>

        <!-- 体重 -->
        <div class="flex items-center border-b border-zinc-100 py-4">
          <label class="w-24 text-base font-medium">体重 (kg)</label>
          <UInput
            v-model="form.weight"
            variant="none"
            type="number"
            placeholder="如：4.5"
            class="flex-1 text-right"
            input-class="text-right text-zinc-900 text-base"
          />
        </div>

        <!-- 品种选择 -->
        <div>
          <div class="flex items-center py-4">
            <label class="w-24 text-base font-medium">品种</label>
            <div class="flex-1">
              <USelect
                v-model="form.breed"
                :items="breeds"
                placeholder="请选择"
                value-attribute="value"
                variant="none"
                class="w-full"
                select-class="text-right text-base text-zinc-900 pr-6"
                @change="errors.breed = ''"
              />
            </div>
          </div>
          <p v-if="errors.breed" class="pb-2 text-right text-xs text-red-400">{{ errors.breed }}</p>
        </div>
      </div>

      <!-- 日期信息卡片 -->
      <div class="rounded-[20px] bg-white px-4 py-1 shadow-[0_4px_12px_rgba(201,183,163,0.1)]">
        <div class="flex items-center border-b border-zinc-100 py-4">
          <label class="w-24 text-base font-medium">出生日期</label>
          <UInput
            v-model="form.birthday"
            type="date"
            variant="none"
            class="flex-1 text-right"
            input-class="text-right text-zinc-900 text-base appearance-none bg-transparent"
          />
        </div>

        <div class="flex items-center border-b border-zinc-100 py-4">
          <label class="w-24 text-base font-medium">到家日期</label>
          <UInput
            v-model="form.homeDate"
            type="date"
            variant="none"
            class="flex-1 text-right"
            input-class="text-right text-zinc-900 text-base appearance-none bg-transparent"
          />
        </div>

        <!-- 备注 -->
        <div class="flex items-start py-4">
          <label class="w-24 text-base font-medium pt-1">备注</label>
          <UTextarea
            v-model="form.notes"
            variant="none"
            placeholder="健康提醒、特殊习惯等…"
            class="flex-1 text-right"
            :rows="2"
          />
        </div>
      </div>

      <!-- 底部提交按钮 -->
      <div class="flex justify-center pb-4">
        <UButton
          size="xl"
          :loading="isLoading"
          :disabled="isLoading"
          class="!bg-[#C9B7A3] hover:!bg-[#C9B7A3]/90 text-white px-10 h-11 rounded-full text-base font-medium shadow-none transition-all active:scale-95 flex items-center justify-center border-none"
          @click="handleSubmit"
        >
          {{ submitLabel }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.5;
  cursor: pointer;
}

:deep(.relative > input:focus) {
  --tw-ring-color: transparent !important;
}

:deep(.u-button) {
  box-shadow: none !important;
}
</style>
