<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const targetDate = new Date('2026-12-12T09:00:00+08:00')

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

let intervalId: ReturnType<typeof setInterval>

const units = computed(() => [
  { value: String(days.value).padStart(2, '0'), label: t('countdown.days') },
  { value: String(hours.value).padStart(2, '0'), label: t('countdown.hours') },
  { value: String(minutes.value).padStart(2, '0'), label: t('countdown.minutes') },
  { value: String(seconds.value).padStart(2, '0'), label: t('countdown.seconds') },
])

const updateCountdown = () => {
  const now = new Date()
  const millisecondsLeft = targetDate.getTime() - now.getTime()

  if (millisecondsLeft <= 0) {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    clearInterval(intervalId)
    return
  }

  days.value = Math.floor(millisecondsLeft / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((millisecondsLeft / (1000 * 60 * 60)) % 24)
  minutes.value = Math.floor((millisecondsLeft / (1000 * 60)) % 60)
  seconds.value = Math.floor((millisecondsLeft / 1000) % 60)
}

onMounted(() => {
  updateCountdown()
  intervalId = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div class="card countdown">
    <p class="countdown-title">{{ t('countdown.title') }}</p>

    <div class="countdown-units" role="timer">
      <div v-for="unit in units" v-bind:key="unit.label" class="countdown-unit">
        <span class="countdown-value">{{ unit.value }}</span>
        <span class="countdown-label">{{ unit.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.countdown {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 24px;
}

.countdown-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--heading);
}

.countdown-units {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.countdown-unit {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 16px;
  border-left: 1px solid var(--border);
}

.countdown-unit:first-child {
  padding-left: 0;
  border-left: 0;
}

.countdown-value {
  font-size: 36px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: var(--heading);
}

.countdown-label {
  font-size: 14px;
  color: var(--muted);
}

@media (max-width: 640px) {
  .countdown {
    padding: 16px;
  }

  .countdown-unit {
    padding: 0 8px;
  }

  .countdown-value {
    font-size: 28px;
  }
}
</style>
