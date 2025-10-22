<template>
  <!-- Full-screen loading animation -->
  <div v-if="isInitializing" class="fixed inset-0 bg-gradient-to-br from-base-100 via-base-200 to-base-100 z-[100] flex flex-col items-center justify-center">
    <div class="flex flex-col items-center gap-8">
      <!-- Logo/Brand with gradient -->
      <div class="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 animate-pulse">
        MIRA
      </div>
      <!-- Animated loading spinner with glow -->
      <div class="relative">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <div class="absolute inset-0 loading loading-spinner loading-lg text-primary opacity-30 blur-md"></div>
      </div>
      <!-- Loading text -->
      <div class="flex flex-col items-center gap-2">
        <p class="text-base-content text-lg font-medium">Initializing MIRA</p>
        <p class="text-base-content/60 text-sm animate-pulse">Loading your conversations...</p>
      </div>
    </div>
  </div>

  <!-- Main app -->
  <div class="flex flex-col md:flex-row h-screen" :data-theme="theme" :class="{ 'opacity-0': isInitializing }">
    <!-- Loading overlay -->
    <div v-if="isInitializing" class="fixed inset-0 bg-base-100 z-[100] flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <p class="text-base-content animate-pulse">Loading MIRA...</p>
      </div>
    </div>

    <!-- Mobile Menu Button -->
    <div class="fixed top-0 left-0 right-0 md:hidden bg-base-100/95 backdrop-blur-lg border-b border-base-300 h-16 z-50 shadow-lg">
      <div class="flex items-center justify-between h-full px-4">
        <button 
          @click="toggleSidebar"
          class="btn btn-ghost btn-circle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Mobile Brand -->
        <div class="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          MIRA
        </div>

        <div class="flex gap-1">
          <!-- Mobile Theme Button -->
          <button 
            @click="toggleTheme"
            class="btn btn-ghost btn-circle text-base-content"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="theme === 'dark'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Mobile New Chat Button -->
          <button 
            @click="startNewChat"
            class="btn btn-ghost btn-circle"
          >
            <IconPlus class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="w-80 bg-gradient-to-b from-base-200 to-base-100 flex flex-col fixed md:static top-0 bottom-0 -left-80 md:left-0 z-50 transition-all duration-300 border-r border-base-300 shadow-xl"
      :class="{ 'left-0': isSidebarOpen }">
      <div class="p-5 flex-1 overflow-hidden flex flex-col">
        <!-- Mobile Header -->
        <div class="flex justify-between items-center md:hidden mb-6">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MIRA</h1>
          <button @click="toggleSidebar" class="btn btn-ghost btn-sm btn-circle">
            <IconX class="w-5 h-5" />
          </button>
        </div>

        <!-- Desktop Brand -->
        <div class="hidden md:flex items-center justify-center mb-6">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            MIRA
          </h1>
        </div>

        <!-- Details Button -->
        <button @click="showDetails = true" class="btn btn-outline btn-primary mb-3 w-full rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg">
          <IconInfo class="w-4 h-4" />
          Details
        </button>

        <!-- Settings Button -->
        <button @click="showSettings = true" class="btn btn-outline btn-secondary mb-3 w-full rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg">
          <IconSettings class="w-4 h-4" />
          Settings
        </button>

        <!-- Import Button (Mobile) -->
        <button 
          @click="$refs.fileInput.click()"
          class="btn btn-outline btn-accent mb-4 w-full rounded-xl flex items-center justify-center gap-2 transition-all md:hidden relative z-[60] hover:shadow-lg"
          title="Import chat"
        >
          <IconImport class="w-4 h-4" />
          Import Chat
        </button>

        <!-- Theme and New Chat buttons -->
        <div class="hidden md:flex gap-3 mb-6">
          <button @click="startNewChat" class="flex-1 btn btn-primary rounded-xl shadow-md hover:shadow-lg">
            <IconPlus class="w-4 h-4 mr-2" />
            New Chat
          </button>
          <button 
            @click="$refs.fileInput.click()" 
            class="btn btn-ghost btn-circle hover:bg-primary/10"
            title="Import chat"
          >
            <IconImport class="w-5 h-5" />
          </button>
          <button @click="toggleTheme" class="btn btn-ghost btn-circle hover:bg-secondary/10">
            <IconSun v-if="theme === 'dark'" class="w-5 h-5" />
            <IconMoon v-else class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Chat List -->
        <div class="flex flex-col gap-3 flex-1 overflow-hidden">
          <!-- Search input -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search chats..."
              class="input input-bordered w-full rounded-xl pl-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Chat list -->
          <div class="flex-1 overflow-y-auto space-y-2 pr-2">
            <TransitionGroup name="chat-list">
              <div v-for="(chat, index) in filteredChats" :key="chat.id"
                class="rounded-xl p-3 hover:bg-base-300/50 cursor-pointer transition-all flex items-center justify-between group border-l-4 border-transparent shadow-sm hover:shadow-md sidebar-item"
                :class="{ 'bg-gradient-to-r from-primary/10 to-transparent border-l-primary shadow-md': currentChatId === chat.id }">
                <div class="flex-1 min-w-0" @click="selectChat(chat.id)">
                  <p class="truncate text-sm font-medium" :class="{ 'text-primary font-semibold': currentChatId === chat.id }">
                    {{ chat.title || 'New Chat' }}
                  </p>
                  <p class="text-xs text-base-content/50 mt-1">
                    {{ chat.messages.length }} messages
                  </p>
                </div>
                <div class="flex gap-1">
                  <!-- Export Button -->
                  <button 
                    @click.stop="exportChat(chat)"
                    class="btn btn-ghost btn-xs text-info md:opacity-0 md:group-hover:opacity-100 transition-all hover:scale-110"
                    title="Export chat"
                  >
                    <IconShare class="w-4 h-4" />
                  </button>
                  <button 
                    @click.stop="startRenameChat(chat)"
                    class="btn btn-ghost btn-xs text-warning md:opacity-0 md:group-hover:opacity-100 transition-all hover:scale-110"
                    title="Rename chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click.stop="deleteChat(chat.id)"
                    class="btn btn-ghost btn-xs text-error md:opacity-0 md:group-hover:opacity-100 transition-all hover:scale-110"
                    title="Delete chat"
                    :disabled="chats.length === 1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col md:pl-0 pt-16 md:pt-0 bg-gradient-to-b from-base-100 via-base-100 to-base-200">
      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto pb-24 md:pb-4" ref="chatContainer">
        <TransitionGroup name="message">
          <div v-for="(message, index) in currentMessages" :key="index"
            class="message-bubble">
            <div class="max-w-4xl mx-auto px-4" 
              :class="[
                messageSpacingClass,
                message.role === 'assistant' ? 'bg-base-200/50' : ''
              ]">
              <div class="flex items-start gap-4 md:gap-6">
                <div class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                  :class="message.role === 'assistant' ? 'bg-gradient-to-br from-primary to-blue-600' : 'bg-gradient-to-br from-secondary to-purple-600'">
                  <img 
                    v-if="message.role === 'assistant'" 
                    src="/logo.png" 
                    alt="MIRA"
                    class="w-8 h-8 rounded-xl object-cover"
                  />
                  <IconUser v-else class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1 prose max-w-none" :class="[messageClass, theme === 'dark' ? 'prose-invert' : '']">
                  <div v-if="message.role === 'assistant'" class="relative">
                    <!-- Handle image type messages -->
                    <div v-if="message.type === 'image'" class="not-prose">
                      <img 
                        :src="message.content" 
                        :alt="message.prompt || 'Generated image'"
                        class="rounded-lg max-w-full h-auto shadow-lg"
                      />
                      <div class="text-sm text-base-content/60 mt-2">
                        Prompt: {{ message.prompt }}
                      </div>
                    </div>
                    <!-- Handle text messages -->
                    <div v-else>
                      <div v-if="!isCodeBlock(message.content)" class="whitespace-pre-wrap">
                        <div v-html="marked(message.content || '')"></div>
                      </div>
                      <div v-else>
                        <div class="not-prose">
                          <CodeBlock 
                            :code="extractCode(message.content)" 
                            :language="detectLanguage(message.content)" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="whitespace-pre-wrap">
                    {{ message.content || message.text || '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isLoading" key="typing" class="message-bubble">
            <div class="max-w-4xl mx-auto px-4 p-3 md:p-6 bg-base-200/50">
              <div class="flex items-start gap-4 md:gap-6">
                <div class="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary to-blue-600 shadow-lg animate-pulse">
                  <img 
                    src="/logo.png" 
                    alt="MIRA"
                    class="w-8 h-8 rounded-xl object-cover"
                  />
                </div>
                <div class="flex items-center gap-2 mt-2">
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Input Area -->
      <div class="border-t border-base-300 fixed bottom-0 left-0 right-0 md:static bg-gradient-to-t from-base-100 to-base-100/95 backdrop-blur-lg shadow-2xl">
        <div class="max-w-4xl mx-auto p-4 md:p-6">
          <form @submit.prevent="sendMessage" class="relative">
            <textarea
              v-model="newMessage"
              placeholder="Send a message to MIRA..."
              class="w-full textarea textarea-bordered bg-base-200 pr-28 pl-4 py-3 min-h-[3.5rem] md:min-h-[4rem] max-h-40 text-base resize-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-md"
              :disabled="isLoading"
              @keydown.enter.exact.prevent="handleEnterKey"
              @keydown.ctrl.enter.prevent="newMessage += '\n'"
              rows="1"
            ></textarea>
            <button 
              type="submit"
              class="absolute right-3 top-1/2 -translate-y-1/2 btn btn-primary rounded-xl shadow-lg hover:shadow-xl"
              :disabled="isLoading || !newMessage.trim()"
            >
              <span class="hidden md:inline mr-1">Send</span>
              <IconSend v-if="!isLoading" class="w-5 h-5" />
              <IconSpinner v-else class="w-5 h-5 animate-spin" />
            </button>
          </form>
          <div class="mt-2 text-xs text-base-content/50 text-center">
            {{ isMobile.value 
              ? 'Press Enter for new line, tap Send to send' 
              : 'Press Enter to send • Ctrl + Enter for new line' 
            }}
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
      @click="toggleSidebar"
    ></div>
  </div>

  <!-- Details Modal -->
  <Transition name="modal-backdrop">
    <div v-if="showDetails" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <!-- Backdrop click handler -->
      <div class="absolute inset-0" @click="showDetails = false"></div>
      
      <div class="modal-box max-w-3xl w-full bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-2xl animate-slideUp relative border border-base-300" :data-theme="theme" @click.stop>
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-base-300">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MIRA</h2>
          <button @click="showDetails = false" class="btn btn-ghost btn-sm btn-circle hover:bg-error/10 hover:text-error">
            <IconX class="w-5 h-5" />
          </button>
        </div>
        
        <div class="prose max-w-none overflow-y-auto max-h-[70vh]" :class="theme === 'dark' ? 'prose-invert' : ''">
          <div class="space-y-6">
            <section>
              <h3 class="text-base-content">🎯 Recent Updates</h3>
              <ul>
                <li>Added chat search functionality</li>
                <li>Added most recent chats first ordering</li>
                <li>Added chat renaming functionality</li>
                <li>Improved chat list UI with better visibility and dividers</li>
                <li>Enhanced mobile delete button accessibility</li>
                <li>Redesigned details button with smooth hover effects</li>
                <li>Added left border indicators for active chats</li>
                <li>Improved chat input box sizing and usability</li>
                <li>Added multi-line support with Shift+Enter</li>
                <li>Added theme persistence across sessions</li>
                <li>Added local storage persistence for chats</li>
                <li>Implemented chat deletion functionality</li>
                <li>Added branded loading screen</li>
                <li>Improved mobile navigation</li>
                <li>Enhanced markdown rendering</li>
                <li>Added auto-save functionality</li>
                <li>Added animated details modal</li>
                <li>Improved UI animations and transitions</li>
                <li>Added typing indicator animation</li>
              </ul>
            </section>
            
            <section>
              <h3 class="text-base-content">🚧 Upcoming Features</h3>
              <ul>
                <li>Image generation with /art command</li>
                <li>Enhanced .mira file format to support images</li>
                <li>Image export/import in chat history</li>
                <li>Image preview and gallery view</li>
                <li>Improved chat organization options</li>
                <li>Advanced search filters</li>
                <li>Chat folders and categories</li>
                <li>Chat pinning</li>
                <li>Chat archiving</li>
                <li>Chat statistics</li>
              </ul>
            </section>
            
            <section>
              <h3 class="text-base-content">✨ Features</h3>
              <ul>
                <li>Modern, responsive UI with dark/light themes</li>
                <li>Code syntax highlighting</li>
                <li>Chat history management</li>
                <li>Markdown rendering</li>
                <li>Chat export/import via encrypted .mira files</li>
                <li>Chat renaming functionality</li>
                <li>Auto-save functionality</li>
                <li>Animated UI transitions</li>
                <li>Multi-line message support</li>
              </ul>
            </section>
            
            <section>
              <h3 class="text-base-content">🚀 Coming Soon</h3>
              <ul>
                <li>Advanced AI commands (/think, /art, /voice)</li>
                <li>User authentication system</li>
                <li>Cloud sync and real-time collaboration</li>
                <li>Multi-device chat history sync</li>
                <li>Session management and user profiles</li>
                <li>Real-time response streaming</li>
                <li>File attachments support</li>
                <li>Code execution capabilities</li>
              </ul>
            </section>
            
            <section>
              <h3 class="text-base-content">💡 About MIRA</h3>
              <p>MIRA (Mega Intelligent Reasoning AI) is an advanced chat interface powered by Cloudflare Workers AI. 
                 Built with modern technologies like Vue 3, Nuxt 3, and TailwindCSS, it offers a seamless and responsive chat experience.</p>
              <p>Currently optimized for single-device use with local storage, future updates will bring multi-device sync and cloud storage capabilities.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Settings Modal -->
  <SettingsModal
    v-model="showSettings"
    :theme="theme"
    @update:theme="updateTheme"
    v-model:settings="appSettings"
  />

  <!-- Import File Input -->
  <input 
    ref="fileInput"
    type="file"
    accept=".mira"
    class="hidden"
    @change="importChat"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import CodeBlock from '~/components/CodeBlock.vue'
import IconX from '~/components/IconX.vue'
import IconInfo from '~/components/IconInfo.vue'
import ChatActions from '~/components/ChatActions.vue'
import { encryptChat, decryptChat } from '~/utils/encryption'
import IconShare from '~/components/IconShare.vue'
import IconImport from '~/components/IconImport.vue'
import IconUser from '~/components/IconUser.vue'
import IconSettings from '~/components/IconSettings.vue'
import SettingsModal from '~/components/SettingsModal.vue'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)

// Add TypeScript interface for messages
interface Message {
  role: 'user' | 'assistant';
  content?: string;
  text?: string;
  type?: 'text' | 'image';
  prompt?: string;
  timestamp: number;
}

// Add TypeScript interface for chat
interface Chat {
  id: number;
  title: string;
  messages: Message[];
  timestamp: number;
}

// Helper functions with proper TypeScript types
const isCodeBlock = (content: string | undefined): boolean => {
  return content ? content.includes('```') : false;
}

const extractCode = (content: string | undefined): string => {
  if (!content) return '';
  const match = content.match(/```(\w+)?\s*([\s\S]*?)```/);
  return match ? match[2].trim() : content;
}

const detectLanguage = (content: string | undefined): string => {
  if (!content) return '';
  const match = content.match(/```(\w+)/);
  return match ? match[1] : '';
}

const getTextAfterCode = (content: string | undefined): string => {
  if (!content) return '';
  const parts = content.split('```');
  return parts[parts.length - 1].trim();
}

const theme = ref<'dark' | 'light'>('dark')
const isSidebarOpen = ref(false)
const newMessage = ref('')
const isLoading = ref(false)
const isInitializing = ref(true)
const chatContainer = ref<HTMLElement | null>(null)
const currentChatId = ref(1)
const showDetails = ref(false)
const showSettings = ref(false)
const editingChat = ref<Chat | null>(null)

const defaultChat: Chat = {
  id: 1,
  title: 'New Chat',
  messages: [
    { 
      role: 'assistant',
      content: 'Hello! I am MIRA, your AI assistant. You can use /think for complex reasoning or ask me any questions directly. How can I help you today?',
      timestamp: Date.now()
    }
  ],
  timestamp: Date.now()
}

const chats = ref<Chat[]>([defaultChat])

// Add search functionality
const searchQuery = ref('')
const filteredChats = computed(() => {
  // Sort chats by last message timestamp, fallback to id for new chats
  const sorted = [...chats.value].sort((a, b) => {
    const aTime = a.messages.length ? a.messages[a.messages.length - 1].timestamp || a.id : a.id
    const bTime = b.messages.length ? b.messages[b.messages.length - 1].timestamp || b.id : b.id
    return bTime - aTime // Descending order (newest first)
  })
  
  if (!searchQuery.value) return sorted
  
  const query = searchQuery.value.toLowerCase()
  return sorted.filter(chat => 
    chat.title?.toLowerCase().includes(query) || 
    chat.messages.some(msg => msg.content.toLowerCase().includes(query))
  )
})

// Update app settings to remove enterToSend
const appSettings = ref({
  autoScroll: true,
  fontSize: 'medium',
  messageSpacing: 'normal'
})

// Helper to check if device is mobile
const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth < 768
  }
  return false
})

