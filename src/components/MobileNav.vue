<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { X } from '@lucide/vue'
import { navLinks } from '@/data/navigation'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; openExhibitor: [] }>()

const panel = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

let menuButton: HTMLElement | null = null

const onOpen = async () => {
  menuButton = document.activeElement as HTMLElement | null
  document.body.style.overflow = 'hidden'

  await nextTick()
  closeButton.value?.focus()
}

const onClose = () => {
  document.body.style.overflow = ''
  menuButton?.focus()
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) onOpen()
    else onClose()
  },
)

const keepFocusInside = (event: KeyboardEvent) => {
  const items = panel.value?.querySelectorAll<HTMLElement>('a, button')
  if (!items) return

  const first = items[0]
  const last = items[items.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

const openExhibitor = () => {
  emit('close')
  emit('openExhibitor')
}
</script>

<template>
  <Transition name="mobile-nav">
    <div v-if="open" class="mobile-nav" v-on:keydown.esc="emit('close')">
      <div class="mobile-nav-backdrop" v-on:click="emit('close')"></div>

      <div
        ref="panel"
        class="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        v-on:keydown.tab="keepFocusInside"
      >
        <div class="mobile-nav-header">
          <span class="mobile-nav-title">Menu</span>
          <button
            ref="closeButton"
            type="button"
            class="icon-button"
            aria-label="Close menu"
            v-on:click="emit('close')"
          >
            <X v-bind:size="20" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile">
          <ul>
            <li v-for="link in navLinks" v-bind:key="link.sectionId">
              <a
                v-bind:href="`#${link.sectionId}`"
                class="mobile-nav-link"
                v-on:click="emit('close')"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>

        <button type="button" class="btn btn-dark mobile-nav-cta" v-on:click="openExhibitor">
          Be Our Exhibitor
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.mobile-nav {
  position: fixed;
  inset: 0;
  z-index: 100;
}

.mobile-nav-backdrop {
  position: absolute;
  inset: 0;
  background: var(--overlay);
}

/* the white panel on the left */
.mobile-nav-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 300px;
  max-width: 85%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background: var(--surface);
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.mobile-nav-title {
  font-weight: 800;
  color: var(--heading);
}

.mobile-nav-link {
  display: block;
  padding: 14px 8px;
  border-bottom: 1px solid var(--border);
  font-weight: 600;
  color: var(--heading);
  text-decoration: none;
}

.mobile-nav-link:hover {
  color: var(--primary);
}

.mobile-nav-cta {
  margin-top: 24px;
}

/* Open and close animation: the whole menu fades, the panel slides in from the left. */
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: opacity 0.25s;
}

.mobile-nav-enter-active .mobile-nav-panel,
.mobile-nav-leave-active .mobile-nav-panel {
  transition: translate 0.25s;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
}

.mobile-nav-enter-from .mobile-nav-panel,
.mobile-nav-leave-to .mobile-nav-panel {
  translate: -100% 0;
}
</style>
