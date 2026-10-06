<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { MapPin, Phone, Mail, Clock } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import BaseSelect from './BaseSelect.vue'

const { t } = useI18n()

const subjectOptions = computed(() => [
  { value: 'General', label: t('contact.subjects.general') },
  { value: 'Exhibiting', label: t('contact.subjects.exhibiting') },
  { value: 'Sessions', label: t('contact.subjects.sessions') },
  { value: 'Media', label: t('contact.subjects.media') },
])

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
  if (!value.trim()) return 'errors.email'
  if (!emailPattern.test(value)) return 'errors.emailInvalid'
  return ''
}

const validatePhone = (value: string) => {
  if (!value.trim()) return ''

  const digits = value.replace(/[\s-]/g, '').replace(/^(\+?60|0)/, '')
  if (!/^1\d{8,9}$/.test(digits)) return 'errors.phoneInvalid'
  return ''
}

const validateForm = () => {
  errors.contactName = form.contactName.trim() ? '' : 'errors.fullName'
  errors.contactEmail = validateEmail(form.contactEmail)
  errors.contactPhone = validatePhone(form.contactPhone)
  errors.contactSubject = form.contactSubject ? '' : 'errors.subject'
  errors.contactMessage = form.contactMessage.trim().length >= 10 ? '' : 'errors.message'

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

    const payload = {
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      contactSubject: form.contactSubject.trim(),
      contactMessage: form.contactMessage.trim(),
    }

    //await api call?
    const response = await fetch('/api/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      submitStatus.value = 'failed'
      return
    }

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
      <p class="eyebrow">{{ t('contact.eyebrow') }}</p>
      <h2>{{ t('contact.title') }}</h2>

      <div class="contact-grid">
        <!-- Left: venue card -->
        <div class="card contact-venue reveal">
          <iframe
            class="contact-map"
            v-bind:title="t('contact.mapTitle')"
            src="https://www.google.com/maps?q=Kuala+Lumpur+Convention+Centre&output=embed"
            loading="lazy"
          ></iframe>
          <ul class="contact-details">
            <li class="contact-detail contact-detail-address">
              <MapPin class="contact-detail-icon" v-bind:size="18" aria-hidden="true" />
              {{ t('contact.address') }}
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
              {{ t('contact.dates') }}
            </li>
          </ul>
        </div>

        <!-- Right: form card -->
        <form
          class="card form-grid contact-form reveal"
          novalidate
          v-on:submit.prevent="handleSubmit"
        >
          <p v-if="submitStatus === 'failed'" class="alert alert-error form-grid-full" role="alert">
            {{ t('contact.failed') }}
          </p>
          <p
            v-if="submitStatus === 'sent'"
            class="alert alert-success form-grid-full"
            role="status"
          >
            {{ t('contact.sent') }}
          </p>

          <div class="field">
            <label for="contact-name" class="field-label">
              {{ t('form.fullName') }} <span class="field-required" aria-hidden="true">*</span>
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
              {{ t(errors.contactName) }}
            </p>
          </div>

          <div class="field">
            <label for="contact-email" class="field-label">
              {{ t('form.email') }} <span class="field-required" aria-hidden="true">*</span>
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
              {{ t(errors.contactEmail) }}
            </p>
          </div>

          <div class="field">
            <label for="contact-phone" class="field-label">
              {{ t('form.phone') }} <span class="field-optional">{{ t('common.optional') }}</span>
            </label>
            <input
              id="contact-phone"
              v-model="form.contactPhone"
              class="input"
              name="contactPhone"
              type="tel"
              autocomplete="tel"
              placeholder="012-345 6789"
              v-bind:aria-invalid="!!errors.contactPhone"
            />
            <p v-if="errors.contactPhone" class="field-error" role="alert">
              {{ t(errors.contactPhone) }}
            </p>
          </div>

          <div class="field">
            <label for="contact-subject" class="field-label">
              {{ t('form.subject') }} <span class="field-required" aria-hidden="true">*</span>
            </label>
            <BaseSelect
              id="contact-subject"
              v-model="form.contactSubject"
              v-bind:placeholder="t('contact.subjectPlaceholder')"
              v-bind:options="subjectOptions"
              v-bind:invalid="!!errors.contactSubject"
            />
            <p v-if="errors.contactSubject" class="field-error" role="alert">
              {{ t(errors.contactSubject) }}
            </p>
          </div>

          <div class="field form-grid-full">
            <label for="contact-message" class="field-label">
              {{ t('form.message') }} <span class="field-required" aria-hidden="true">*</span>
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
              {{ t(errors.contactMessage) }}
            </p>
          </div>

          <button
            type="submit"
            class="btn btn-primary contact-submit"
            v-bind:disabled="submitStatus === 'sending'"
          >
            {{ submitStatus === 'sending' ? t('common.sending') : t('contact.send') }}
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

/* the map fills the space above the details; the grey shows while it loads */
.contact-map {
  flex: 1;
  width: 100%;
  min-height: 200px;
  border: 0;
  background: var(--border);
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  font-size: 16px;
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
