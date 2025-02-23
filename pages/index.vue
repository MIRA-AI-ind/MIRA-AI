<template>
  <div class="flex flex-col h-[90vh] bg-white rounded-lg shadow-xl">
    <!-- Chat Header -->
    <div class="p-4 border-b">
      <h2 class="text-xl font-semibold">New Chat</h2>
    </div>

    <!-- Chat Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain" ref="chatContainer">
      <div v-for="(message, index) in messages" :key="index"
        :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']">
        <div
          :class="[
            'max-w-[80%] rounded-lg p-4',
            message.role === 'user'
              ? 'bg-primary text-primary-content ml-4'
              : 'bg-base-200 text-base-content mr-4'
          ]"
        >
          {{ message.content }}
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="border-t p-4">
      <form @submit.prevent="sendMessage" class="flex gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type your message..."
          class="input input-bordered flex-1"
          :disabled="isLoading"
        />
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isLoading || !newMessage.trim()"
        >
          {{ isLoading ? 'Sending...' : 'Send' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const newMessage = ref('')
const isLoading = ref(false)
const messages = ref([
  { role: 'assistant', content: 'Hello! How can I help you today?' }
])
const chatContainer = ref(null)

const scrollToBottom = () => {
  // For desktop, respect auto-scroll setting
  if (!isMobile && !appSettings?.value?.autoScroll) return

  nextTick(() => {
    if (chatContainer.value) {
      const scrollHeight = chatContainer.value.scrollHeight
      const clientHeight = chatContainer.value.clientHeight
      const maxScroll = scrollHeight - clientHeight
      
      chatContainer.value.scrollTo({
        top: maxScroll,
        behavior: 'smooth'
      })
    }
  })
}

// Helper to check if device is mobile
const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth < 768
  }
  return false
})

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: newMessage.value
  })

  const userInput = newMessage.value
  newMessage.value = ''
  isLoading.value = true
  // Scroll after user sends message
  if (isMobile.value) scrollToBottom()

  try {
    // TODO: Implement actual API call
    // Simulate API delay for now
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    messages.value.push({
      role: 'assistant',
      content: `I received your message: "${userInput}"`
    })
    // Scroll after receiving AI response
    if (isMobile.value) scrollToBottom()
  } catch (error) {
    console.error('Error:', error)
    messages.value.push({
      role: 'assistant',
      content: 'Sorry, there was an error processing your request.'
    })
    // Scroll after error message
    if (isMobile.value) scrollToBottom()
  } finally {
    isLoading.value = false
  }
}

// Only watch messages for desktop auto-scroll
watch(messages, () => {
  if (!isMobile.value && appSettings?.value?.autoScroll) {
    scrollToBottom()
  }
}, { deep: true })
</script> 