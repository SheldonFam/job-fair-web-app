<script setup lang="ts">
import { CalendarDays, CircleCheck, Clock, MapPin, UserRound } from '@lucide/vue'
import BaseModal from './BaseModal.vue'
import type { Session } from '@/data/sessions'
import { computed, nextTick, reactive, ref, watch } from 'vue'

const props = defineProps<{ open: boolean; session: Session | null }>()
const emit = defineEmits<{ close: [] }>()

const isWaitList = computed(() => props.session?.status === 'full')

const form = reactive({
  reservationName: '',
  reservationEmail: '',
  reservationPhone: '',
})

const errors = reactive({
  reservationName: '',
  reservationEmail: '',
  reservationPhone: '',
})

const submitStatus = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle')

const hasSubmitted = ref(false)

// the email shown in the thank-you view (the form itself is cleared after sending)
const submittedEmail = ref('')

const successCloseButton = ref<HTMLButtonElement | null>(null)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateEmail = (value: string) => {
  if (!value.trim()) return 'Email is required.'
  if (!emailPattern.test(value)) return 'Please enter a valid email address.'
  return ''
}

const validatePhone = (value: string) => {
  if (!value.trim()) return ''

  const digits = value.replace(/[\s-]/g, '').replace(/^(\+?60|0)/, '')
  if (!/^1\d{8,9}$/.test(digits)) return 'Enter a valid Malaysian mobile number.'
  return ''
}

const validateForm = () => {
  errors.reservationName = form.reservationName.trim() ? '' : 'Please enter your full name.'
  errors.reservationEmail = validateEmail(form.reservationEmail)
  errors.reservationPhone = form.reservationPhone.trim()
    ? validatePhone(form.reservationPhone)
    : 'Phone is required.'

  return Object.values(errors).every((message) => message === '')
}

watch(form, () => {
  if (hasSubmitted.value) {
    validateForm()
  }
})

const resetForm = () => {
  form.reservationName = ''
  form.reservationEmail = ''
  form.reservationPhone = ''

  errors.reservationName = ''
  errors.reservationEmail = ''
  errors.reservationPhone = ''

  hasSubmitted.value = false
}

// when the modal closes, clear everything so it opens clean next time
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      resetForm()
      submitStatus.value = 'idle'
      submittedEmail.value = ''
    }
  },
)

const handleSubmit = async () => {
  hasSubmitted.value = true

  const isValid = validateForm()

  if (!isValid) {
    return
  }

  // the modal only opens with a session, this check keeps TypeScript happy
  if (!props.session) {
    return
  }

  try {
    submitStatus.value = 'sending'
    console.log('Submitted From', { ...form })

    const payload = {
      reservationSessionId: props.session.id,
      reservationName: form.reservationName.trim(),
      reservationEmail: form.reservationEmail.trim(),
      reservationPhone: form.reservationPhone.trim(),
      reservationIsWaitlist: isWaitList.value,
    }

    const response = await fetch('/api/reserve.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      submitStatus.value = 'failed'
      return
    }

    submittedEmail.value = payload.reservationEmail
    submitStatus.value = 'sent'
    resetForm()

    // the form is replaced by the thank-you view, so move the keyboard focus to its button
    await nextTick()
    successCloseButton.value?.focus()
  } catch (error) {
    console.error(error)
    submitStatus.value = 'failed'
  }
}
</script>

