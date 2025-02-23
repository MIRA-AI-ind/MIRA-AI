<template>
  <div class="relative group">
    <pre><code :class="language" v-html="highlightedCode"></code></pre>
    <button 
      @click="copyCode"
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity btn btn-sm btn-ghost bg-base-200 hover:bg-base-300 z-10"
    >
      <span v-if="copied" class="text-success">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
      <span v-else>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
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