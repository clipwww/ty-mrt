<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTimetable } from '@/composables/useTimetable'
import { useTravelTime } from '@/composables/useTravelTime'
import { getFare } from '@/data/fares'
import { stations } from '@/data/stations'

const { loading: ttLoading, error: ttError, fetchData, getTravelTime, getDistance } = useTravelTime()
const { loading: timetableLoading, error: timetableError, fetchTimetable, getStationTimetable } = useTimetable()

const originId = ref<string | null>(null)
const destinationId = ref<string | null>(null)

const stationItems = stations.map(s => ({
  title: `${s.id} ${s.name}`,
  value: s.id,
}))

const stationIndexMap = new Map(stations.map((s, i) => [s.id, i]))

onMounted(() => {
  fetchData()
  fetchTimetable()
})

function swap() {
  const tmp = originId.value
  originId.value = destinationId.value
  destinationId.value = tmp
}

const result = computed(() => {
  if (!originId.value || !destinationId.value)
    return null
  if (originId.value === destinationId.value)
    return null

  const fare = getFare(originId.value, destinationId.value)
  const normalSeconds = getTravelTime(originId.value, destinationId.value, 1)
  const expressSeconds = getTravelTime(originId.value, destinationId.value, 2)
  const distance = getDistance(originId.value, destinationId.value)

  return {
    fare,
    travelTimeNormal: normalSeconds != null ? Math.ceil(normalSeconds / 60) : null,
    travelTimeExpress: expressSeconds != null ? Math.ceil(expressSeconds / 60) : null,
    distance: distance != null ? Math.round(distance * 10) / 10 : null,
  }
})

const originStation = computed(() => stations.find(s => s.id === originId.value))
const destStation = computed(() => stations.find(s => s.id === destinationId.value))

const trainTypeMap: Record<string, string> = {
  0: '普通車',
  2: '直達車',
}

function getTodayDayKey(): string {
  const dayIndex = new Date().getDay()
  const map: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return map[dayIndex] ?? 'Monday'
}

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  if (h == null || m == null || Number.isNaN(h) || Number.isNaN(m))
    return '—'
  const total = h * 60 + m + minutes
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0')
  const mm = String(total % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

const direction = computed<'0' | '1'>(() => {
  if (!originId.value || !destinationId.value)
    return '0'
  const oi = stationIndexMap.get(originId.value) ?? 0
  const di = stationIndexMap.get(destinationId.value) ?? 0
  return oi <= di ? '0' : '1'
})

const loading = computed(() => ttLoading.value || timetableLoading.value)
const error = computed(() => ttError.value || timetableError.value)

const departureTimetable = computed(() => {
  if (!originId.value || !destinationId.value || originId.value === destinationId.value)
    return []

  const dayKey = getTodayDayKey()
  const items = getStationTimetable(originId.value, direction.value)

  const filtered = items.filter((item) => {
    const sd = item.ServiceDays
    if (!sd)
      return true
    return sd[dayKey as keyof typeof sd] === true
  })

  return filtered.flatMap(item =>
    (item.Timetables ?? []).map((t) => {
      const trainTypeCode = t.TrainType
      const travelMinutes = trainTypeCode === '2'
        ? (result.value?.travelTimeExpress ?? result.value?.travelTimeNormal ?? null)
        : (result.value?.travelTimeNormal ?? null)

      return {
        departureTime: t.DepartureTime,
        trainType: trainTypeMap[trainTypeCode] ?? trainTypeCode,
        estimatedArrival: travelMinutes != null ? addMinutesToTime(t.DepartureTime, travelMinutes) : '—',
      }
    }),
  ).sort((a, b) => a.departureTime.localeCompare(b.departureTime))
})
</script>

<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-4">
      起訖站查詢
    </h2>

    <v-row align="center" class="mb-2" dense>
      <v-col cols="12" sm="5">
        <v-autocomplete
          v-model="originId"
          :items="stationItems"
          label="起站"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="2" class="text-center py-0">
        <v-btn icon variant="text" size="small" @click="swap">
          <v-icon>mdi-swap-horizontal</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" sm="5">
        <v-autocomplete
          v-model="destinationId"
          :items="stationItems"
          label="迄站"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <v-card v-if="result" class="mt-4" variant="outlined">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        {{ originStation?.name }} → {{ destStation?.name }}
      </v-card-title>
      <v-card-text>
        <v-list density="compact">
          <v-list-item v-if="result.fare != null">
            <template #prepend>
              <v-icon color="primary">
                mdi-cash
              </v-icon>
            </template>
            <v-list-item-title>單程票價</v-list-item-title>
            <v-list-item-subtitle class="text-h6 font-weight-bold text-primary">
              NT$ {{ result.fare }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item v-if="result.travelTimeNormal != null">
            <template #prepend>
              <v-icon color="blue">
                mdi-train
              </v-icon>
            </template>
            <v-list-item-title>普通車行車時間</v-list-item-title>
            <v-list-item-subtitle>
              約 {{ result.travelTimeNormal }} 分鐘
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item v-if="result.travelTimeExpress != null">
            <template #prepend>
              <v-icon color="purple">
                mdi-train-variant
              </v-icon>
            </template>
            <v-list-item-title>直達車行車時間</v-list-item-title>
            <v-list-item-subtitle>
              約 {{ result.travelTimeExpress }} 分鐘
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item v-if="result.distance != null">
            <template #prepend>
              <v-icon color="green">
                mdi-map-marker-distance
              </v-icon>
            </template>
            <v-list-item-title>距離</v-list-item-title>
            <v-list-item-subtitle>
              {{ result.distance }} 公里
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card
      v-else-if="originId && destinationId && originId === destinationId"
      class="mt-4"
      variant="outlined"
    >
      <v-card-text class="text-center text-medium-emphasis">
        起站與迄站不可相同
      </v-card-text>
    </v-card>

    <v-card
      v-else-if="!originId || !destinationId"
      class="mt-4"
      variant="outlined"
    >
      <v-card-text class="text-center text-medium-emphasis">
        請選擇起站與迄站以查詢票價及行車時間
      </v-card-text>
    </v-card>

    <v-card v-if="departureTimetable.length > 0" class="mt-4" variant="outlined">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        <v-icon start color="primary">
          mdi-clock-outline
        </v-icon>
        今日時刻表（{{ originStation?.name }}）
      </v-card-title>
      <v-card-text class="pa-0">
        <v-table density="comfortable" fixed-header>
          <thead>
            <tr>
              <th>發車時間</th>
              <th>車種</th>
              <th>預計抵達{{ destStation?.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in departureTimetable" :key="i">
              <td>{{ row.departureTime }}</td>
              <td>
                <v-chip
                  size="small"
                  :color="row.trainType === '直達車' ? 'purple' : 'blue-grey'"
                  variant="tonal"
                  label
                >
                  {{ row.trainType }}
                </v-chip>
              </td>
              <td>{{ row.estimatedArrival }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>
