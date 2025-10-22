<template>
  <div class="relative group my-4">
    <div class="absolute top-0 left-0 right-0 bg-base-300 rounded-t-xl px-4 py-2 text-xs text-base-content/60 font-mono border-b border-base-content/10">
      {{ language || 'code' }}
    </div>
    <pre class="!mt-10 !rounded-xl"><code :class="language" v-html="highlightedCode"></code></pre>
    <button 
      @click="copyCode"
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all btn btn-sm btn-ghost bg-base-100/80 hover:bg-base-200 z-10 rounded-lg shadow-lg hover:scale-110"
      :class="{ 'opacity-100': copied }"
    >
      <span v-if="copied" class="text-success flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="text-xs">Copied!</span>
      </span>
      <span v-else class="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span class="text-xs hidden md:inline">Copy</span>
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import hljs from 'highlight.js'

const props = defineProps({
  code: String,
  language: String
})

const copied = ref(false)

const highlightedCode = computed(() => {
  if (props.language && hljs.getLanguage(props.language)) {
    return hljs.highlight(props.code, { language: props.language }).value
  }
  return props.code
})

const copyCode = async () => {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script> 