// Load settings on mount
onMounted(() => {
  if (process.client) {
    // Load theme
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    }
    
    // Load app settings
    const savedSettings = localStorage.getItem('mira-settings')
    if (savedSettings) {
      appSettings.value = JSON.parse(savedSettings)
    }

    // Load last chat and initialize app
    loadLastChat()
  } else {
    // Ensure app initializes even in SSR context
    initializeApp()
  }
})

// Apply font size setting
const messageClass = computed(() => {
  const sizes = {
    small: 'prose-sm',
    medium: 'prose-base',
    large: 'prose-lg'
  }
  return sizes[appSettings.value.fontSize] || 'prose-base'
})

// Apply message spacing
const messageSpacingClass = computed(() => {
  const spacing = {
    compact: 'p-2 md:p-4',
    normal: 'p-3 md:p-6',
    relaxed: 'p-4 md:p-8'
  }
  return spacing[appSettings.value.messageSpacing] || spacing.normal
})

// Speed up initialization
const initializeApp = () => {
  // Set a small timeout to ensure DOM is ready
  setTimeout(() => {
    isInitializing.value = false
    
    // Scroll to bottom after a brief delay to ensure content is rendered
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
  }, 100) // Small delay to ensure smooth transition
}

const loadLastChat = () => {
  if (process.client) {
    try {
      // Load saved chats first
      const savedChats = localStorage.getItem('chats')
      if (savedChats) {
        chats.value = JSON.parse(savedChats)
        
        // Sort chats by latest message timestamp
        chats.value.sort((a, b) => {
          const aTime = a.messages.length ? a.messages[a.messages.length - 1].timestamp : a.id
          const bTime = b.messages.length ? b.messages[b.messages.length - 1].timestamp : b.id
          return bTime - aTime // Descending order (newest first)
        })

        // Set current chat to the most recent one
        const lastChatId = localStorage.getItem('currentChatId')
        if (lastChatId) {
          // Try to load the last opened chat
          const lastChat = chats.value.find(c => c.id === parseInt(lastChatId))
          if (lastChat) {
            currentChatId.value = lastChat.id
          } else {
            // If not found, use the most recent chat
            currentChatId.value = chats.value[0].id
          }
        } else {
          // If no saved currentChatId, use the most recent chat
          currentChatId.value = chats.value[0].id
        }
      }

      // Initialize the app after loading data
      initializeApp()
    } catch (error) {
      console.error('Error loading chat data:', error)
      // Ensure app initializes even if there's an error
      initializeApp()
    }
  }
}

