<template>
  <Transition name="modal-backdrop">
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop click handler -->
      <div class="absolute inset-0" @click="$emit('update:modelValue', false)"></div>
      
      <div class="modal-box max-w-2xl w-full bg-base-100 rounded-lg shadow-xl animate-slideUp relative" :data-theme="theme" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-base-content">Settings</h2>
          <button @click="$emit('update:modelValue', false)" class="btn btn-ghost btn-sm">
            <IconX class="w-5 h-5" />
          </button>
        </div>
        
        <div class="prose max-w-none overflow-y-auto max-h-[70vh]" :class="theme === 'dark' ? 'prose-invert' : ''">
          <div class="space-y-6">
            <!-- Settings sections will go here -->
            <section>
              <h3 class="text-base-content">Appearance</h3>
              <div class="space-y-4">
                <div class="form-control">
                  <label class="label cursor-pointer justify-start gap-4">
                    <span class="label-text">Theme</span>
                    <div class="flex gap-2">
                      <span>Light</span>
                      <input 
                        v-model="isDarkTheme"
                        type="checkbox" 
                        class="toggle" 
                      />
                      <span>Dark</span>
                    </div>
                  </label>
                </div>
                <div class="form-control">
                  <label class="label cursor-pointer justify-start gap-4">
                    <span class="label-text">Font Size</span>
                    <select v-model="localSettings.fontSize" class="select select-sm select-bordered">
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </label>
                </div>
                <div class="form-control">
                  <label class="label cursor-pointer justify-start gap-4">
                    <span class="label-text">Message Spacing</span>
                    <select v-model="localSettings.messageSpacing" class="select select-sm select-bordered">
                      <option value="compact">Compact</option>
                      <option value="normal">Normal</option>
                      <option value="relaxed">Relaxed</option>
                    </select>
                  </label>
                </div>
              </div>
            </section>
            
            <section>
              <h3 class="text-base-content">Chat Settings</h3>
              <div class="space-y-4">
                <div class="form-control">
                  <label class="label cursor-pointer justify-start gap-4">
                    <span class="label-text">Auto-scroll to new messages</span>
                    <input 
                      v-model="localSettings.autoScroll" 
                      type="checkbox" 
                      class="toggle"
                    />
                  </label>
                </div>
                <div class="form-control">
                  <label class="label cursor-pointer justify-start gap-4">
                    <span class="label-text">Mobile keyboard behavior</span>
                    <select v-model="localSettings.mobileEnterBehavior" class="select select-sm select-bordered">
                      <option value="newline">New line (use Send button)</option>
                      <option value="send">Send message</option>
                    </select>
                  </label>
                </div>
                <div class="form-control">
                  <label class="label cursor-pointer justify-start gap-4">
                    <span class="label-text">Enter to send</span>
                    <input 
                      v-model="localSettings.enterToSend" 
                      type="checkbox" 
                      class="toggle"
                    />
                  </label>
                </div>
              </div>
            </section>
            
            <section>
              <h3 class="text-base-content">AI Settings</h3>
              <div class="opacity-50">Coming soon: Model selection, response length, temperature</div>
            </section>
            
            <section>
              <h3 class="text-base-content">Privacy</h3>
              <div class="opacity-50">Coming soon: Data retention, export options</div>
            </section>
            
            <div class="flex justify-end gap-2 mt-6">
              <button 
                @click="$emit('update:modelValue', false)" 
                class="btn btn-ghost"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import IconX from './IconX.vue'
import { computed, ref, onMounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  theme: {
    type: String,
    required: true
  },
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'update:theme', 'update:settings'])

// Computed for theme toggle
const isDarkTheme = computed({
  get: () => props.theme === 'dark',
  set: (value) => emit('update:theme', value ? 'dark' : 'light')
})

// Use props for settings
const localSettings = computed({
  get: () => props.settings,
  set: (value) => emit('update:settings', value)
})
</script> 