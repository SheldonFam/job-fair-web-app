<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { Maximize2, Minus, Plus } from '@lucide/vue'
import { industryLabels, type Exhibitor } from '@/data/exhibitors'
import BaseModal from './BaseModal.vue'
import BoothModal from './BoothModal.vue'
import FloorPlanMap from './FloorPlanMap.vue'

const minimumZoom = 1
const maximumZoom = 4
const zoomStep = 0.5

const isLightboxOpen = ref(false)
const zoomLevel = ref(minimumZoom)

const isBoothOpen = ref(false)
const selectedExhibitor = ref<Exhibitor | null>(null)

const zoomPercent = computed(() => {
  return Math.round(zoomLevel.value * 100)
})

const zoomIn = () => {
  zoomLevel.value = Math.min(maximumZoom, zoomLevel.value + zoomStep)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(minimumZoom, zoomLevel.value - zoomStep)
}

const resetZoom = () => {
  zoomLevel.value = minimumZoom
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  resetZoom()
}

const openBooth = async (exhibitor: Exhibitor) => {
  // a booth can be clicked inside the lightbox: close it first, so only one modal is open
  if (isLightboxOpen.value) {
    closeLightbox()
    await nextTick()
  }

  selectedExhibitor.value = exhibitor
  isBoothOpen.value = true
}
</script>

<template>
  <section id="floorplan" class="section section-alt">
    <div class="container">
      <div class="floor-plan-header">
        <div>
          <p class="eyebrow">Floor plan</p>
          <h2>Find your way around Halls A–C</h2>
          <p class="floor-plan-lead">
            Click a booth to see who is there. Hall A is Tech, Hall B is Finance and Engineering,
            Hall C is Healthcare and Startups.
          </p>
        </div>
        <button type="button" class="btn btn-outline" v-on:click="isLightboxOpen = true">
          <Maximize2 v-bind:size="18" aria-hidden="true" />
          View Full Map
        </button>
      </div>

      <div class="card floor-plan-card">
        <p class="floor-plan-hint">
          Swipe sideways to see all three halls, or open the full map to see them at once.
        </p>

        <div class="floor-plan-scroll">
          <FloorPlanMap v-on:select-exhibitor="openBooth" />
        </div>

        <ul class="floor-plan-legend">
          <li
            v-for="(label, industry) in industryLabels"
            v-bind:key="industry"
            class="floor-plan-legend-item"
            v-bind:class="`is-${industry}`"
          >
            <span class="floor-plan-legend-box"></span>
            {{ label }}
          </li>
          <li class="floor-plan-legend-item">
            <span class="floor-plan-legend-box is-available"></span>
            Empty booth
          </li>
        </ul>
      </div>
    </div>

    <!-- lightbox: the same map, bigger, with zoom buttons -->
    <BaseModal
      wide
      title="Floor plan · Halls A–C"
      v-bind:open="isLightboxOpen"
      v-on:close="closeLightbox"
    >
      <div class="floor-plan-zoom">
        <button
          type="button"
          class="icon-button"
          aria-label="Zoom out"
          v-bind:disabled="zoomLevel === minimumZoom"
          v-on:click="zoomOut"
        >
          <Minus v-bind:size="20" aria-hidden="true" />
        </button>
        <span class="floor-plan-zoom-level" aria-live="polite">{{ zoomPercent }}%</span>
        <button
          type="button"
          class="icon-button"
          aria-label="Zoom in"
          v-bind:disabled="zoomLevel === maximumZoom"
          v-on:click="zoomIn"
        >
          <Plus v-bind:size="20" aria-hidden="true" />
        </button>
        <button type="button" class="btn btn-outline btn-sm" v-on:click="resetZoom">Reset</button>
      </div>

      <div class="floor-plan-scroll floor-plan-lightbox">
        <FloorPlanMap
          v-bind:style="{ '--floor-map-zoom': zoomLevel }"
          v-on:select-exhibitor="openBooth"
        />
      </div>
    </BaseModal>

    <!-- booth details, shown after a booth is clicked -->
    <BoothModal
      v-bind:open="isBoothOpen"
      v-bind:exhibitor="selectedExhibitor"
      v-on:close="isBoothOpen = false"
    />
  </section>
</template>

<style scoped>
/* heading on the left, "View Full Map" button on the right */
.floor-plan-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 32px;
}

.floor-plan-lead {
  max-width: 560px;
  margin-top: 8px;
}

.floor-plan-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

/* only shown on small screens, where the map is wider than the screen */
.floor-plan-hint {
  display: none;
  font-size: 14px;
  color: var(--muted);
}

/* when the map is wider than this box, it scrolls inside the box, not the whole page */
.floor-plan-scroll {
  overflow-x: auto;
}

.floor-plan-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  font-size: 14px;
}

.floor-plan-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.floor-plan-legend-box {
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--industry-color);
  border-radius: 4px;
  background: var(--industry-background);
}

.floor-plan-legend-box.is-available {
  border: 1.5px dashed var(--border-strong);
  background: var(--white);
}

/* lightbox: zoom buttons above the map */
.floor-plan-zoom {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.floor-plan-zoom-level {
  min-width: 52px;
  font-weight: 600;
  color: var(--heading);
  text-align: center;
}

/* the zoomed map scrolls in both directions inside this box.
   --floor-map-min-width: 0 lets the whole map fit the box at 100% zoom, even on a phone. */
.floor-plan-lightbox {
  --floor-map-min-width: 0px;
  max-height: 65vh;
  overflow-y: auto;
  border-radius: var(--radius);
  background: var(--surface-alt);
}

@media (max-width: 1024px) {
  .floor-plan-hint {
    display: block;
  }
}

@media (max-width: 640px) {
  .floor-plan-card {
    padding: 16px;
  }
}
</style>
