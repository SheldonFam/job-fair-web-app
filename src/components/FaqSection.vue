<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const faqs = ['entry', 'bring', 'parking', 'talks', 'graduates', 'booth']

// which question is open (0 = the first one, null = all closed)
const openQuestionIndex = ref<number | null>(0)

const toggleQuestion = (index: number) => {
  openQuestionIndex.value = openQuestionIndex.value === index ? null : index
}
</script>

<template>
  <section id="faq" class="section">
    <div class="container">
      <div class="faq-header reveal">
        <p class="eyebrow">{{ t('faq.eyebrow') }}</p>
        <h2>{{ t('faq.title') }}</h2>
        <p class="faq-intro">{{ t('faq.intro') }}</p>
      </div>

      <div
        v-for="(item, index) in faqs"
        v-bind:key="item"
        class="faq-item reveal"
        v-bind:class="{ 'is-open': openQuestionIndex === index }"
      >
        <h3 class="faq-title">
          <button
            v-bind:id="`faq-question-${index}`"
            type="button"
            class="faq-question"
            v-bind:aria-expanded="openQuestionIndex === index"
            v-bind:aria-controls="`faq-answer-${index}`"
            v-on:click="toggleQuestion(index)"
          >
            {{ t(`faq.items.${item}.question`) }}
            <ChevronDown class="faq-chevron" v-bind:size="20" aria-hidden="true" />
          </button>
        </h3>

        <div
          v-bind:id="`faq-answer-${index}`"
          class="faq-panel"
          role="region"
          v-bind:aria-labelledby="`faq-question-${index}`"
          v-bind:inert="openQuestionIndex !== index"
        >
          <div class="faq-panel-content">
            <p class="faq-answer">{{ t(`faq.items.${item}.answer`) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-header {
  margin-bottom: 32px;
}

.faq-intro {
  margin-top: 12px;
}

.faq-item {
  border-bottom: 1px solid var(--border);
}

.faq-title {
  font-size: 18px;
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-height: 64px;
  padding: 16px 0;
  border: 0;
  background: none;
  font-weight: 600;
  line-height: 1.4;
  color: var(--heading);
  text-align: left;
  cursor: pointer;
}

.faq-question:hover {
  color: var(--primary);
}

.faq-chevron {
  flex-shrink: 0;
  color: var(--body);
  transition: rotate 0.2s;
}

.faq-item.is-open .faq-chevron {
  rotate: 180deg;
}

/* Open and close animation: one grid row that grows from 0 to full height. */
.faq-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s;
}

.faq-item.is-open .faq-panel {
  grid-template-rows: 1fr;
}

.faq-panel-content {
  overflow: hidden;
}

.faq-answer {
  padding-bottom: 20px;
}
</style>
