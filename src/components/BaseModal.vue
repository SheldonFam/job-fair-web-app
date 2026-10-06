<script setup lang="ts">
import { ref, useId } from 'vue'
import { X } from '@lucide/vue'
import { useModal } from '@/composables/useModal'

const props = defineProps<{ open: boolean; title: string; wide?: boolean }>()
const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
const titleId = useId()

const { keepFocusInside } = useModal(() => props.open, panel)
</script>

<template>
  <!-- Teleport moves the modal to the end of <body>, so it always sits above the page -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal" v-on:keydown.esc="emit('close')">
        <div class="modal-backdrop" v-on:click="emit('close')"></div>

        <div
          ref="panel"
          class="modal-panel"
          v-bind:class="{ 'is-wide': wide }"
          role="dialog"
          aria-modal="true"
          v-bind:aria-labelledby="titleId"
          v-on:keydown.tab="keepFocusInside"
        >
          <div class="modal-header">
            <h2 v-bind:id="titleId" class="modal-title">{{ title }}</h2>
            <button type="button" class="icon-button" aria-label="Close" v-on:click="emit('close')">
              <X v-bind:size="20" aria-hidden="true" />
            </button>
          </div>

          <div class="modal-body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* covers the whole screen and centres the panel */
.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: var(--overlay);
}

/* the white box: scrolls inside when the content is taller than the screen */
.modal-panel {
  position: relative;
  width: 100%;
  max-width: 560px;
  max-height: 100%;
  overflow-y: auto;
  border-radius: var(--radius-card);
  background: var(--surface);
  box-shadow: var(--shadow-menu);
}

/* wide version, used by the floor plan lightbox */
.modal-panel.is-wide {
  max-width: 1240px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 16px 16px 24px;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: 20px;
}

.modal-body {
  padding: 24px;
}

/* Open and close animation: the whole modal fades, the panel grows slightly. */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: scale(0.96);
}

@media (max-width: 640px) {
  .modal-header {
    padding: 12px 12px 12px 16px;
  }

  .modal-body {
    padding: 16px;
  }
}
</style>
