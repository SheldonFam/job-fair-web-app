<script setup lang="ts">
import { reactive, ref } from 'vue'
import { MapPin, Phone, Mail, Clock } from '@lucide/vue'
import BaseSelect from './BaseSelect.vue'

type ContactField = 'name' | 'email' | 'phone' | 'subject' | 'message'

const subjectOptions = [
  { value: 'General', label: 'General' },
  { value: 'Exhibiting', label: 'Exhibiting' },
  { value: 'Sessions', label: 'Sessions' },
  { value: 'Media', label: 'Media' },
]

const form = reactive({ name: '', email: '', phone: '', subject: '', message: '' })
const errors = reactive<Partial<Record<ContactField, string>>>({})
const submitStatus = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle')

const rules: Record<ContactField, (value: string) => string> = {
  name: (value) => (value.trim() ? '' : 'Please enter your full name.'),
  email: (value) =>
    !value.trim()
      ? 'Email is required.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? 'Please enter a valid email address.'
        : '',
  phone: (value) => {
    if (!value.trim()) return '' // optional
    const digits = value.replace(/[\s-]/g, '').replace(/^0/, '')
    return /^1\d{8,9}$/.test(digits) ? '' : 'Enter a valid Malaysian mobile number.'
  },
  subject: (value) => (value ? '' : 'Please choose a subject.'),
  message: (value) => (value.trim().length >= 10 ? '' : 'Message must be at least 10 characters.'),
}

const validateField = (field: ContactField) => {
  errors[field] = rules[field](form[field])
}

const submitForm = () => {
  console.log(form)
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
        <form class="card contact-form" novalidate v-on:submit.prevent="submitForm">
          <p v-if="submitStatus === 'failed'" class="alert alert-error contact-form-full" role="alert">
            We couldn’t send your message. Please try again.
          </p>
          <p v-if="submitStatus === 'sent'" class="alert alert-success contact-form-full" role="status">
            Message sent. We’ll reply within 2 working days.
          </p>

          <div class="field">
            <label for="contact-name" class="field-label">
              Full name <span class="field-required" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-name"
              v-model="form.name"
              class="input"
              name="name"
              type="text"
              autocomplete="name"
              v-bind:aria-invalid="!!errors.name"
              v-on:blur="validateField('name')"
            />
            <p v-if="errors.name" class="field-error" role="alert">{{ errors.name }}</p>
          </div>

          <div class="field">
            <label for="contact-email" class="field-label">
              Email <span class="field-required" aria-hidden="true">*</span>
            </label>
            <input
              id="contact-email"
              v-model="form.email"
              class="input"
              name="email"
              type="email"
              autocomplete="email"
              v-bind:aria-invalid="!!errors.email"
              v-on:blur="validateField('email')"
            />
            <p v-if="errors.email" class="field-error" role="alert">{{ errors.email }}</p>
          </div>

          <div class="field">
            <label for="contact-phone" class="field-label">
              Phone <span class="field-optional">(optional)</span>
            </label>
            <input
              id="contact-phone"
              v-model="form.phone"
              class="input"
              name="phone"
              type="tel"
              autocomplete="tel"
              placeholder="12-345 6789"
              v-bind:aria-invalid="!!errors.phone"
              v-on:blur="validateField('phone')"
            />
            <p v-if="errors.phone" class="field-error" role="alert">{{ errors.phone }}</p>
          </div>

          <div class="field">
            <label for="contact-subject" class="field-label">
              Subject <span class="field-required" aria-hidden="true">*</span>
            </label>
            <BaseSelect
              id="contact-subject"
              v-model="form.subject"
              placeholder="Select a subject"
              v-bind:options="subjectOptions"
              v-bind:invalid="!!errors.subject"
              v-on:close="validateField('subject')"
            />
            <p v-if="errors.subject" class="field-error" role="alert">{{ errors.subject }}</p>
          </div>

          <div class="field contact-form-full">
            <label for="contact-message" class="field-label">
              Message <span class="field-required" aria-hidden="true">*</span>
            </label>
            <textarea
              id="contact-message"
              v-model="form.message"
              class="input"
              name="message"
              rows="5"
              v-bind:aria-invalid="!!errors.message"
              v-on:blur="validateField('message')"
            ></textarea>
            <p v-if="errors.message" class="field-error" role="alert">{{ errors.message }}</p>
          </div>

          <button
            type="submit"
            class="btn btn-primary contact-submit"
            v-bind:disabled="submitStatus === 'sending'"
          >
            {{ submitStatus === 'sending' ? 'Sending…' : 'Send Message' }}
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-content: start;
  padding: 24px;
}

.contact-form-full {
  grid-column: 1 / -1;
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
    grid-template-columns: 1fr;
    padding: 16px;
  }
  .contact-submit {
    justify-self: stretch;
  }
}
</style>
