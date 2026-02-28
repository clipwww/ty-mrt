<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTimetable } from '@/composables/useTimetable'
import { stations } from '@/data/stations'

const route = useRoute()
const { loading, error, fetchTimetable, getStationTimetable } = useTimetable()

const selectedStation = ref<string>((route.query.station as string) || 'A1')
const direction = ref<'0' | '1'>('0')

const serviceDayOptions = [
  { title: '週一', value: 'Monday' },
  { title: '週二', value: 'Tuesday' },
  { title: '週三', value: 'Wednesday' },
  { title: '週四', value: 'Thursday' },
  { title: '週五', value: 'Friday' },
  { title: '週六', value: 'Saturday' },
  { title: '週日', value: 'Sunday' },
  { title: '國定假日', value: 'NationalHolidays' },
] as const

function getTodayDayKey(): string {
  const dayIndex = new Date().getDay()
  const map: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return map[dayIndex] ?? 'Monday'
}

const selectedDay = ref<string>(getTodayDayKey())
const selectedTrainType = ref<string>('all')
const selectedDestination = ref<string>('all')

const stationItems = stations.map(s => ({
  title: `${s.id} ${s.name}`,
  value: s.id,
}))

const trainTypeMap: Record<string, string> = {
  0: '普通車',
  2: '直達車',
}

function formatTrainType(type: string) {
  return trainTypeMap[type] ?? type
}

const allRows = computed(() => {
  const items = getStationTimetable(selectedStation.value, direction.value)

  const filtered = items.filter((item) => {
    const sd = item.ServiceDays
    if (!sd)
      return true
    return sd[selectedDay.value as keyof typeof sd] === true
  })

  return filtered.flatMap(item =>
    (item.Timetables ?? []).map(t => ({
      destination: item.DestinStationName?.Zh_tw || item.DestinationStaionID,
      sequence: t.Sequence,
      arrivalTime: t.ArrivalTime,
      departureTime: t.DepartureTime,
      trainType: formatTrainType(t.TrainType),
      rawTrainType: t.TrainType,
    })),
  ).sort((a, b) => a.departureTime.localeCompare(b.departureTime))
})

const destinationOptions = computed(() => {
  const set = new Set(allRows.value.map(r => r.destination))
  return [{ title: '全部', value: 'all' }, ...[...set].map(d => ({ title: d, value: d }))]
})

const trainTypeOptions = computed(() => {
  const set = new Set(allRows.value.map(r => r.trainType))
  return [{ title: '全部', value: 'all' }, ...[...set].map(t => ({ title: t, value: t }))]
})

const timetableRows = computed(() => {
  return allRows.value.filter((row) => {
    if (selectedTrainType.value !== 'all' && row.trainType !== selectedTrainType.value)
      return false
    if (selectedDestination.value !== 'all' && row.destination !== selectedDestination.value)
      return false
    return true
  })
})

onMounted(fetchTimetable)
</script>

<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-4">
      站點時刻表
    </h2>

    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-autocomplete
          v-model="selectedStation"
          :items="stationItems"
          label="選擇車站"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn-toggle v-model="direction" mandatory color="primary" variant="outlined" class="w-full">
          <v-btn value="0" class="flex-grow-1">
            <v-icon start>
              mdi-arrow-right
            </v-icon>
            往中壢方向
          </v-btn>
          <v-btn value="1" class="flex-grow-1">
            <v-icon start>
              mdi-arrow-left
            </v-icon>
            往台北方向
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn-toggle v-model="selectedDay" mandatory color="primary" variant="outlined" class="flex-wrap">
          <v-btn
            v-for="opt in serviceDayOptions"
            :key="opt.value"
            :value="opt.value"
            size="small"
          >
            {{ opt.title }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="6" sm="4">
        <v-select
          v-model="selectedTrainType"
          :items="trainTypeOptions"
          label="車種"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>
      <v-col cols="6" sm="4">
        <v-select
          v-model="selectedDestination"
          :items="destinationOptions"
          label="目的地"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <template v-else>
      <v-alert
        v-if="timetableRows.length === 0 && !loading"
        type="info"
        variant="tonal"
        class="mb-4"
      >
        此站暫無時刻表資料。
      </v-alert>

      <v-table v-if="timetableRows.length > 0" density="comfortable" fixed-header>
        <thead>
          <tr>
            <th>到站</th>
            <th>目的地</th>
            <th>車種</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in timetableRows" :key="i">
            <td>{{ row.arrivalTime }}</td>
            <td>{{ row.destination }}</td>
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
          </tr>
        </tbody>
      </v-table>
    </template>
  </div>
</template>
