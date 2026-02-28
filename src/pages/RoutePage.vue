<script setup lang="ts">
import { useRouter } from 'vue-router'
import { stations } from '@/data/stations'

const router = useRouter()

function goToTimetable(stationId: string) {
  router.push({ path: '/timetable', query: { station: stationId } })
}
</script>

<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-4">
      路線總覽
    </h2>

    <v-card variant="outlined">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        <v-icon start color="primary">
          mdi-train
        </v-icon>
        機場捷運線 (A線)
      </v-card-title>

      <v-card-text class="pa-0">
        <div class="route-line">
          <div
            v-for="(station, index) in stations"
            :key="station.id"
            class="route-station"
            @click="goToTimetable(station.id)"
          >
            <div class="route-node-col">
              <div
                v-if="index > 0"
                class="route-line-segment"
                :class="{ 'route-line-express': station.isExpress && stations[index - 1]?.isExpress }"
              />
              <div
                class="route-node"
                :class="{ 'route-node-express': station.isExpress }"
              />
              <div
                v-if="index < stations.length - 1"
                class="route-line-segment"
                :class="{ 'route-line-express': station.isExpress && stations[index + 1]?.isExpress }"
              />
            </div>
            <div class="route-info">
              <div class="d-flex align-center gap-2">
                <v-chip
                  size="small"
                  :color="station.isExpress ? 'purple' : 'blue-grey'"
                  variant="flat"
                  label
                >
                  {{ station.id }}
                </v-chip>
                <span class="text-body-1 font-weight-medium">
                  {{ station.name }}
                </span>
                <v-chip
                  v-if="station.isExpress"
                  size="x-small"
                  color="purple"
                  variant="tonal"
                >
                  直達車停靠
                </v-chip>
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ station.nameEn }}
              </div>
            </div>
            <v-icon class="route-arrow" color="grey-lighten-1" size="small">
              mdi-chevron-right
            </v-icon>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mt-4" variant="outlined">
      <v-card-text class="text-caption text-medium-emphasis">
        <v-icon size="small" color="purple" class="mr-1">
          mdi-circle
        </v-icon>
        紫色站點為直達車停靠站
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.route-line {
  display: flex;
  flex-direction: column;
}

.route-station {
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  min-height: 56px;
}

.route-station:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.route-node-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  min-height: 56px;
  flex-shrink: 0;
  margin-right: 12px;
}

.route-line-segment {
  flex: 1;
  width: 3px;
  background-color: #7B1FA2;
}

.route-line-express {
  background-color: #7B1FA2;
}

.route-node {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid #607D8B;
  background: white;
  flex-shrink: 0;
  z-index: 1;
}

.route-node-express {
  border-color: #7B1FA2;
  width: 16px;
  height: 16px;
}

.route-info {
  flex: 1;
  padding: 8px 0;
}

.route-arrow {
  flex-shrink: 0;
}
</style>
