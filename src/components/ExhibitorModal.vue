<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { CircleCheck } from '@lucide/vue'
import BaseModal from './BaseModal.vue'
import { useI18n } from 'vue-i18n'
import { industries } from '@/data/exhibitors'
import BaseSelect from './BaseSelect.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()

const industryOptions = computed(() =>
  industries.map((industry) => ({ value: industry, label: t(`industries.${industry}`) })),
)

const boothPackageOptions = computed(() =>
  ['standard', 'premium', 'platinum'].map((boothPackage) => ({
    value: boothPackage,
    label: t(`exhibitorForm.packages.${boothPackage}`),
  })),
)

const form = reactive({
  exhibitorCompanyName: '',
  exhibitorContactPerson: '',
  exhibitorEmail: '',
  exhibitorPhone: '',
  exhibitorIndustry: '',
  exhibitorBoothPackage: '',
  exhibitorTerms: false,
})

// each error holds a translation key (like 'errors.fullName'), shown with t() in the template
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
  if (!value.trim()) return 'errors.email'
  if (!emailPattern.test(value)) return 'errors.emailInvalid'
  return ''
}

const validatePhone = (value: string) => {
  if (!value.trim()) return 'errors.phone'
  const digits = value.replace(/[\s-]/g, '').replace(/^(\+?60|0)/, '')
  if (!/^1\d{8,9}$/.test(digits)) return 'errors.phoneInvalid'
  return ''
}

const validateForm = () => {
  errors.exhibitorCompanyName = form.exhibitorCompanyName.trim() ? '' : 'errors.companyName'
  errors.exhibitorEmail = validateEmail(form.exhibitorEmail)
  errors.exhibitorPhone = validatePhone(form.exhibitorPhone)
  errors.exhibitorContactPerson = form.exhibitorContactPerson ? '' : 'errors.contactPerson'
  errors.exhibitorIndustry = form.exhibitorIndustry ? '' : 'errors.industry'
  errors.exhibitorBoothPackage = form.exhibitorBoothPackage ? '' : 'errors.boothPackage'
  errors.exhibitorTerms = form.exhibitorTerms ? '' : 'errors.terms'

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
  <BaseModal v-bind:open="open" v-bind:title="t('exhibitorForm.title')" v-on:close="emit('close')">
    <!-- Success modal -->
    <div v-if="submitStatus === 'sent'" class="form-success" role="status">
      <CircleCheck class="form-success-icon" v-bind:size="56" aria-hidden="true" />
      <h3 class="form-success-title">{{ t('exhibitorForm.successTitle') }}</h3>
      <p>{{ t('exhibitorForm.successText') }}</p>
      <button
        ref="successCloseButton"
        type="button"
        class="btn btn-primary"
        v-on:click="emit('close')"
      >
        {{ t('common.close') }}
      </button>
    </div>

    <form v-else class="form-grid" novalidate v-on:submit.prevent="handleSubmit">
      <p v-if="submitStatus === 'failed'" class="alert alert-error form-grid-full">
        {{ t('exhibitorForm.failed') }}
      </p>

      <p class="exhibitor-form-intro form-grid-full">
        {{ t('exhibitorForm.intro') }}
      </p>

      <div class="field form-grid-full">
        <label for="exhibitor-company-name" class="field-label">
          {{ t('form.companyName') }} <span class="field-required" aria-hidden="true">*</span>
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
          {{ t(errors.exhibitorCompanyName) }}
        </p>
      </div>

      <div class="field form-grid-full">
        <label for="exhibitor-contact-person" class="field-label">
          {{ t('form.contactPerson') }} <span class="field-required" aria-hidden="true">*</span>
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
          {{ t(errors.exhibitorContactPerson) }}
        </p>
      </div>

      <div class="field">
        <label for="exhibitor-email" class="field-label">
          {{ t('form.workEmail') }} <span class="field-required" aria-hidden="true">*</span>
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
          {{ t(errors.exhibitorEmail) }}
        </p>
      </div>

      <div class="field">
        <label for="exhibitor-phone" class="field-label">
          {{ t('form.phone') }} <span class="field-required" aria-hidden="true">*</span>
        </label>
        <input
          id="exhibitor-phone"
          v-model="form.exhibitorPhone"
          v-bind:aria-invalid="!!errors.exhibitorPhone"
          class="input"
          name="exhibitorPhone"
          type="tel"
          autocomplete="tel"
          placeholder="012-345 6789"
        />
        <p v-if="errors.exhibitorPhone" class="field-error" role="alert">
          {{ t(errors.exhibitorPhone) }}
        </p>
      </div>

      <div class="field">
        <label for="exhibitor-industry" class="field-label">
          {{ t('form.industry') }} <span class="field-required" aria-hidden="true">*</span>
        </label>
        <BaseSelect
          id="exhibitor-industry"
          v-model="form.exhibitorIndustry"
          v-bind:invalid="!!errors.exhibitorIndustry"
          v-bind:placeholder="t('exhibitorForm.industryPlaceholder')"
          v-bind:options="industryOptions"
        />
        <p v-if="errors.exhibitorIndustry" class="field-error" role="alert">
          {{ t(errors.exhibitorIndustry) }}
        </p>
      </div>

      <div class="field">
        <label for="exhibitor-booth-package" class="field-label">
          {{ t('form.boothPackage') }} <span class="field-required" aria-hidden="true">*</span>
        </label>
        <BaseSelect
          id="exhibitor-booth-package"
          v-model="form.exhibitorBoothPackage"
          v-bind:invalid="!!errors.exhibitorBoothPackage"
          v-bind:placeholder="t('exhibitorForm.packagePlaceholder')"
          v-bind:options="boothPackageOptions"
        />
        <p v-if="errors.exhibitorBoothPackage" class="field-error" role="alert">
          {{ t(errors.exhibitorBoothPackage) }}
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
          <span>{{ t('exhibitorForm.terms') }}</span>
        </label>
        <p v-if="errors.exhibitorTerms" class="field-error" role="alert">
          {{ t(errors.exhibitorTerms) }}
        </p>
      </div>

      <button
        type="submit"
        class="btn btn-primary btn-lg form-grid-full"
        v-bind:disabled="submitStatus === 'sending'"
      >
        {{ submitStatus === 'sending' ? t('common.sending') : t('exhibitorForm.submit') }}
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
