<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { Check, ChevronDown } from '@lucide/vue'

type SelectOption = { value: string; label: string }

const props = defineProps<{
  options: SelectOption[]
  id?: string
  label?: string
  placeholder?: string
  invalid?: boolean
  compact?: boolean
}>()

const emit = defineEmits<{ close: [] }>()

const selectedValue = defineModel<string>({ required: true })

const isOpen = ref(false)
const button = ref<HTMLButtonElement | null>(null)
const menu = ref<HTMLElement | null>(null)

const selectedOption = computed(() =>
  props.options.find((option) => option.value === selectedValue.value),
)

const getOptionButtons = () =>
  Array.from(menu.value?.querySelectorAll<HTMLElement>('.select-option') ?? [])

// open the list and put the keyboard focus on the chosen option (or the first one)
const openMenu = async () => {
  isOpen.value = true

  await nextTick()
  const selectedButton = menu.value?.querySelector<HTMLElement>('.select-option.is-selected')
  const firstButton = menu.value?.querySelector<HTMLElement>('.select-option')
  const buttonToFocus = selectedButton ?? firstButton

  buttonToFocus?.focus()
}

const closeMenu = () => {
  isOpen.value = false
  button.value?.focus()
  emit('close')
}

const toggleMenu = () => {
  if (isOpen.value) closeMenu()
  else openMenu()
}

const pickOption = (value: string) => {
  selectedValue.value = value
  closeMenu()
}

// arrow keys: step is 1 for down and -1 for up, and it wraps around at both ends
const moveFocus = (step: number) => {
  const optionButtons = getOptionButtons()
  const currentIndex = optionButtons.indexOf(document.activeElement as HTMLElement)
  const nextIndex = (currentIndex + step + optionButtons.length) % optionButtons.length

  optionButtons[nextIndex]?.focus()
}
</script>

<template>
  <div class="select" v-bind:class="{ 'is-compact': compact }">
    <button
      v-bind:id="id"
      ref="button"
      type="button"
      class="input select-button"
      aria-haspopup="listbox"
      v-bind:aria-expanded="isOpen"
      v-bind:aria-label="label"
      v-bind:aria-invalid="invalid"
      v-on:click="toggleMenu"
      v-on:keydown.down.prevent="openMenu"
    >
      <span class="select-value" v-bind:class="{ 'is-placeholder': !selectedOption }">
        <!-- a parent can replace what the button shows (the header shows an icon and "EN") -->
        <slot name="value">{{ selectedOption?.label ?? placeholder }}</slot>
      </span>
      <ChevronDown
        class="select-chevron"
        v-bind:class="{ 'is-open': isOpen }"
        v-bind:size="16"
        aria-hidden="true"
      />
    </button>

    <template v-if="isOpen">
      <!-- invisible layer behind the list: a click anywhere outside closes it -->
      <div class="select-backdrop" v-on:click="closeMenu"></div>

      <ul
        ref="menu"
        class="select-menu"
        role="listbox"
        v-bind:aria-label="label"
        v-on:keydown.down.prevent="moveFocus(1)"
        v-on:keydown.up.prevent="moveFocus(-1)"
        v-on:keydown.esc.stop="closeMenu"
        v-on:keydown.tab.prevent="closeMenu"
      >
        <li v-for="option in options" v-bind:key="option.value" role="presentation">
          <button
            type="button"
            role="option"
            class="select-option"
            v-bind:class="{ 'is-selected': option.value === selectedValue }"
            v-bind:aria-selected="option.value === selectedValue"
            v-on:click="pickOption(option.value)"
          >
            {{ option.label }}
            <Check
              v-if="option.value === selectedValue"
              class="select-check"
              v-bind:size="18"
              aria-hidden="true"
            />
          </button>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.select {
  position: relative;
}

/* the field: border, height and focus ring come from the global .input */
.select-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  text-align: left;
  cursor: pointer;
}

.select-button[aria-expanded='true'] {
  border-color: var(--primary);
  box-shadow: var(--focus-ring);
}

.select-value {
  display: flex;
  align-items: center;
  gap: 6px;
}

.select-value.is-placeholder {
  color: var(--muted);
}

.select-chevron {
  flex-shrink: 0;
  color: var(--body);
  transition: rotate 0.2s;
}

.select-chevron.is-open {
  rotate: 180deg;
}

.select-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10;
}

/* the list: opens under the field and is at least as wide as it */
.select-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 11;
  min-width: 100%;
  max-height: 264px;
  padding: 6px;
  overflow-y: auto;
  border-radius: var(--radius-card);
  background: var(--surface);
  box-shadow: var(--shadow-menu);
}

.select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--radius-small);
  background: none;
  font-size: 16px;
  color: var(--heading);
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
}

.select-option:hover {
  background: var(--surface-muted);
}

/* keyboard focus: the ring is drawn inside the option, so the edge of the list does not cut it off */
.select-option:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: -2px;
}

.select-option.is-selected {
  background: var(--primary-light);
  font-weight: 600;
}

.select-check {
  flex-shrink: 0;
  color: var(--primary);
}

/* compact: a small bold button (used in the header), with the list aligned to its right edge */
.select.is-compact .select-button {
  width: auto;
  min-height: 44px;
  gap: 6px;
  border-color: var(--border-medium);
  font-size: 16px;
  font-weight: 600;
}

.select.is-compact .select-button:hover {
  border-color: var(--border-strong);
}

.select.is-compact .select-button[aria-expanded='true'] {
  border-color: var(--primary);
}

.select.is-compact .select-menu {
  right: 0;
  left: auto;
  width: 200px;
}
</style>
