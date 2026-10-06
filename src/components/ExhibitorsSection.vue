<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUp, Search, SearchX } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import { exhibitors, industries, type Exhibitor, type Industry } from '@/data/exhibitors'
import BaseSelect from './BaseSelect.vue'

const { t } = useI18n()

const hallOptions = computed(() => [
  { value: 'all', label: t('exhibitors.allHalls') },
  { value: 'A', label: t('exhibitors.hall', { hall: 'A' }) },
  { value: 'B', label: t('exhibitors.hall', { hall: 'B' }) },
  { value: 'C', label: t('exhibitors.hall', { hall: 'C' }) },
])

const searchText = ref('')
const selectedHall = ref('all')
const selectedIndustry = ref<Industry | 'all'>('all')

const matchesIndustry = (exhibitor: Exhibitor) =>
  selectedIndustry.value === 'all' || exhibitor.industry === selectedIndustry.value

const matchesHall = (exhibitor: Exhibitor) =>
  selectedHall.value === 'all' || exhibitor.hall === selectedHall.value

// the search looks at the company name, the booth number and the job roles
const matchesSearch = (exhibitor: Exhibitor) => {
  console.log('exhibitor', exhibitor)
  const keyword = searchText.value.trim().toLowerCase()
  console.log(keyword)

  return (
    exhibitor.name.toLowerCase().includes(keyword) ||
    exhibitor.booth.toLowerCase().includes(keyword) ||
    exhibitor.roles.some((role) => role.toLowerCase().includes(keyword))
  )
}

const visibleExhibitors = computed(() =>
  exhibitors.filter(
    (exhibitor) => matchesIndustry(exhibitor) && matchesHall(exhibitor) && matchesSearch(exhibitor),
  ),
)

const clearFilters = () => {
  searchText.value = ''
  selectedHall.value = 'all'
  selectedIndustry.value = 'all'
}

// phones show only the first 6 cards until "Show all" is tapped, so the list is not too long
const isShowingAll = ref(false)
</script>

<template>
  <section id="exhibitors" class="section">
    <div class="container">
      <div class="exhibitors-header">
        <div>
          <p class="eyebrow">{{ t('exhibitors.eyebrow') }}</p>
          <h2>{{ t('exhibitors.title') }}</h2>
        </div>
        <p class="exhibitors-count" aria-live="polite">
          {{ t('exhibitors.count', { shown: visibleExhibitors.length, total: exhibitors.length }) }}
        </p>
      </div>

      <div class="card exhibitors-filters">
        <div class="exhibitors-search-row">
          <div class="exhibitors-search">
            <Search class="exhibitors-search-icon" v-bind:size="20" aria-hidden="true" />
            <input
              v-model="searchText"
              type="search"
              class="input exhibitors-search-input"
              v-bind:placeholder="t('exhibitors.searchPlaceholder')"
              v-bind:aria-label="t('exhibitors.searchLabel')"
            />
          </div>

          <BaseSelect
            v-model="selectedHall"
            class="exhibitors-hall"
            v-bind:label="t('exhibitors.hallLabel')"
            v-bind:options="hallOptions"
          />
        </div>

        <div
          class="exhibitors-industries"
          role="group"
          v-bind:aria-label="t('exhibitors.filterLabel')"
        >
          <button
            type="button"
            class="filter-chip"
            v-bind:class="{ 'is-selected': selectedIndustry === 'all' }"
            v-bind:aria-pressed="selectedIndustry === 'all'"
            v-on:click="selectedIndustry = 'all'"
          >
            {{ t('exhibitors.all') }}
          </button>
          <button
            v-for="industry in industries"
            v-bind:key="industry"
            type="button"
            class="filter-chip"
            v-bind:class="[`is-${industry}`, { 'is-selected': selectedIndustry === industry }]"
            v-bind:aria-pressed="selectedIndustry === industry"
            v-on:click="selectedIndustry = industry"
          >
            <span class="exhibitors-industry-dot"></span>
            {{ t(`industries.${industry}`) }}
          </button>
        </div>
      </div>

      <div v-if="visibleExhibitors.length > 0" class="exhibitors-grid">
        <article
          v-for="(exhibitor, index) in visibleExhibitors"
          v-bind:key="exhibitor.id"
          class="card exhibitor-card"
          v-bind:class="[`is-${exhibitor.industry}`, { 'is-extra': index >= 6 && !isShowingAll }]"
        >
          <span class="exhibitor-logo" aria-hidden="true">{{ exhibitor.initials }}</span>

          <div class="exhibitor-details">
            <div class="exhibitor-heading">
              <h3 class="exhibitor-name">{{ exhibitor.name }}</h3>
              <span class="exhibitor-industry">{{ t(`industries.${exhibitor.industry}`) }}</span>
            </div>
            <p class="exhibitor-roles">
              {{ t('exhibitors.openRoles', { count: exhibitor.openRoleCount }) }} ·
              {{ exhibitor.roles.slice(0, 2).join(', ') }}
            </p>
          </div>

          <div class="exhibitor-location">
            <span class="exhibitor-booth">{{ exhibitor.booth }}</span>
            <a
              href="#floorplan"
              class="exhibitor-map-link"
              v-bind:aria-label="t('exhibitors.showOnMapLabel', { name: exhibitor.name })"
            >
              {{ t('exhibitors.showOnMap') }}
              <ArrowUp v-bind:size="14" aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>

      <!-- only shown on phones (see the CSS), and only when some cards are hidden -->
      <button
        v-if="visibleExhibitors.length > 6 && !isShowingAll"
        type="button"
        class="btn btn-outline exhibitors-show-all"
        v-on:click="isShowingAll = true"
      >
        {{ t('exhibitors.showAll', { count: visibleExhibitors.length }) }}
      </button>

      <div v-if="visibleExhibitors.length === 0" class="card exhibitors-empty">
        <SearchX class="exhibitors-empty-icon" v-bind:size="48" aria-hidden="true" />
        <h3 class="exhibitors-empty-title">{{ t('exhibitors.emptyTitle') }}</h3>
        <p class="exhibitors-empty-text">{{ t('exhibitors.emptyText') }}</p>
        <button type="button" class="btn btn-outline btn-sm" v-on:click="clearFilters">
          {{ t('exhibitors.clearFilters') }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* heading on the left, result count on the right */
.exhibitors-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
}

