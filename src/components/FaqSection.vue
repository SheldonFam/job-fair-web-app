<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from '@lucide/vue'

const faqs = [
  {
    question: 'Is entry free?',
    answer:
      'Yes. Entry is free for all job seekers. Pre-register online to skip the queue, or register at the Hall B entrance on the day.',
  },
  {
    question: 'What should I bring?',
    answer:
      'At least 10 printed copies of your resume, your IC or student ID, and a pen. Smart-casual dress is recommended.',
  },
  {
    question: 'Is parking available?',
    answer:
      'Yes, basement parking is available at RM3 per entry. The venue is also a 5-minute walk from the nearest LRT station.',
  },
  {
    question: 'Do I need to book career talks?',
    answer:
      'Booking is recommended because seats are limited. Walk-ins are allowed if seats are still free 10 minutes before the talk.',
  },
  {
    question: 'Can fresh graduates and students attend?',
    answer:
      'Absolutely. Many exhibitors offer graduate programmes and internships. Bring your student ID for faster check-in.',
  },
  {
    question: 'How do companies book a booth?',
    answer:
      'Click “Be Our Exhibitor” and complete the 3-step form. Our team will contact you within 3 working days.',
  },
]

// which question is open (0 = the first one, null = all closed)
const openQuestionIndex = ref<number | null>(0)

const toggleQuestion = (index: number) => {
  openQuestionIndex.value = openQuestionIndex.value === index ? null : index
}
</script>

<template>
  <section id="faq" class="section">
    <div class="container faq-inner">
      <div class="faq-header">
        <h2>Frequently asked questions</h2>
        <p class="faq-intro">
          Can’t find your answer? Ask our assistant (bottom right) or use the contact form.
        </p>
      </div>

      <div
        v-for="(item, index) in faqs"
        v-bind:key="item.question"
        class="faq-item"
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
            {{ item.question }}
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
            <p class="faq-answer">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-inner {
  max-width: 820px;
}

.faq-header {
  margin-bottom: 32px;
  text-align: center;
}

.faq-intro {
  margin-top: 12px;
}

.faq-item {
  border-bottom: 1px solid var(--border);
}

.faq-title {
  font-size: 17px;
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
