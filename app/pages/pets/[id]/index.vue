<script setup lang="ts">
const route = useRoute()
const { getPet, deletePet } = usePets()
const { data: pet, error } = await useAsyncData('pet', () => getPet(route.params.id as string))
if (error.value) throw createError({ statusCode: 404, message: '宠物不存在' })

const showDeleteModal = ref(false)
const deleting = ref(false)

async function confirmDelete() {
  if (!pet.value) return
  deleting.value = true
  try {
    await deletePet(pet.value.id)
    showDeleteModal.value = false
    await navigateTo('/')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <UiAppHeader :title="pet?.name">
      <template #right>
        <NuxtLink
          :to="`/pets/${pet?.id}/edit`"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
        >
          <UIcon name="i-heroicons-pencil" class="w-5 h-5 text-[#AFA49C]" />
        </NuxtLink>
      </template>
    </UiAppHeader>
    <div class="px-4 pt-5 pb-10">
      <PetAvatar :pet="pet ?? null" class="mb-4" />
      <div class="bg-white rounded-xl p-4 space-y-3 mb-4 shadow-sm">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">种类</span>
          <span>{{ pet?.species === 'cat' ? '猫' : pet?.species === 'dog' ? '狗' : '其他' }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">品种</span><span>{{ pet?.breed || '-' }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">生日</span><span>{{ pet?.birthday || '-' }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">性别</span>
          <span>{{ pet?.gender === 'male' ? '公' : pet?.gender === 'female' ? '母' : '未知' }}</span>
        </div>
      </div>
      <PetHealthTimeline v-if="pet" :pet-id="pet.id" />

      <!-- 删除卡片 -->
      <div class="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
        <button
          class="w-full flex items-center justify-center gap-2 py-4 text-[#FF5A5A] font-medium active:bg-red-50 transition-colors"
          @click="showDeleteModal = true"
        >
          <UIcon name="i-heroicons-trash" class="w-5 h-5" />
          删除宠物档案
        </button>
      </div>
    </div>

    <!-- 二次确认弹窗 -->
    <Teleport to="body">
      <Transition name="overlay">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          @click.self="showDeleteModal = false"
        >
          <Transition name="sheet">
            <div
              v-if="showDeleteModal"
              class="w-full max-w-lg bg-white rounded-t-2xl px-6 pt-6 pb-10 shadow-xl"
            >
              <div class="flex flex-col items-center text-center mb-6">
                <div class="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-7 h-7 text-[#FF5A5A]" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">确认删除档案？</h3>
                <p class="text-sm text-gray-500 leading-relaxed">
                  即将删除
                  <span class="font-semibold text-gray-800">{{ pet?.name }}</span>
                  的所有档案，包括健康记录等数据。
                  <br />此操作无法撤销。
                </p>
              </div>
              <div class="flex gap-3">
                <button
                  class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium active:bg-gray-50 transition-colors"
                  @click="showDeleteModal = false"
                >
                  取消
                </button>
                <button
                  class="flex-1 py-3 rounded-xl bg-[#FF5A5A] text-white font-medium active:opacity-80 transition-opacity disabled:opacity-60"
                  :disabled="deleting"
                  @click="confirmDelete"
                >
                  {{ deleting ? '删除中…' : '确认删除' }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>
