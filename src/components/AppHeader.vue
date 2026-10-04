<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ChevronDown, Globe, Menu } from '@lucide/vue'

defineEmits<{ openExhibitor: []; openNav: [] }>()

const links = [
  { id: 'about', label: 'About' },
  { id: 'floorplan', label: 'Floor Plan' },
  { id: 'exhibitors', label: 'Exhibitors' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'contact', label: 'Contact' },
]

const languages = [
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'ms', short: 'BM', name: 'Bahasa Melayu' },
  { code: 'zh', short: '中文', name: '中文' },
]

// UI only for now: this remembers the choice but does not translate the page yet
const selectedLanguage = ref('en')
const isLangOpen = ref(false)
const currentLanguage = computed(
  () => languages.find((lang) => lang.code === selectedLanguage.value) ?? languages[0]!,
)

const pickLanguage = (code: string) => {
  selectedLanguage.value = code
  isLangOpen.value = false
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
          <li v-for="link in links" :key="link.id">
            <a :href="`#${link.id}`" class="header-nav-link">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <div class="language" @keydown.esc="isLangOpen = false">
          <button
            type="button"
            class="language-button"
            aria-haspopup="listbox"
            :aria-expanded="isLangOpen"
            aria-label="Change language"
            @click="isLangOpen = !isLangOpen"
          >
            <Globe :size="18" aria-hidden="true" />
            <span :lang="currentLanguage.code">{{ currentLanguage.short }}</span>
            <ChevronDown
              class="language-chevron"
              :class="{ 'is-open': isLangOpen }"
              :size="16"
              aria-hidden="true"
            />
          </button>

          <template v-if="isLangOpen">
            <!-- invisible layer: a click anywhere outside closes the list -->
            <div class="language-backdrop" @click="isLangOpen = false"></div>

            <ul class="language-menu" role="listbox" aria-label="Change language">
              <li v-for="lang in languages" :key="lang.code" role="presentation">
                <button
                  type="button"
                  role="option"
                  class="language-option"
                  :class="{ 'is-selected': selectedLanguage === lang.code }"
                  :aria-selected="selectedLanguage === lang.code"
                  :lang="lang.code"
                  @click="pickLanguage(lang.code)"
                >
                  {{ lang.name }}
                  <Check
                    v-if="selectedLanguage === lang.code"
                    class="language-check"
                    :size="18"
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
          @click="$emit('openExhibitor')"
        >
          Be Our Exhibitor
        </button>

        <button
          type="button"
          class="header-menu-button"
          aria-label="Open menu"
          @click="$emit('openNav')"
        >
          <Menu :size="22" aria-hidden="true" />
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
  border-radius: 6px;
  background: none;
  font-size: 15px;
  color: var(--heading);
  text-align: left;
  cursor: pointer;
}

.language-option:hover {
  background: var(--surface-hover);
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
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: var(--radius);
  background: var(--surface-hover);
  color: var(--heading);
  cursor: pointer;
}

.header-menu-button:hover {
  background: var(--border);
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
