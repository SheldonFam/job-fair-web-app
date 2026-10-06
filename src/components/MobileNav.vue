<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { X } from '@lucide/vue'
import { navLinks } from '@/data/navigation'
import { useModal } from '@/composables/useModal'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; openExhibitor: [] }>()

const panel = ref<HTMLElement | null>(null)

const { t } = useI18n()

const { keepFocusInside } = useModal(() => props.open, panel)

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
        v-bind:aria-label="t('nav.menu')"
        v-on:keydown.tab="keepFocusInside"
      >
        <div class="mobile-nav-header">
          <span class="mobile-nav-title">{{ t('nav.menu') }}</span>
          <button
            type="button"
            class="icon-button"
            v-bind:aria-label="t('nav.closeMenu')"
            v-on:click="emit('close')"
          >
            <X v-bind:size="20" aria-hidden="true" />
          </button>
        </div>

        <nav v-bind:aria-label="t('nav.mobile')">
          <ul>
            <li v-for="sectionId in navLinks" v-bind:key="sectionId">
              <a v-bind:href="`#${sectionId}`" class="mobile-nav-link" v-on:click="emit('close')">
                {{ t(`nav.${sectionId}`) }}
              </a>
            </li>
          </ul>
        </nav>

        <button type="button" class="btn btn-dark mobile-nav-cta" v-on:click="openExhibitor">
          {{ t('header.beExhibitor') }}
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
