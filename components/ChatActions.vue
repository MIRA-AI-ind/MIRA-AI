<template>
  <div class="dropdown dropdown-end">
    <button class="btn btn-ghost btn-sm">
      <IconShare />
    </button>
    <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box">
      <li><a @click="exportChat">Export .mira file</a></li>
      <li><a @click="$refs.fileInput.click()">Import .mira file</a></li>
    </ul>
    <input 
      ref="fileInput"
      type="file"
      accept=".mira"
      class="hidden"
      @change="importChat"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { encryptChat, decryptChat } from '~/utils/encryption'
import IconShare from './IconShare.vue'

const emit = defineEmits(['import-chat'])
const props = defineProps({
  chat: {
    type: Object,
    required: true
  }
})

const fileInput = ref(null)

const exportChat = async () => {
  try {
    const encrypted = encryptChat(props.chat)
    
    // Create and download .mira file
    const blob = new Blob([encrypted], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${props.chat.id}.mira`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Export error:', error)
    alert('Failed to export chat')
  }
}

const importChat = async (event) => {
  try {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const encrypted = e.target.result
        const chat = decryptChat(encrypted)
        emit('import-chat', chat)
      } catch (error) {
        console.error('Import error:', error)
        alert('Invalid .mira file')
      }
    }
    reader.readAsText(file)
  } finally {
    event.target.value = '' // Reset input
  }
}
</script> 