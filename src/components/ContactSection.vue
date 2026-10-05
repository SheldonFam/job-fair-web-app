<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { MapPin, Phone, Mail, Clock } from '@lucide/vue'
import BaseSelect from './BaseSelect.vue'

const subjectOptions = [
  { value: 'General', label: 'General' },
  { value: 'Exhibiting', label: 'Exhibiting' },
  { value: 'Sessions', label: 'Sessions' },
  { value: 'Media', label: 'Media' },
]

const form = reactive({
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactSubject: '',
  contactMessage: '',
})

const errors = reactive({
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactSubject: '',
  contactMessage: '',
})

const submitStatus = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle')

const hasSubmitted = ref(false)

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
  errors.contactName = form.contactName.trim() ? '' : 'Please enter your full name.'
  errors.contactEmail = validateEmail(form.contactEmail)
  errors.contactPhone = validatePhone(form.contactPhone)
  errors.contactSubject = form.contactSubject ? '' : 'Please choose a subject.'
  errors.contactMessage =
    form.contactMessage.trim().length >= 10 ? '' : 'Message must be at least 10 characters.'

  return Object.values(errors).every((message) => message === '')
}

watch(form, () => {
  if (hasSubmitted.value) {
    validateForm()
  }
})

const resetForm = () => {
  form.contactName = ''
  form.contactEmail = ''
  form.contactPhone = ''
  form.contactSubject = ''
  form.contactMessage = ''

  errors.contactName = ''
  errors.contactEmail = ''
  errors.contactPhone = ''
  errors.contactSubject = ''
  errors.contactMessage = ''

  hasSubmitted.value = false
}

const handleSubmit = async () => {
  hasSubmitted.value = true

  const isValid = validateForm()

  if (!isValid) {
    return
  }

  try {
    submitStatus.value = 'sending'
    console.log('Submitted From', { ...form })

    //await api call?
    await new Promise((resolve) => setTimeout(resolve, 2000))
    submitStatus.value = 'sent'
    resetForm()

    //hide success banner
    setTimeout(() => {
      submitStatus.value = 'idle'
    }, 3000)
  } catch (error) {
    console.error(error)
    submitStatus.value = 'failed'
  }
}
</script>

<template>
  <section id="contact" class="section section-alt">
    <div class="container">
      <p class="eyebrow">Contact us</p>
      <h2>We’re here to help</h2>

      <div class="contact-grid">
        <!-- Left: venue card -->
        <div class="card contact-venue">
          <div
            class="contact-map"
            role="img"
            aria-label="Map showing the venue in Kuala Lumpur"
          ></div>
          <ul class="contact-details">
            <li class="contact-detail contact-detail-address">
              <MapPin class="contact-detail-icon" v-bind:size="18" aria-hidden="true" />
              Halls A–C, Kuala Lumpur
            </li>
            <li class="contact-detail">
              <Phone class="contact-detail-icon" v-bind:size="18" aria-hidden="true" />
              <a href="tel:+60327158800" class="contact-link">+60 3-2715 8800</a>
            </li>
            <li class="contact-detail">
              <Mail class="contact-detail-icon" v-bind:size="18" aria-hidden="true" />
              <a href="mailto:hello@careerconnect.example.my" class="contact-link">
                hello@careerconnect.example.my
              </a>
            </li>
            <li class="contact-detail">
              <Clock class="contact-detail-icon" v-bind:size="18" aria-hidden="true" />
              12–14 Dec 2026 · 9:00 AM – 6:00 PM
            </li>
          </ul>
        </div>

        <!-- Right: form card -->
        <form class="card form-grid contact-form" novalidate v-on:submit.prevent="handleSubmit">
          <p v-if="submitStatus === 'failed'" class="alert alert-error form-grid-full" role="alert">
            We couldn’t send your message. Please try again.
          </p>
          <p
            v-if="submitStatus === 'sent'"
            class="alert alert-success form-grid-full"
            role="status"
          >
            Message sent. We’ll reply within 2 working days.
          </p>

          <div class="field">
            <label for="contact-name" class="field-label">
              Full name <span class="field-required" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-name"
              v-model="form.contactName"
              class="input"
              name="contactName"
              type="text"
              autocomplete="name"
              v-bind:aria-invalid="!!errors.contactName"
            />
            <p v-if="errors.contactName" class="field-error" role="alert">
              {{ errors.contactName }}
            </p>
          </div>

          <div class="field">
            <label for="contact-email" class="field-label">
              Email <span class="field-required" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-email"
              v-model="form.contactEmail"
              class="input"
              name="contactEmail"
              type="email"
              autocomplete="email"
              v-bind:aria-invalid="!!errors.contactEmail"
            />
            <p v-if="errors.contactEmail" class="field-error" role="alert">
              {{ errors.contactEmail }}
            </p>
          </div>

          <div class="field">
            <label for="contact-phone" class="field-label">
              Phone <span class="field-optional">(optional)</span>
            </label>
            <input
              id="contact-phone"
              v-model="form.contactPhone"
              class="input"
              name="contactPhone"
              type="tel"
              autocomplete="tel"
              placeholder="12-345 6789"
              v-bind:aria-invalid="!!errors.contactPhone"
            />
            <p v-if="errors.contactPhone" class="field-error" role="alert">
              {{ errors.contactPhone }}
            </p>
          </div>

          <div class="field">
            <label for="contact-subject" class="field-label">
              Subject <span class="field-required" aria-hidden="true">*</span>
            </label>
            <BaseSelect
              id="contact-subject"
              v-model="form.contactSubject"
              placeholder="Select a subject"
              v-bind:options="subjectOptions"
              v-bind:invalid="!!errors.contactSubject"
            />
            <p v-if="errors.contactSubject" class="field-error" role="alert">
              {{ errors.contactSubject }}
            </p>
          </div>

          <div class="field form-grid-full">
            <label for="contact-message" class="field-label">
              Message <span class="field-required" aria-hidden="true">*</span>
            </label>
            <textarea
              id="contact-message"
              v-model="form.contactMessage"
              class="input"
              name="contactMessage"
              rows="5"
              v-bind:aria-invalid="!!errors.contactMessage"
            ></textarea>
            <p v-if="errors.contactMessage" class="field-error" role="alert">
              {{ errors.contactMessage }}
            </p>
          </div>

          <button
            type="submit"
            class="btn btn-primary contact-submit"
            v-bind:disabled="submitStatus === 'sending'"
          >
            {{ submitStatus === 'sending' ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
  margin-top: 32px;
}

/* venue card */
.contact-venue {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* grey grid until a real map is added */
.contact-map {
  flex: 1;
  min-height: 200px;
  background: var(--border);
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  font-size: 15px;
}

.contact-detail {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.contact-detail-address {
  font-weight: 600;
  color: var(--heading);
}

.contact-detail-icon {
  flex-shrink: 0;
  margin-top: 3px;
  color: var(--primary);
}

.contact-link {
  color: inherit;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.contact-link:hover {
  color: var(--primary);
  text-decoration: underline;
}

/* form card: two columns of fields */
.contact-form {
  align-content: start;
  padding: 24px;
}

.contact-submit {
  justify-self: start;
}

@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .contact-form {
    padding: 16px;
  }
  .contact-submit {
    justify-self: stretch;
  }
}
</style>
