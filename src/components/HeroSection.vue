<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'

defineEmits<{ openExhibitor: [] }>()
</script>

<template>
  <section id="top" class="hero">
    <div class="container hero-inner">
      <div class="hero-content">
        <a href="#sessions" class="hero-pill">
          <span class="hero-pill-badge">12–14 December 2026 · 9:00 AM – 6:00 PM</span>
          <span class="hero-pill-venue">
            Halls A–C, Kuala Lumpur
            <ArrowRight class="hero-pill-arrow" :size="16" aria-hidden="true" />
          </span>
        </a>

        <h1 class="hero-title">Find Your Next Career Move</h1>
        <p class="hero-lead">
          Three days of walk-in interviews, career talks and 1-on-1 job matching with 150+ employers
          hiring for 5,000+ roles. Free entry.
        </p>

        <div class="hero-actions">
          <a href="#sessions" class="btn btn-primary btn-lg">Reserve a Session</a>
          <button type="button" class="hero-link" @click="$emit('openExhibitor')">
            Be Our Exhibitor <ArrowRight :size="18" aria-hidden="true" />
          </button>
        </div>

        <!-- <CountdownTimer /> goes here -->
      </div>

      <!-- Placeholder. Swap for: <img class="hero-photo" src="@/assets/hero.jpg" alt="..." /> -->
      <div class="hero-photo" role="img" aria-label="Job seekers talking to recruiters at a job fair">
        [Hero photo: job seekers talking to recruiters]
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  padding-block: 72px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

/* date and venue pill */
.hero-pill {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 10px;
  padding: 4px 14px 4px 4px;
  border: 1px solid var(--border);
  border-radius: 18px;
  font-size: 13px;
  color: var(--body);
  text-decoration: none;
}

.hero-pill:hover {
  border-color: var(--border-medium);
}

.hero-pill-badge {
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--primary-light);
  color: var(--primary-dark);
  font-weight: 600;
}

/* venue and arrow stay together if the pill wraps onto two lines */
.hero-pill-venue {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding-left: 6px;
}

.hero-pill-arrow {
  color: var(--primary);
}

/* text */
.hero-title {
  font-size: clamp(38px, 5vw, 60px);
  line-height: 1.08;
}

.hero-lead {
  max-width: 540px;
  font-size: 18px;
  line-height: 1.7;
}

/* buttons */
.hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.hero-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  font-weight: 600;
  color: var(--heading);
  cursor: pointer;
  transition: color 0.15s;
}

.hero-link:hover {
  color: var(--primary);
}

/* grey box until the real photo is added */
.hero-photo {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 5 / 5.2;
  padding: 16px;
  border-radius: 24px;
  background: var(--surface-hover);
  font-size: 13px;
  text-align: center;
}

@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 32px;
    padding-block: 40px;
  }
  .hero-photo {
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 640px) {
  .hero-actions .btn {
    width: 100%;
  }
}
</style>
