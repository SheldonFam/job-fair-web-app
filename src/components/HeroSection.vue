<script setup lang="ts">
import { ArrowRight, CalendarDays, MapPin } from '@lucide/vue'
import CountdownTimer from './CountdownTimer.vue'

defineEmits<{ openExhibitor: [] }>()
</script>

<template>
  <section id="top" class="hero">
    <div class="container hero-inner">
      <div class="hero-content">
        <ul class="hero-meta">
          <li class="hero-meta-item">
            <CalendarDays class="hero-meta-icon" v-bind:size="18" aria-hidden="true" />
            <span>12–14 Dec 2026 · <span class="hero-meta-time">9:00 AM – 6:00 PM</span></span>
          </li>
          <li class="hero-meta-item">
            <MapPin class="hero-meta-icon" v-bind:size="18" aria-hidden="true" />
            KL Convention Centre
          </li>
        </ul>

        <h1 class="hero-title">Find your next career move</h1>
        <p class="hero-lead">
          Three days of walk-in interviews, career talks and 1-on-1 job matching with 150+ employers
          hiring for 5,000+ roles. Free entry.
        </p>

        <div class="hero-actions">
          <a href="#sessions" class="btn btn-primary btn-lg">Reserve a Session</a>
          <button type="button" class="hero-link" v-on:click="$emit('openExhibitor')">
            Be Our Exhibitor <ArrowRight v-bind:size="18" aria-hidden="true" />
          </button>
        </div>

        <CountdownTimer class="hero-countdown" />
      </div>

      <!-- stock photo from Unsplash (free to use) -->
      <img
        class="hero-photo"
        src="@/assets/images/hero-job-fair.webp"
        alt="A smiling job seeker talking with a recruiter"
        width="1200"
        height="1250"
      />
    </div>
  </section>
</template>

<style scoped>
.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  /* no bottom padding: the About section below is also white, and its own top padding is enough space */
  padding-block: 72px 0;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

/* date and venue: a plain line with icons, no box, so it looks right on one line or two */
.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--heading);
}

/* the icon lines up with the first line of text, even if the text wraps */
.hero-meta-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

/* the opening hours stay together on one line instead of breaking in the middle */
.hero-meta-time {
  white-space: nowrap;
}

.hero-meta-icon {
  flex-shrink: 0;
  margin-top: 3px;
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

/* the countdown card fills the full width of the text column */
.hero-countdown {
  align-self: stretch;
  margin-top: 8px;
}

/* object-fit: the photo fills the box and is trimmed at the edges instead of being stretched */
.hero-photo {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 5 / 5.2;
  object-fit: cover;
  border-radius: 24px;
  background: var(--surface-muted);
}

@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 32px;
    padding-block: 40px 0;
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
