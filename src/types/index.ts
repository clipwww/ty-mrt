/** Proxy API 統一回傳格式 */
export interface ApiResponse<T> {
  success: boolean
  resultCode: string
  resultMessage: string
  items: T[]
}

export interface Station {
  id: string
  name: string
  nameEn: string
  isExpress: boolean
}

export interface FareEntry {
  origin: string
  destination: string
  fare: number
}

/** 站間運行時間 API 回傳結構 */
export interface TravelTimeRaw {
  路線代碼: string
  /** 1=普通車、2=直達車 */
  車種: string
  站間序號: string
  起站車站代號: string
  迄站車站代號: string
  /** 單位：秒 */
  站間行駛時間: string
}

/** 起迄站間票價 API 回傳結構 */
export interface FareRaw {
  srcupdatetime: string
  updatetime: string
  versionid: string
  originstationid: string
  destinationstationid: string
  /** 0=不分車種 */
  traintype: string
  /** 單位：分鐘 */
  traveltime: string
  /** 單位：公里 */
  traveldistance: string
}

/** 首末班車 API 回傳結構 */
export interface FirstLastTrainRaw {
  LineNo: string
  LineID: string
  StationID: string
  StationName: string
  DestinationStaionID: string
  DestinStationName: string
  TrainType: string
  FirstTrainTime: string
  LastTrainTime: string
  ServiceDays: string
  SrcUpdateTime: string
  UpdateTime: string
  VersionID: string
}

export interface NameObject {
  Zh_tw: string
  En: string
}

export interface TimetableEntry {
  Sequence: number
  ArrivalTime: string
  DepartureTime: string
  TrainType: string
}

export interface ServiceDays {
  ServiceTag: string
  Monday: boolean
  Tuesday: boolean
  Wednesday: boolean
  Thursday: boolean
  Friday: boolean
  Saturday: boolean
  Sunday: boolean
  NationalHolidays: boolean
}

/** 時刻表 API 回傳結構 */
export interface TimetableRaw {
  RouteID: string
  LineID: string
  StationID: string
  StationName: NameObject
  /** 0=去程、1=返程 */
  Direction: string
  DestinationStaionID: string
  DestinStationName: NameObject
  Timetables: TimetableEntry[]
  ServiceDays: ServiceDays
  SrcUpdateTime: string
  UpdateTime: string
  VersionID: string
}

export interface TravelTimeEntry {
  origin: string
  destination: string
  /** 1=普通車、2=直達車 */
  trainType: number
  /** 秒 */
  seconds: number
}

export interface QueryResult {
  origin: Station
  destination: Station
  fare: number | null
  /** 普通車行車時間（分鐘） */
  travelTimeNormal: number | null
  /** 直達車行車時間（分鐘） */
  travelTimeExpress: number | null
  /** 距離（公里） */
  distance: number | null
}
