<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFirstLastTrain } from '@/composables/useFirstLastTrain'
import { stations } from '@/data/stations'

const { loading, error, fetchFirstLastTrain, getStationFirstLastTrain } = useFirstLastTrain()

const selectedStation = ref<string>('A1')

const stationItems = stations.map(s => ({
  title: `${s.id} ${s.name}`,
  value: s.id,
}))

onMounted(fetchFirstLastTrain)

function getRows() {
  return getStationFirstLastTrain(selectedStation.value).map(item => ({
    destination: item.DestinStationName?.trim() || item.DestinationStaionID,
    trainType: item.TrainType?.trim() || '—',
    firstTrain: item.FirstTrainTime?.trim() || '—',
    lastTrain: item.LastTrainTime?.trim() || '—',
    serviceDays: item.ServiceDays?.trim() || '—',
  }))
}
</script>

<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-4">
      首末班車時刻
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
    </v-row>

    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <template v-else>
      <v-alert
        v-if="getRows().length === 0 && !loading"
        type="info"
        variant="tonal"
        class="mb-4"
      >
        此站暫無首末班車資料。
      </v-alert>

      <v-table v-if="getRows().length > 0" density="comfortable">
        <thead>
          <tr>
            <th>目的地</th>
            <th>車種</th>
            <th>首班車</th>
            <th>末班車</th>
            <th>營運日</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in getRows()" :key="i">
            <td>{{ row.destination }}</td>
            <td>{{ row.trainType }}</td>
            <td>{{ row.firstTrain }}</td>
            <td>{{ row.lastTrain }}</td>
            <td>{{ row.serviceDays }}</td>
          </tr>
        </tbody>
      </v-table>
    </template>
  </div>
</template>
