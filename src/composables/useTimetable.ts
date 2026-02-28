import type { ApiResponse, TimetableRaw } from '@/types'
import { ref } from 'vue'
import { API_BASE } from '@/constants'

const TIMETABLE_URL = `${API_BASE}/taoyuan-mrt/timetable`

const timetableData = ref<TimetableRaw[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let fetched = false

async function fetchTimetable() {
  if (fetched)
    return
  loading.value = true
  error.value = null
  try {
    const res = await fetch(TIMETABLE_URL)
    if (!res.ok)
      throw new Error('時刻表 API 請求失敗')
    const body: ApiResponse<TimetableRaw> = await res.json()
    if (!body.success)
      throw new Error(body.resultMessage || '時刻表 API 回傳失敗')
    timetableData.value = body.items
    fetched = true
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : '未知錯誤'
  }
  finally {
    loading.value = false
  }
}

export function useTimetable() {
  function getStationTimetable(stationId: string, direction: '0' | '1') {
    return timetableData.value.filter(
      item => item.StationID === stationId && item.Direction === direction,
    )
  }

  return {
    timetableData,
    loading,
    error,
    fetchTimetable,
    getStationTimetable,
  }
}
