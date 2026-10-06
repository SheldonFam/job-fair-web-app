<script setup lang="ts">
import { computed, ref } from 'vue'
import { Globe, Menu } from '@lucide/vue'
import { navLinks } from '@/data/navigation'
import BaseSelect from './BaseSelect.vue'

defineEmits<{ openExhibitor: []; openNav: [] }>()

const languages = [
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'ms', label: 'Bahasa Melayu', shortLabel: 'BM' },
  { value: 'zh', label: '中文', shortLabel: '中文' },
]

// UI only for now: this remembers the choice but does not translate the page yet
const selectedLanguage = ref('en')
const currentLanguage = computed(
  () => languages.find((language) => language.value === selectedLanguage.value) ?? languages[0]!,
)
</script>

<template>
  <header class="header">
    <div class="container header-inner">
      <a href="#top" class="header-brand">
        <span class="header-brand-name">CareerConnect</span>
        <span class="header-brand-tagline">Job Fair 2026</span>
      </a>

      <nav class="header-nav" aria-label="Main">
        <ul class="header-nav-list">
          <li v-for="link in navLinks" v-bind:key="link.sectionId">
            <a v-bind:href="`#${link.sectionId}`" class="header-nav-link">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <BaseSelect
          v-model="selectedLanguage"
          compact
          label="Change language"
          v-bind:options="languages"
        >
          <template v-slot:value>
            <Globe v-bind:size="18" aria-hidden="true" />
            <span v-bind:lang="currentLanguage.value">{{ currentLanguage.shortLabel }}</span>
          </template>
        </BaseSelect>

        <button
          type="button"
          class="btn btn-dark btn-sm header-cta"
          v-on:click="$emit('openExhibitor')"
        >
          Be Our Exhibitor
        </button>

        <button
          type="button"
          class="icon-button header-menu-button"
          aria-label="Open menu"
          v-on:click="$emit('openNav')"
        >
          <Menu v-bind:size="22" aria-hidden="true" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: var(--header-height);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* brand */
.header-brand {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  text-decoration: none;
}

.header-brand-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--heading);
}

.header-brand-tagline {
  font-size: 12px;
  color: var(--muted);
}

/* navigation */
.header-nav-list {
  display: flex;
  gap: 28px;
}

.header-nav-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-size: 16px;
  font-weight: 500;
  color: var(--body);
  text-decoration: none;
  transition: color 0.15s;
}

.header-nav-link:hover {
  color: var(--heading);
}

/* mobile menu button: hidden on desktop */
.header-menu-button {
  display: none;
}

@media (max-width: 1024px) {
  .header-nav,
  .header-cta {
    display: none;
  }
  .header-menu-button {
    display: inline-flex;
  }
}
</style>
