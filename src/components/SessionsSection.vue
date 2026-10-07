<script setup lang="ts">
import { computed, ref } from 'vue'
import { Clock, MapPin } from '@lucide/vue'
import { sessionDays, sessions, type Session, type SessionType } from '@/data/sessions'
import { useI18n } from 'vue-i18n'
import { formatTime } from '@/utils/format'
import ReservationModal from './ReservationModal.vue'

const { t, locale } = useI18n()

const sessionTypes: SessionType[] = ['match', 'talk']

const statusClasses = {
  available: 'is-available',
  almostFull: 'is-almost-full',
  full: 'is-full',
}

const selectedType = ref<SessionType>('match')
const selectedDay = ref(1)

const isReservationOpen = ref(false)

const sessionList = ref(sessions)

const sessionsOfSelectedType = computed(() => {
  return sessionList.value.filter((session) => session.type === selectedType.value)
})

const visibleSessions = computed(() => {
  return sessionsOfSelectedType.value.filter((session) => session.day === selectedDay.value)
})

const selectedSession = ref<Session | null>(null)

const openReservation = (session: Session) => {
  selectedSession.value = session
  isReservationOpen.value = true
}
// To show on UI reduce the slots
const reduceSeat = (sessionId: string) => {
  const session = sessionList.value.find((item) => item.id === sessionId)
  if (!session || session.seatsLeft === 0) return

  session.seatsLeft -= 1
  if (session.seatsLeft === 0) {
    session.status = 'full'
  } else if (session.seatsLeft <= 5) {
    session.status = 'almostFull'
  } else {
    session.status = 'available'
  }
}
</script>

<template>
  <section id="sessions" class="section section-alt">
    <div class="container">
      <div class="sessions-header reveal">
        <div>
          <p class="eyebrow">{{ t('sessions.eyebrow') }}</p>
          <h2>{{ t('sessions.title') }}</h2>
        </div>

        <div class="sessions-types" role="group" v-bind:aria-label="t('sessions.typeLabel')">
          <button
            v-for="type in sessionTypes"
            v-bind:key="type"
            type="button"
            class="sessions-type"
            v-bind:class="{ 'is-selected': selectedType === type }"
            v-bind:aria-pressed="selectedType === type"
            v-on:click="selectedType = type"
          >
            {{ t(`sessions.types.${type}`) }}
          </button>
        </div>
      </div>

      <div class="sessions-days" role="group" v-bind:aria-label="t('sessions.dayLabel')">
        <button
          v-for="day in sessionDays"
          v-bind:key="day"
          type="button"
          class="filter-chip"
          v-bind:class="{ 'is-selected': selectedDay === day }"
          v-bind:aria-pressed="selectedDay === day"
          v-on:click="selectedDay = day"
        >
          {{ t(`sessions.days.${day}`) }}
        </button>
      </div>

      <div class="sessions-grid">
        <article
          v-for="session in visibleSessions"
          v-bind:key="session.id"
          class="card session-card reveal"
          v-bind:class="statusClasses[session.status]"
        >
          <div class="session-header">
            <span class="session-badge session-time">
              <Clock v-bind:size="14" aria-hidden="true" />
              {{ formatTime(session.time, locale) }}
            </span>
            <span class="session-badge session-status">{{
              t(`sessions.status.${session.status}`)
            }}</span>
          </div>

          <h3 class="session-title">{{ session.title }}</h3>

          <div class="session-host">
            <span
              class="session-avatar"
              v-bind:style="{ background: session.avatarColor }"
              aria-hidden="true"
            >
              {{ session.hostInitials }}
            </span>
            <div>
              <p class="session-host-name">{{ session.host }}</p>
              <p class="session-host-role">{{ session.hostRole }}</p>
            </div>
          </div>

          <p class="session-place">
            <MapPin v-bind:size="16" aria-hidden="true" />
            {{ t(`sessions.places.${session.place}`) }}
          </p>

          <div class="session-seats">
            <div class="session-bar">
              <div
                class="session-bar-fill"
                v-bind:style="{ width: `${100 - (session.seatsLeft / session.totalSeats) * 100}%` }"
              ></div>
            </div>
            <p class="session-seats-text">
              {{ t('sessions.seatsLeft', { left: session.seatsLeft, total: session.totalSeats }) }}
            </p>
          </div>

          <button
            v-if="session.status === 'full'"
            type="button"
            class="btn btn-outline"
            v-on:click="openReservation(session)"
          >
            {{ t('sessions.joinWaitlist') }}
          </button>
          <button
            v-else-if="session.status === 'almostFull'"
            type="button"
            class="btn btn-amber"
            v-on:click="openReservation(session)"
          >
            {{ t('sessions.reserveLeft', { count: session.seatsLeft }) }}
          </button>
          <button
            v-else
            type="button"
            class="btn btn-primary"
            v-on:click="openReservation(session)"
          >
            {{ t('sessions.reserve') }}
          </button>
        </article>
      </div>
    </div>

    <ReservationModal
      v-bind:open="isReservationOpen"
      v-on:close="isReservationOpen = false"
      v-bind:session="selectedSession"
      v-on:reserved="reduceSeat"
    />
  </section>
</template>

<style scoped>
/* heading on the left, type switch on the right */
.sessions-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
}

/* Job Matching / Career Talks switch */
.sessions-types {
  display: flex;
  padding: 4px;
  border-radius: var(--radius-card);
  background: var(--border);
}

.sessions-type {
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: var(--radius);
  background: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.sessions-type:hover {
  color: var(--heading);
}

.sessions-type.is-selected {
  background: var(--surface);
  color: var(--heading);
  box-shadow: var(--shadow-card);
}

/* day buttons */
.sessions-days {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.sessions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* session card */
.session-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}

/* the card lifts a little under the mouse; only on devices with a mouse, so it never sticks after a tap */
@media (hover: hover) {
  .session-card:hover {
    box-shadow: var(--shadow-menu);
    transform: translateY(-3px);
  }
}

/* Each status sets three colours. The badge, seat bar and seat text reuse them. */
.session-card.is-available {
  --status-color: var(--primary-dark);
  --status-background: #dbeafe;
  --status-bar: var(--primary);
}

.session-card.is-almost-full {
  --status-color: #92400e;
  --status-background: #fef3c7;
  --status-bar: var(--accent);
}

.session-card.is-full {
  --status-color: var(--body);
  --status-background: var(--surface-muted);
  --status-bar: var(--border-strong);
}

.session-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.session-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 600;
}

.session-time {
  background: var(--primary-light);
  color: var(--primary-dark);
}

.session-status {
  background: var(--status-background);
  color: var(--status-color);
}

.session-title {
  font-size: 20px;
}

.session-host {
  display: flex;
  align-items: center;
  gap: 12px;
}

.session-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 700;
  color: var(--white);
}

.session-host-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--heading);
}

.session-host-role {
  font-size: 14px;
}

.session-place {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

/* seats bar: pushed to the bottom so buttons line up across cards */
.session-seats {
  margin-top: auto;
}

.session-bar {
  height: 6px;
  border-radius: var(--radius-pill);
  background: var(--border);
  overflow: hidden;
}

.session-bar-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  background: var(--status-bar);
}

.session-seats-text {
  margin-top: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--status-color);
}

@media (max-width: 1024px) {
  .sessions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .sessions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