<template>
  <BaseModal
    v-bind:open="open"
    v-bind:title="isWaitList ? 'Join the waitlist' : 'Reserve your slot'"
    v-on:close="emit('close')"
  >
    <!-- thank-you view, shown after a successful submit -->
    <div v-if="submitStatus === 'sent'" class="form-success" role="status">
      <CircleCheck class="form-success-icon" v-bind:size="56" aria-hidden="true" />
      <h3 class="form-success-title">
        {{ isWaitList ? 'You’re on the waitlist' : 'You’re booked!' }}
      </h3>
      <p v-if="isWaitList">
        No seat is reserved yet. If one opens up, we will email
        <strong>{{ submittedEmail }}</strong>
      </p>
      <p v-else>
        Confirmation sent to <strong>{{ submittedEmail }}</strong>
      </p>
      <button
        ref="successCloseButton"
        type="button"
        class="btn btn-primary"
        v-on:click="emit('close')"
      >
        Close
      </button>
    </div>

    <template v-else>
      <div class="reservation-summary" v-if="session">
        <p class="reservation-summary-type">
          {{ session.type === 'match' ? 'Job matching' : 'Career talk' }}
        </p>
        <h3 class="reservation-summary-title">{{ session.title }}</h3>
        <ul class="reservation-summary-details">
          <li class="reservation-summary-detail">
            <CalendarDays v-bind:size="16" aria-hidden="true" />
            Day {{ session.day }}
          </li>
          <li class="reservation-summary-detail">
            <Clock v-bind:size="16" aria-hidden="true" />
            {{ session.time }}
          </li>
          <li class="reservation-summary-detail">
            <MapPin v-bind:size="16" aria-hidden="true" />
            {{ session.place }}
          </li>
          <li class="reservation-summary-detail">
            <UserRound v-bind:size="16" aria-hidden="true" />
            {{ session.host }}
          </li>
        </ul>
      </div>

      <!-- For Session Full -->
      <p v-if="isWaitList" class="alert reservation-waitlist-note">
        This session is full. We will email you if a seat opens up.
      </p>

      <form class="form-grid" novalidate v-on:submit.prevent="handleSubmit">
        <div class="field form-grid-full">
          <label for="reservation-name" class="field-label">
            Full name <span class="field-required" aria-hidden="true">*</span>
          </label>
          <input
            id="reservation-name"
            v-model="form.reservationName"
            v-bind:aria-invalid="!!errors.reservationName"
            class="input"
            name="reservationName"
            type="text"
            autocomplete="name"
            placeholder="As per IC"
          />
          <p v-if="errors.reservationName" class="field-error" role="alert">
            {{ errors.reservationName }}
          </p>
        </div>

        <div class="field">
          <label for="reservation-email" class="field-label">
            Email <span class="field-required" aria-hidden="true">*</span>
          </label>
          <input
            id="reservation-email"
            v-model="form.reservationEmail"
            v-bind:aria-invalid="!!errors.reservationEmail"
            class="input"
            name="reservationEmail"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
          />
          <p v-if="errors.reservationEmail" class="field-error" role="alert">
            {{ errors.reservationEmail }}
          </p>
        </div>

        <div class="field">
          <label for="reservation-phone" class="field-label">
            Phone <span class="field-required" aria-hidden="true">*</span>
          </label>
          <input
            id="reservation-phone"
            v-model="form.reservationPhone"
            v-bind:aria-invalid="!!errors.reservationPhone"
            class="input"
            name="reservationPhone"
            type="tel"
            autocomplete="tel"
            placeholder="12-345 6789"
          />
          <p v-if="errors.reservationPhone" class="field-error" role="alert">
            {{ errors.reservationPhone }}
          </p>
        </div>

        <p v-if="submitStatus === 'failed'" class="alert alert-error form-grid-full" role="alert">
          Sorry, we could not send your reservation. Please try again.
        </p>

        <button
          type="submit"
          class="btn btn-primary btn-lg form-grid-full"
          v-bind:disabled="submitStatus === 'sending'"
        >
          <template v-if="submitStatus === 'sending'">Sending…</template>
          <template v-else>{{ isWaitList ? 'Join Waitlist' : 'Confirm Reservation' }}</template>
        </button>
      </form>
    </template>
  </BaseModal>
</template>

<style scoped>
/* grey box at the top that shows which session is being reserved */
.reservation-summary {
  margin-bottom: 20px;
  padding: 16px;
  border-radius: var(--radius-card);
  background: var(--surface-muted);
}

.reservation-summary-type {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
}

.reservation-summary-title {
  margin-top: 2px;
  font-size: 18px;
}

/* two details per row; one per row on phones */
.reservation-summary-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 16px;
  margin-top: 12px;
}

.reservation-summary-detail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

/* amber note shown only for a full session */
.reservation-waitlist-note {
  margin-bottom: 20px;
  background: #fef3c7;
  color: #92400e;
}

@media (max-width: 640px) {
  .reservation-summary-details {
    grid-template-columns: 1fr;
  }
}
</style>
