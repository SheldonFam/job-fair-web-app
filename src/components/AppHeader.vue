<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe, Menu } from '@lucide/vue'
import { navLinks } from '@/data/navigation'
import { languages, setLanguage } from '@/i18n'
import BaseSelect from './BaseSelect.vue'

defineEmits<{ openExhibitor: []; openNav: [] }>()

const { t, locale } = useI18n()

const currentLanguage = computed(
  () => languages.find((language) => language.value === locale.value) ?? languages[0]!,
)
</script>

<template>
  <header class="header">
    <div class="container header-inner">
      <a href="#top" class="header-brand">
        <span class="header-brand-name">CareerConnect</span>
        <span class="header-brand-tagline">{{ t('header.tagline') }}</span>
      </a>

      <nav class="header-nav" v-bind:aria-label="t('nav.main')">
        <ul class="header-nav-list">
          <li v-for="sectionId in navLinks" v-bind:key="sectionId">
            <a v-bind:href="`#${sectionId}`" class="header-nav-link">{{ t(`nav.${sectionId}`) }}</a>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <BaseSelect
          v-bind:model-value="locale"
          v-on:update:model-value="setLanguage"
          compact
          v-bind:label="t('header.changeLanguage')"
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
          {{ t('header.beExhibitor') }}
        </button>

        <button
          type="button"
          class="icon-button header-menu-button"
          v-bind:aria-label="t('nav.openMenu')"
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
