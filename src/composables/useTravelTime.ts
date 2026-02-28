import type { ApiResponse, FareRaw, TravelTimeEntry, TravelTimeRaw } from '@/types'
import { ref } from 'vue'
import { API_BASE } from '@/constants'

const TRAVEL_TIME_URL = `${API_BASE}/taoyuan-mrt/travel-time`
const FARE_API_URL = `${API_BASE}/taoyuan-mrt/fare`

const travelTimeData = ref<TravelTimeEntry[]>([])
const fareApiData = ref<FareRaw[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let fetched = false

async function fetchData() {
  if (fetched)
    return
  loading.value = true
  error.value = null
  try {
    const [ttRes, fareRes] = await Promise.all([
      fetch(TRAVEL_TIME_URL),
      fetch(FARE_API_URL),
    ])

    if (!ttRes.ok || !fareRes.ok)
      throw new Error('API 請求失敗')

    const ttBody: ApiResponse<TravelTimeRaw> = await ttRes.json()
    const fareBody: ApiResponse<FareRaw> = await fareRes.json()

    if (!ttBody.success || !fareBody.success)
      throw new Error(ttBody.resultMessage || fareBody.resultMessage || 'API 回傳失敗')

    travelTimeData.value = ttBody.items.map(item => ({
      origin: item.起站車站代號,
      destination: item.迄站車站代號,
      trainType: Number(item.車種),
      seconds: Number(item.站間行駛時間),
    }))

    fareApiData.value = fareBody.items
    fetched = true
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : '未知錯誤'
  }
  finally {
    loading.value = false
  }
}

export function useTravelTime() {
  function getTravelTime(origin: string, destination: string, trainType: 1 | 2 = 1): number | null {
    const entry = travelTimeData.value.find(
      e => e.origin === origin && e.destination === destination && e.trainType === trainType,
    )
    if (entry)
      return entry.seconds

    // 反向查找
    const reverse = travelTimeData.value.find(
      e => e.origin === destination && e.destination === origin && e.trainType === trainType,
    )
    return reverse?.seconds ?? null
  }

  function getDistance(origin: string, destination: string): number | null {
    const entry = fareApiData.value.find(
      e => e.originstationid === origin && e.destinationstationid === destination,
    )
    if (entry)
      return Number(entry.traveldistance)

    const reverse = fareApiData.value.find(
      e => e.originstationid === destination && e.destinationstationid === origin,
    )
    return reverse ? Number(reverse.traveldistance) : null
  }

  return {
    travelTimeData,
    fareApiData,
    loading,
    error,
    fetchData,
    getTravelTime,
    getDistance,
  }
}
