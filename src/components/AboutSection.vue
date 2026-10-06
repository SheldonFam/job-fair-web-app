<script setup lang="ts">
import { Check, ClipboardCheck, Mic, UserPlus } from '@lucide/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const highlights = ['freeEntry', 'walkIn', 'resumeClinic']

const features = [
  { id: 'employers', icon: UserPlus },
  { id: 'matching', icon: ClipboardCheck },
  { id: 'talks', icon: Mic },
]
</script>

<template>
  <section id="about" class="section">
    <div class="container">
      <div class="about-intro">
        <div>
          <p class="eyebrow">{{ t('about.eyebrow') }}</p>
          <h2>{{ t('about.title') }}</h2>
          <p class="about-lead">{{ t('about.lead') }}</p>

          <ul class="about-highlights">
            <li v-for="highlight in highlights" v-bind:key="highlight" class="about-highlight">
              <Check class="about-highlight-icon" v-bind:size="18" aria-hidden="true" />
              {{ t(`about.highlights.${highlight}`) }}
            </li>
          </ul>
        </div>

        <!-- stock photos from Unsplash (free to use); loading="lazy" waits until they are near the screen -->
        <div class="about-photos">
          <img
            class="about-photo about-photo-tall"
            src="@/assets/images/about-interview.webp"
            v-bind:alt="t('about.photos.interview')"
            width="600"
            height="760"
            loading="lazy"
          />
          <img
            class="about-photo"
            src="@/assets/images/about-career-talk.webp"
            v-bind:alt="t('about.photos.talk')"
            width="600"
            height="380"
            loading="lazy"
          />
          <img
            class="about-photo"
            src="@/assets/images/about-booths.webp"
            v-bind:alt="t('about.photos.booth')"
            width="600"
            height="380"
            loading="lazy"
          />
        </div>
      </div>

      <ul class="about-features">
        <li v-for="feature in features" v-bind:key="feature.id" class="about-feature">
          <span class="about-feature-icon">
            <component v-bind:is="feature.icon" v-bind:size="22" aria-hidden="true" />
          </span>
          <div>
            <h3 class="about-feature-title">{{ t(`about.features.${feature.id}.title`) }}</h3>
            <p class="about-feature-description">
              {{ t(`about.features.${feature.id}.description`) }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* top row: text on the left, photos on the right */
.about-intro {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.about-lead {
  margin-top: 16px;
  font-size: 18px;
}

.about-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-top: 24px;
  font-size: 16px;
  color: var(--heading);
}

.about-highlight {
  display: flex;
  align-items: center;
  gap: 8px;
}

.about-highlight-icon {
  color: var(--success);
}

/* photos: one tall on the left, two stacked on the right */
.about-photos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  aspect-ratio: 3 / 2;
  max-height: 380px;
}

/* each photo fills its grid cell; object-fit trims the edges instead of stretching it */
.about-photo {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: cover;
  border-radius: var(--radius-card);
  background: var(--surface-muted);
}

.about-photo-tall {
  grid-row: span 2;
}

/* bottom row: three features */
.about-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 64px;
  padding-top: 48px;
  border-top: 1px solid var(--border);
}

.about-feature {
  display: flex;
  gap: 16px;
}

.about-feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: var(--primary);
  color: var(--white);
}

.about-feature-title {
  font-size: 16px;
  line-height: 1.5;
}

.about-feature-description {
  margin-top: 6px;
  font-size: 16px;
}

@media (max-width: 1024px) {
  .about-intro {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .about-features {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-top: 48px;
    padding-top: 32px;
  }
}
</style>
