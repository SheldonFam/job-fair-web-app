<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { industryLabels, type Exhibitor } from '@/data/exhibitors'
import BaseModal from './BaseModal.vue'

const props = defineProps<{ open: boolean; exhibitor: Exhibitor | null }>()
const emit = defineEmits<{ close: [] }>()

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
        <div class="booth-detail-badges">
          <span class="booth-detail-industry">{{ industryLabels[exhibitor.industry] }}</span>
          <span class="booth-detail-location">
            Booth {{ exhibitor.booth }} · Hall {{ exhibitor.hall }}
          </span>
        </div>
      </div>

      <p>{{ exhibitor.description }}</p>

      <div>
        <h3 class="booth-detail-label">Open positions ({{ exhibitor.openRoleCount }})</h3>
        <ul class="booth-detail-roles">
          <li v-for="role in visibleRoles" v-bind:key="role" class="booth-detail-role">
            {{ role }}
          </li>
          <li v-if="extraRoleCount > 0" class="booth-detail-role">+{{ extraRoleCount }} more</li>
        </ul>
      </div>

      <button type="button" class="btn btn-primary btn-lg" v-on:click="goToSessions">
        Reserve Job Matching
      </button>
    </div>
  </BaseModal>
</template>

<style scoped>
.booth-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.booth-detail-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.booth-detail-industry,
.booth-detail-location {
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 600;
}

.booth-detail-industry {
  background: var(--industry-background);
  color: var(--industry-text);
}

.booth-detail-location {
  background: var(--heading);
  color: var(--white);
}

.booth-detail-label {
  margin-bottom: 8px;
  font-size: 14px;
}

.booth-detail-roles {
  display: flex;
  flex-wrap: wrap;
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
</style>
