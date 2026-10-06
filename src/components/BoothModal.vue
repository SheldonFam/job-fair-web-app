<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { MapPin } from '@lucide/vue'
import type { Exhibitor } from '@/data/exhibitors'
import BaseModal from './BaseModal.vue'

const props = defineProps<{ open: boolean; exhibitor: Exhibitor | null }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()

// only the first three roles are listed; the rest is shown as "+5 more"
const visibleRoles = computed(() => {
  return props.exhibitor ? props.exhibitor.roles.slice(0, 3) : []
})

const extraRoleCount = computed(() => {
  return props.exhibitor ? props.exhibitor.openRoleCount - visibleRoles.value.length : 0
})

const goToSessions = async () => {
  emit('close')

  /* Closing the modal puts the keyboard focus back on the booth, which scrolls the page to it.
     Wait for that to finish, then move down to the sessions section. */
  await nextTick()
  document.getElementById('sessions')?.scrollIntoView()
}
</script>

<template>
  <BaseModal
    v-bind:open="open"
    v-bind:title="exhibitor ? exhibitor.name : ''"
    v-on:close="emit('close')"
  >
    <div v-if="exhibitor" class="booth-detail" v-bind:class="`is-${exhibitor.industry}`">
      <div class="booth-detail-header">
        <span class="booth-detail-logo" aria-hidden="true">{{ exhibitor.initials }}</span>
        <div class="booth-detail-meta">
          <span class="booth-detail-industry">{{ t(`industries.${exhibitor.industry}`) }}</span>
          <span class="booth-detail-location">
            <MapPin v-bind:size="16" aria-hidden="true" />
            {{ t('booth.location', { booth: exhibitor.booth, hall: exhibitor.hall }) }}
          </span>
        </div>
      </div>

      <p>{{ exhibitor.description }}</p>

      <div>
        <h3 class="booth-detail-label">
          {{ t('booth.openPositions', { count: exhibitor.openRoleCount }) }}
        </h3>
        <ul class="booth-detail-roles">
          <li v-for="role in visibleRoles" v-bind:key="role" class="booth-detail-role">
            {{ role }}
          </li>
          <li v-if="extraRoleCount > 0" class="booth-detail-more">
            {{ t('booth.more', { count: extraRoleCount }) }}
          </li>
        </ul>
      </div>

      <button type="button" class="btn btn-primary btn-lg" v-on:click="goToSessions">
        {{ t('booth.reserve') }}
      </button>
    </div>
  </BaseModal>
</template>

<style scoped>
.booth-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.booth-detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.booth-detail-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-card);
  background: var(--industry-background);
  font-size: 24px;
  font-weight: 700;
  color: var(--industry-text);
}

/* industry badge on top, booth location underneath, both next to the logo */
.booth-detail-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.booth-detail-industry {
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--industry-background);
  font-size: 14px;
  font-weight: 600;
  color: var(--industry-text);
}

.booth-detail-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  color: var(--heading);
}

.booth-detail-location svg {
  color: var(--primary);
}

.booth-detail-label {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
}

.booth-detail-roles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.booth-detail-role {
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--surface-muted);
  font-size: 14px;
  font-weight: 500;
  color: var(--heading);
}

/* "+5 more" is plain text, so it does not look like another job role */
.booth-detail-more {
  font-size: 14px;
  color: var(--muted);
}
</style>