// Add currentMessages computed property
const currentMessages = computed((): Message[] => {
  const chat = chats.value.find(c => c.id === currentChatId.value)
  return chat ? chat.messages : []
})

// Watch for changes in chats and save to localStorage
watch(chats, (newChats) => {
  if (process.client) {
    localStorage.setItem('chats', JSON.stringify(newChats))
  }
}, { deep: true })

// Watch for changes in currentChatId and save to localStorage
watch(currentChatId, (newId) => {
  if (process.client) {
    localStorage.setItem('currentChatId', newId.toString())
  }
}, { immediate: true })

// Watch for settings changes
watch(appSettings, (newSettings) => {
  if (process.client) {
    localStorage.setItem('mira-settings', JSON.stringify(newSettings))
  }
}, { deep: true })

const startNewChat = () => {
  const newId = Math.max(0, ...chats.value.map(c => c.id)) + 1
  const newChat = {
    id: newId,
    title: 'New Chat',
    messages: [defaultChat.messages[0]],
    timestamp: Date.now() // Add timestamp for sorting
  }
  chats.value.unshift(newChat) // Add new chat at start
  currentChatId.value = newId
  if (process.client) {
    localStorage.setItem('currentChatId', newId.toString())
  }
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false
  }
}

const selectChat = (id) => {
  currentChatId.value = id
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false
  }
}

