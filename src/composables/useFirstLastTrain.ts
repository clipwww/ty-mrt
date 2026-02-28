import type { ApiResponse, FirstLastTrainRaw } from '@/types'
import { ref } from 'vue'
import { API_BASE } from '@/constants'

const FIRST_LAST_TRAIN_URL = `${API_BASE}/taoyuan-mrt/first-last-train`

const firstLastTrainData = ref<FirstLastTrainRaw[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let fetched = false

async function fetchFirstLastTrain() {
  if (fetched)
    return
  loading.value = true
  error.value = null
  try {
    const res = await fetch(FIRST_LAST_TRAIN_URL)
    if (!res.ok)
      throw new Error('首末班車 API 請求失敗')
    const body: ApiResponse<FirstLastTrainRaw> = await res.json()
    if (!body.success)
      throw new Error(body.resultMessage || '首末班車 API 回傳失敗')
    firstLastTrainData.value = body.items
    fetched = true
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : '未知錯誤'
  }
  finally {
    loading.value = false
  }
}

export function useFirstLastTrain() {
  function getStationFirstLastTrain(stationId: string) {
    return firstLastTrainData.value.filter(
      item => item.StationID === stationId,
    )
  }

  return {
    firstLastTrainData,
    loading,
    error,
    fetchFirstLastTrain,
    getStationFirstLastTrain,
  }
}
