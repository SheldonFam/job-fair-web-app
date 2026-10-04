<script setup lang="ts">
import { reactive, ref } from 'vue'
import { MapPin, Phone, Mail, Clock } from '@lucide/vue'

type Field = 'name' | 'email' | 'phone' | 'subject' | 'message'

const form = reactive({ name: '', email: '', phone: '', subject: '', message: '' })
const errors = reactive<Partial<Record<Field, string>>>({})
const status = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle')

const rules: Record<Field, (v: string) => string> = {
  name: (v) => (v.trim() ? '' : 'Please enter your full name.'),
  email: (v) =>
    !v.trim()
      ? 'Email is required.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? 'Please enter a valid email address.'
        : '',
  phone: (v) => {
    if (!v.trim()) return '' // optional
    const digits = v.replace(/[\s-]/g, '').replace(/^0/, '')
    return /^1\d{8,9}$/.test(digits) ? '' : 'Enter a valid Malaysian mobile number.'
  },
  subject: (v) => (v ? '' : 'Please choose a subject.'),
  message: (v) => (v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.'),
}

const validate = (field: Field) => {
  errors[field] = rules[field](form[field])
}

async function handleSubmit() {
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
              <MapPin class="contact-detail-icon" :size="18" aria-hidden="true" />
              Halls A–C, Kuala Lumpur
            </li>
            <li class="contact-detail">
              <Phone class="contact-detail-icon" :size="18" aria-hidden="true" />
              <a href="tel:+60327158800" class="contact-link">+60 3-2715 8800</a>
            </li>
            <li class="contact-detail">
              <Mail class="contact-detail-icon" :size="18" aria-hidden="true" />
              <a href="mailto:hello@careerconnect.example.my" class="contact-link">
                hello@careerconnect.example.my
              </a>
            </li>
            <li class="contact-detail">
              <Clock class="contact-detail-icon" :size="18" aria-hidden="true" />
              12–14 Dec 2026 · 9:00 AM – 6:00 PM
            </li>
          </ul>
        </div>

        <!-- Right: form card -->
        <form class="card contact-form" novalidate @submit.prevent="handleSubmit">
          <p v-if="status === 'failed'" class="alert alert-error contact-form-full" role="alert">
            We couldn’t send your message. Please try again.
          </p>
          <p v-if="status === 'sent'" class="alert alert-success contact-form-full" role="status">
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
              :aria-invalid="!!errors.name"
              @blur="validate('name')"
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
              :aria-invalid="!!errors.email"
              @blur="validate('email')"
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
              :aria-invalid="!!errors.phone"
              @blur="validate('phone')"
            />
            <p v-if="errors.phone" class="field-error" role="alert">{{ errors.phone }}</p>
          </div>

          <div class="field">
            <label for="contact-subject" class="field-label">
              Subject <span class="field-required" aria-hidden="true">*</span>
            </label>
            <select
              id="contact-subject"
              v-model="form.subject"
              class="input"
              name="subject"
              :aria-invalid="!!errors.subject"
              @blur="validate('subject')"
            >
              <option value="" disabled>Select a subject</option>
              <option>General</option>
              <option>Exhibiting</option>
              <option>Sessions</option>
              <option>Media</option>
            </select>
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
              :aria-invalid="!!errors.message"
              @blur="validate('message')"
            ></textarea>
            <p v-if="errors.message" class="field-error" role="alert">{{ errors.message }}</p>
          </div>

          <button
            type="submit"
            class="btn btn-primary contact-submit"
            :disabled="status === 'sending'"
          >
            {{ status === 'sending' ? 'Sending…' : 'Send Message' }}
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
  background: #e2e8f0;
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
