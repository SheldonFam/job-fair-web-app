<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ChevronDown, Globe, Menu } from '@lucide/vue'
import { navLinks } from '@/data/navigation'

defineEmits<{ openExhibitor: []; openNav: [] }>()

const languages = [
  { code: 'en', shortLabel: 'EN', name: 'English' },
  { code: 'ms', shortLabel: 'BM', name: 'Bahasa Melayu' },
  { code: 'zh', shortLabel: '中文', name: '中文' },
]

// UI only for now: this remembers the choice but does not translate the page yet
const selectedLanguage = ref('en')
const isLanguageOpen = ref(false)
const currentLanguage = computed(
  () => languages.find((language) => language.code === selectedLanguage.value) ?? languages[0]!,
)

const pickLanguage = (code: string) => {
  selectedLanguage.value = code
  isLanguageOpen.value = false
}
</script>

<template>
  <header class="header">
    <div class="container header-inner">
      <a href="#top" class="brand">
        <span class="brand-name">CareerConnect</span>
        <span class="brand-tagline">Job Fair 2026</span>
      </a>

      <nav class="header-nav" aria-label="Main">
        <ul class="header-nav-list">
          <li v-for="link in navLinks" v-bind:key="link.sectionId">
            <a v-bind:href="`#${link.sectionId}`" class="header-nav-link">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <div class="language" v-on:keydown.esc="isLanguageOpen = false">
          <button
            type="button"
            class="language-button"
            aria-haspopup="listbox"
            v-bind:aria-expanded="isLanguageOpen"
            aria-label="Change language"
            v-on:click="isLanguageOpen = !isLanguageOpen"
          >
            <Globe v-bind:size="18" aria-hidden="true" />
            <span v-bind:lang="currentLanguage.code">{{ currentLanguage.shortLabel }}</span>
            <ChevronDown
              class="language-chevron"
              v-bind:class="{ 'is-open': isLanguageOpen }"
              v-bind:size="16"
              aria-hidden="true"
            />
          </button>

          <template v-if="isLanguageOpen">
            <div class="language-backdrop" v-on:click="isLanguageOpen = false"></div>

            <ul class="language-menu" role="listbox" aria-label="Change language">
              <li v-for="language in languages" v-bind:key="language.code" role="presentation">
                <button
                  type="button"
                  role="option"
                  class="language-option"
                  v-bind:class="{ 'is-selected': selectedLanguage === language.code }"
                  v-bind:aria-selected="selectedLanguage === language.code"
                  v-bind:lang="language.code"
                  v-on:click="pickLanguage(language.code)"
                >
                  {{ language.name }}
                  <Check
                    v-if="selectedLanguage === language.code"
                    class="language-check"
                    v-bind:size="18"
                    aria-hidden="true"
                  />
                </button>
              </li>
            </ul>
          </template>
        </div>

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
.brand {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  text-decoration: none;
}

.brand-name {
  font-size: 17px;
  font-weight: 800;
  color: var(--heading);
}

.brand-tagline {
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
  font-size: 15px;
  font-weight: 500;
  color: var(--body);
  text-decoration: none;
  transition: color 0.15s;
}

.header-nav-link:hover {
  color: var(--heading);
}

/* language dropdown */
.language {
  position: relative;
}

.language-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 12px;
  border: 1.5px solid var(--border-medium);
  border-radius: var(--radius);
  background: var(--surface);
  font-size: 15px;
  font-weight: 600;
  color: var(--heading);
  cursor: pointer;
  transition: border-color 0.15s;
}

.language-button:hover {
  border-color: var(--border-strong);
}

.language-button[aria-expanded='true'] {
  border-color: var(--primary);
  box-shadow: var(--focus-ring);
}

.language-chevron {
  color: var(--body);
  transition: rotate 0.2s;
}

.language-chevron.is-open {
  rotate: 180deg;
}

.language-backdrop {
  position: fixed;
  inset: 0;
}

.language-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 200px;
  padding: 6px;
  border-radius: var(--radius-card);
  background: var(--surface);
  box-shadow: var(--shadow-menu);
}

.language-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--radius-small);
  background: none;
  font-size: 15px;
  color: var(--heading);
  text-align: left;
  cursor: pointer;
}

.language-option:hover {
  background: var(--surface-muted);
}

.language-option.is-selected {
  background: var(--primary-light);
  font-weight: 600;
}

.language-check {
  color: var(--primary);
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
