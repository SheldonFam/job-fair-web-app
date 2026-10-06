<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import { CircleCheck } from '@lucide/vue'
import BaseModal from './BaseModal.vue'
import BaseSelect from './BaseSelect.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const industryOptions = [
  { value: 'tech', label: 'Tech' },
  { value: 'finance', label: 'Finance' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'startups', label: 'Startups' },
]

const boothPackageOptions = [
  { value: 'standard', label: 'Standard 3x3m · RM2,500' },
  { value: 'premium', label: 'Premium 6x3m · RM4,500' },
  { value: 'platinum', label: 'Platinum island · RM8,000' },
]

const form = reactive({
  exhibitorCompanyName: '',
  exhibitorContactPerson: '',
  exhibitorEmail: '',
  exhibitorPhone: '',
  exhibitorIndustry: '',
  exhibitorBoothPackage: '',
  exhibitorTerms: false,
})

const errors = reactive({
  exhibitorCompanyName: '',
  exhibitorContactPerson: '',
  exhibitorEmail: '',
  exhibitorPhone: '',
  exhibitorIndustry: '',
  exhibitorBoothPackage: '',
  exhibitorTerms: '',
})

const submitStatus = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle')

const hasSubmitted = ref(false)

const successCloseButton = ref<HTMLButtonElement | null>(null)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateEmail = (value: string) => {
  if (!value.trim()) return 'Email is required.'
  if (!emailPattern.test(value)) return 'Please enter a valid email address'
  return ''
}

const validatePhone = (value: string) => {
  if (!value.trim()) return 'Phone is required.'
  const digits = value.replace(/[\s-]/g, '').replace(/^(\+?60|0)/, '')
  if (!/^1\d{8,9}$/.test(digits)) return 'Enter a valid Malaysian mobile number.'
  return ''
}

const validateForm = () => {
  errors.exhibitorCompanyName = form.exhibitorCompanyName.trim() ? '' : 'Please enter company name.'
  errors.exhibitorEmail = validateEmail(form.exhibitorEmail)
  errors.exhibitorPhone = validatePhone(form.exhibitorPhone)
  errors.exhibitorContactPerson = form.exhibitorContactPerson
    ? ''
    : 'Please enter a contact person.'
  errors.exhibitorIndustry = form.exhibitorIndustry ? '' : 'Please select an industry.'
  errors.exhibitorBoothPackage = form.exhibitorBoothPackage ? '' : 'Please select a booth package.'
  errors.exhibitorTerms = form.exhibitorTerms ? '' : 'Please accept the exhibitor terms.'

  return Object.values(errors).every((message) => message === '')
}

watch(form, () => {
  if (hasSubmitted.value) {
    validateForm()
  }
})

const resetForm = () => {
  form.exhibitorCompanyName = ''
  form.exhibitorContactPerson = ''
  form.exhibitorPhone = ''
  form.exhibitorEmail = ''
  form.exhibitorBoothPackage = ''
  form.exhibitorIndustry = ''
  form.exhibitorTerms = false

  errors.exhibitorCompanyName = ''
  errors.exhibitorEmail = ''
  errors.exhibitorPhone = ''
  errors.exhibitorContactPerson = ''
  errors.exhibitorBoothPackage = ''
  errors.exhibitorIndustry = ''
  errors.exhibitorTerms = ''

  hasSubmitted.value = false
}

