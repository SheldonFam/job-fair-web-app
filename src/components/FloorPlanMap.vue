<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import floorPlanImage from '@/assets/floor-plan.svg'
import { booths, floorPlanHeight, floorPlanWidth } from '@/data/booths'
import { exhibitors, type Exhibitor } from '@/data/exhibitors'

const emit = defineEmits<{ selectExhibitor: [exhibitor: Exhibitor] }>()

const { t } = useI18n()

/* Each booth is placed on top of the drawing with percentages,
   so it stays in the right spot when the map gets bigger or smaller. */
const mapBooths = booths.map((booth) => {
  return {
    code: booth.code,
    industryClass: `is-${booth.industry}`,
    exhibitor: exhibitors.find((exhibitor) => exhibitor.booth === booth.code),
    position: {
      left: `${(booth.x / floorPlanWidth) * 100}%`,
      top: `${(booth.y / floorPlanHeight) * 100}%`,
      width: `${(booth.width / floorPlanWidth) * 100}%`,
      height: `${(booth.height / floorPlanHeight) * 100}%`,
    },
  }
})
</script>

<template>
  <div class="floor-map">
    <img
      class="floor-map-image"
      v-bind:src="floorPlanImage"
      v-bind:width="floorPlanWidth"
      v-bind:height="floorPlanHeight"
      v-bind:alt="t('floorPlan.mapAlt')"
    />

    <template v-for="booth in mapBooths" v-bind:key="booth.code">
      <!-- a booth with a company is a button that opens the company details -->
      <button
        v-if="booth.exhibitor"
        type="button"
        class="floor-map-booth"
        v-bind:class="booth.industryClass"
        v-bind:style="booth.position"
        v-bind:title="t('floorPlan.boothTitle', { name: booth.exhibitor.name, code: booth.code })"
        v-bind:aria-label="
          t('floorPlan.boothLabel', { name: booth.exhibitor.name, code: booth.code })
        "
        v-on:click="emit('selectExhibitor', booth.exhibitor)"
      >
        {{ booth.code }}
      </button>

      <!-- an empty booth is only a label -->
      <span
        v-else
        class="floor-map-booth is-available"
        v-bind:class="booth.industryClass"
        v-bind:style="booth.position"
        v-bind:title="t('floorPlan.emptyBoothTitle', { code: booth.code })"
      >
        {{ booth.code }}
      </span>
    </template>
  </div>
</template>

<style scoped>
/* the drawing with the booths on top.
   --floor-map-zoom is 1 by default; the lightbox raises it to make the map bigger.
   min-width keeps the booths big enough to tap; on small screens the parent scrolls sideways.
   The lightbox sets --floor-map-min-width to 0, so the whole map fits it at 100% zoom.
   container-type lets the booth text size follow the map width (the cqw unit below). */
.floor-map {
  position: relative;
  width: calc(100% * var(--floor-map-zoom, 1));
  min-width: calc(var(--floor-map-min-width, 960px) * var(--floor-map-zoom, 1));
  container-type: inline-size;
}

.floor-map-image {
  display: block;
  width: 100%;
  height: auto;
}

.floor-map-booth {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1.5px solid var(--industry-color);
  border-radius: 4px;
  background: var(--industry-background);
  font-size: max(11px, 1cqw);
  font-weight: 700;
  color: var(--industry-text);
  transition: box-shadow 0.15s;
}

button.floor-map-booth {
  cursor: pointer;
}

/* only the booths that are buttons react to the mouse */
button.floor-map-booth:hover {
  box-shadow: 0 0 0 3px var(--industry-color);
}

.floor-map-booth.is-available {
  border-style: dashed;
  background: var(--white);
  font-weight: 500;
  color: var(--muted);
}

/* when the map is drawn very small (the phone overview in the lightbox),
   the booth codes no longer fit inside the booths, so they are hidden */
@container (max-width: 600px) {
  .floor-map-booth {
    font-size: 0;
  }
}
</style>