const deleteChat = (id) => {
  // Don't delete if it's the last chat
  if (chats.value.length === 1) return

  // Remove the chat
  chats.value = chats.value.filter(chat => chat.id !== id)

  // If we deleted the current chat, switch to another one
  if (currentChatId.value === id) {
    currentChatId.value = chats.value[0].id
  }
}

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  if (process.client) {
    localStorage.setItem('theme', theme.value)
  }
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Configure marked to use the CodeBlock component
marked.setOptions({
  highlight: function(code, lang) {
    return `<code-block code="${encodeURIComponent(code)}" language="${lang || ''}"></code-block>`
  }
})

const sendMessage = async (e?: Event) => {
  if (!newMessage.value.trim() || isLoading.value) return;

  const chat = chats.value.find(c => c.id === currentChatId.value);
  if (!chat) return;
  
  // Add user message with timestamp
  const userMessage: Message = {
    role: 'user',
    content: newMessage.value,
    timestamp: Date.now()
  };
  
  chat.messages.push(userMessage);

  // Update chat title if it's the first user message
  if (chat.messages.length === 2 && chat.title === 'New Chat') {
    chat.title = newMessage.value.slice(0, 30) + (newMessage.value.length > 30 ? '...' : '');
  }

  const userInput = newMessage.value;
  newMessage.value = '';
  isLoading.value = true;

  try {
    const response = await fetch(
      'https://ai-chat-worker.iotserver24.workers.dev',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userInput,
          chatHistory: chat.messages.slice(0, -1).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      }
    );
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }

    // Handle image response
    if (data.type === 'image') {
      const imageMessage: Message = {
        role: 'assistant',
        type: 'image',
        content: data.data,
        prompt: userInput.slice(4).trim(),
        timestamp: Date.now()
      };
      chat.messages.push(imageMessage);
    } else {
      // Handle text response
      const textMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: Date.now()
      };
      chat.messages.push(textMessage);
    }
  } catch (error) {
    console.error('Error:', error);
    const errorMessage: Message = {
      role: 'assistant',
      content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: Date.now()
    };
    chat.messages.push(errorMessage);
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

// Handle enter key based on device and settings
const handleEnterKey = (e: KeyboardEvent) => {
  if (isMobile.value) {
    // On mobile: always new line on enter
    newMessage.value += '\n'
  } else {
    // On desktop: Enter to send, Ctrl+Enter for new line
    if (e.ctrlKey) {
      newMessage.value += '\n'
    } else {
      sendMessage(e)
    }
  }
}

// Fix scroll behavior
const scrollToBottom = () => {
  if (!appSettings.value.autoScroll) return
  
  nextTick(() => {
    if (chatContainer.value) {
      // Use scrollHeight and clientHeight to calculate the scroll position
      const scrollHeight = chatContainer.value.scrollHeight
      const clientHeight = chatContainer.value.clientHeight
      const maxScroll = scrollHeight - clientHeight
      
      // Scroll to the bottom with smooth behavior
      chatContainer.value.scrollTo({
        top: maxScroll,
        behavior: 'smooth'
      })
    }
  })
}

// Watch for new messages and scroll to bottom
watch(currentMessages, scrollToBottom, { deep: true })

// Watch viewport changes on mobile
if (process.client) {
  window.visualViewport?.addEventListener('resize', () => {
    if (appSettings.value.autoScroll) {
      scrollToBottom()
    }
  })
}

const startRenameChat = (chat) => {
  const newTitle = prompt('Enter new chat title:', chat.title)
  if (newTitle !== null && newTitle.trim()) {
    chat.title = newTitle.trim()
  }
}

const exportChat = async (chat) => {
  try {
    const encrypted = encryptChat(chat)
    const blob = new Blob([encrypted], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    // Use chat title for filename, fallback to chat-id if no title
    const safeTitle = (chat.title || `chat-${chat.id}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace special chars with hyphens
      .replace(/^-+|-+$/g, '')     // Remove leading/trailing hyphens
    a.download = `${safeTitle || `chat-${chat.id}`}.mira`
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
        const newId = Math.max(0, ...chats.value.map(c => c.id)) + 1
        chats.value.unshift({ ...chat, id: newId }) // Add imported chat at start
        selectChat(newId)
      } catch (error) {
        console.error('Import error:', error)
        alert('Invalid .mira file')
      }
    }
    reader.readAsText(file)
  } finally {
    event.target.value = ''
  }
}

const fileInput = ref(null)

const updateTheme = (newTheme) => {
  theme.value = newTheme
  if (process.client) {
    localStorage.setItem('theme', newTheme)
  }
}
</script>

<style>
/* Modal animations */
.animate-slideUp {
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center center;
}

/* Button hover effects */
.btn-ghost {
  transition: all 0.2s ease-in-out;
}

.btn-ghost:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

/* Modal backdrop animation */
.modal-backdrop-enter-active {
  animation: fadeIn 0.3s ease-out;
}

.modal-backdrop-leave-active {
  animation: fadeOut 0.2s ease-in;
}

/* Sidebar animation */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

@keyframes slideUp {
  from {
    transform: translateY(30px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Message animations */
.message-enter-active {
  animation: messageSlideIn 0.4s ease-out;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading spinner pulse */
.loading-spinner {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Chat list animations */
.chat-list-enter-active,
.chat-list-leave-active {
  transition: all 0.3s ease;
}

.chat-list-enter-from,
.chat-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.chat-list-move {
  transition: transform 0.3s ease;
}
</style>