// when the modal closes, clear everything so it opens clean next time
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      resetForm()
      submitStatus.value = 'idle'
    }
  },
)

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
      exhibitorCompanyName: form.exhibitorCompanyName.trim(),
      exhibitorContactPerson: form.exhibitorContactPerson.trim(),
      exhibitorEmail: form.exhibitorEmail.trim(),
      exhibitorPhone: form.exhibitorPhone.trim(),
      exhibitorIndustry: form.exhibitorIndustry,
      exhibitorBoothPackage: form.exhibitorBoothPackage,
      exhibitorTerms: form.exhibitorTerms,
    }

    const response = await fetch('/api/exhibitor.php', {
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
  <BaseModal v-bind:open="open" title="Be Our Exhibitor" v-on:close="emit('close')">
    <!-- Success modal -->
    <div v-if="submitStatus === 'sent'" class="form-success" role="status">
      <CircleCheck class="form-success-icon" v-bind:size="56" aria-hidden="true" />
      <h3 class="form-success-title">Application received</h3>
      <p>Thank you. Our team will contact you within 3 working days.</p>
      <button
        ref="successCloseButton"
        type="button"
        class="btn btn-primary"
        v-on:click="emit('close')"
      >
        Close
      </button>
    </div>

    <form v-else class="form-grid" novalidate v-on:submit.prevent="handleSubmit">
      <p v-if="submitStatus === 'failed'" class="alert alert-error form-grid-full">
        Sorry, we could not send your application. Please try again.
      </p>

      <p class="exhibitor-form-intro form-grid-full">
        Tell us about your company and we’ll get back to you within 3 working days.
      </p>

      <div class="field form-grid-full">
        <label for="exhibitor-company-name" class="field-label">
          Company name <span class="field-required" aria-hidden="true">*</span>
        </label>
        <input
          id="exhibitor-company-name"
          v-model="form.exhibitorCompanyName"
          v-bind:aria-invalid="!!errors.exhibitorCompanyName"
          class="input"
          name="exhibitorCompanyName"
          type="text"
          autocomplete="organization"
        />
        <p v-if="errors.exhibitorCompanyName" class="field-error" role="alert">
          {{ errors.exhibitorCompanyName }}
        </p>
      </div>

      <div class="field form-grid-full">
        <label for="exhibitor-contact-person" class="field-label">
          Contact person <span class="field-required" aria-hidden="true">*</span>
        </label>
        <input
          id="exhibitor-contact-person"
          v-model="form.exhibitorContactPerson"
          v-bind:aria-invalid="!!errors.exhibitorContactPerson"
          class="input"
          name="exhibitorContactPerson"
          type="text"
          autocomplete="name"
        />
        <p v-if="errors.exhibitorContactPerson" class="field-error" role="alert">
          {{ errors.exhibitorContactPerson }}
        </p>
      </div>

      <div class="field">
        <label for="exhibitor-email" class="field-label">
          Work email <span class="field-required" aria-hidden="true">*</span>
        </label>
        <input
          id="exhibitor-email"
          v-model="form.exhibitorEmail"
          v-bind:aria-invalid="!!errors.exhibitorEmail"
          class="input"
          name="exhibitorEmail"
          type="email"
          autocomplete="email"
        />
        <p v-if="errors.exhibitorEmail" class="field-error" role="alert">
          {{ errors.exhibitorEmail }}
        </p>
      </div>

      <div class="field">
        <label for="exhibitor-phone" class="field-label">
          Phone <span class="field-required" aria-hidden="true">*</span>
        </label>
        <input
          id="exhibitor-phone"
          v-model="form.exhibitorPhone"
          v-bind:aria-invalid="!!errors.exhibitorPhone"
          class="input"
          name="exhibitorPhone"
          type="tel"
          autocomplete="tel"
          placeholder="12-345 6789"
        />
        <p v-if="errors.exhibitorPhone" class="field-error" role="alert">
          {{ errors.exhibitorPhone }}
        </p>
      </div>

      <div class="field">
        <label for="exhibitor-industry" class="field-label">
          Industry <span class="field-required" aria-hidden="true">*</span>
        </label>
        <BaseSelect
          id="exhibitor-industry"
          v-model="form.exhibitorIndustry"
          v-bind:invalid="!!errors.exhibitorIndustry"
          placeholder="Select an industry"
          v-bind:options="industryOptions"
        />
        <p v-if="errors.exhibitorIndustry" class="field-error" role="alert">
          {{ errors.exhibitorIndustry }}
        </p>
      </div>

      <div class="field">
        <label for="exhibitor-booth-package" class="field-label">
          Booth package <span class="field-required" aria-hidden="true">*</span>
        </label>
        <BaseSelect
          id="exhibitor-booth-package"
          v-model="form.exhibitorBoothPackage"
          v-bind:invalid="!!errors.exhibitorBoothPackage"
          placeholder="Select a package"
          v-bind:options="boothPackageOptions"
        />
        <p v-if="errors.exhibitorBoothPackage" class="field-error" role="alert">
          {{ errors.exhibitorBoothPackage }}
        </p>
      </div>

      <div class="field form-grid-full">
        <label class="exhibitor-form-terms">
          <input
            id="exhibitor-terms"
            v-model="form.exhibitorTerms"
            class="exhibitor-form-checkbox"
            name="exhibitorTerms"
            type="checkbox"
            v-bind:aria-invalid="!!errors.exhibitorTerms"
          />
          <span>
            I agree to the exhibitor terms and the processing of my data for this application.
          </span>
        </label>
        <p v-if="errors.exhibitorTerms" class="field-error" role="alert">
          {{ errors.exhibitorTerms }}
        </p>
      </div>

      <button
        type="submit"
        class="btn btn-primary btn-lg form-grid-full"
        v-bind:disabled="submitStatus === 'sending'"
      >
        {{ submitStatus === 'sending' ? 'Sending...' : 'Submit Application' }}
      </button>
    </form>
  </BaseModal>
</template>

<style scoped>
.exhibitor-form-intro {
  font-size: 16px;
}

/* checkbox on the left, text on the right; the whole row is clickable */
.exhibitor-form-terms {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
}

.exhibitor-form-checkbox {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin: 2px 0 0;
  accent-color: var(--primary);
  cursor: pointer;
}
</style>