.exhibitors-count {
  font-size: 16px;
  font-weight: 500;
  color: var(--heading);
}

/* filter card: search and hall on the first row, industries on the second */
.exhibitors-filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
}

.exhibitors-search-row {
  display: flex;
  gap: 12px;
}

.exhibitors-search {
  position: relative;
  flex: 1;
}

.exhibitors-search-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
}

/* leave room for the search icon */
.exhibitors-search-input {
  padding-left: 44px;
}

.exhibitors-hall {
  width: 170px;
}

.exhibitors-industries {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.exhibitors-industry-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--industry-color);
}

.exhibitors-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* exhibitor card: logo, details, booth.
   min-width lets the card shrink so the long roles line can show "…" */
.exhibitor-card {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  padding: 16px;
}

.exhibitor-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: var(--radius);
  background: var(--industry-background);
  font-size: 16px;
  font-weight: 800;
  color: var(--industry-text);
}

.exhibitor-details {
  flex: 1;
  min-width: 0;
}

.exhibitor-heading {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 8px;
}

.exhibitor-name {
  font-size: 16px;
}

.exhibitor-industry {
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  background: var(--industry-background);
  font-size: 12px;
  font-weight: 600;
  color: var(--industry-text);
}

.exhibitor-roles {
  margin-top: 4px;
  overflow: hidden;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.exhibitor-location {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.exhibitor-booth {
  font-size: 18px;
  font-weight: 800;
  color: var(--heading);
}

.exhibitor-map-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  white-space: nowrap;
}

/* the text is small, so an invisible area around it makes the link easier to tap */
.exhibitor-map-link::before {
  content: '';
  position: absolute;
  inset: -12px -8px;
}

.exhibitor-map-link:hover {
  text-decoration: underline;
}

/* shown when no exhibitor matches the filters */
.exhibitors-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 16px;
  text-align: center;
}

.exhibitors-empty-icon {
  color: var(--primary);
}

.exhibitors-empty-title {
  font-size: 20px;
}

.exhibitors-empty-text {
  font-size: 14px;
}

/* the "Show all" button: hidden on bigger screens, where every card is always shown */
.exhibitors-show-all {
  display: none;
  width: 100%;
  margin-top: 12px;
}

@media (max-width: 1024px) {
  .exhibitors-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .exhibitors-search-row {
    flex-direction: column;
  }

  .exhibitors-hall {
    width: 100%;
  }

  /* industries scroll sideways on one line */
  .exhibitors-industries {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  /* the roles line wraps onto more lines, so it is not cut off after a few letters */
  .exhibitor-roles {
    white-space: normal;
  }

  .exhibitor-card {
    align-items: flex-start;
  }

  /* cards after the first few stay hidden until "Show all" is tapped */
  .exhibitor-card.is-extra {
    display: none;
  }

  .exhibitors-show-all {
    display: flex;
  }
}
</style>
