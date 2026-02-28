# 桃園機場捷運 Open Data API 文件

本專案使用桃園市政府資料開放平台 API，透過 Proxy 轉發以解決 CORS 限制。

---

## Proxy 架構

原始 API 的 CORS 設定為 `Access-Control-Allow-Origin: https://opendata.tycg.gov.tw`，不允許跨域請求。前端透過 `src/constants.ts` 中設定的 Proxy Base URL 存取資料：

```ts
// src/constants.ts
export const API_BASE = 'https://mechakucha-api.vercel.app'
```

### 統一回應格式

所有 Proxy 端點回傳統一的 `ApiResponse<T>` 格式：

```jsonc
{
  "success": true,
  "resultCode": "200",
  "resultMessage": "",
  "items": [ /* 原始 API 資料陣列 */ ]
}
```

對應前端型別定義（`src/types/index.ts`）：

```ts
interface ApiResponse<T> {
  success: boolean
  resultCode: string
  resultMessage: string
  items: T[]
}
```

---

## Proxy 端點一覽

| Proxy 路徑 | 用途 | 使用方 |
|------------|------|--------|
| `/taoyuan-mrt/fare` | 起迄站間行車時間與距離 | `useTravelTime` |
| `/taoyuan-mrt/travel-time` | 站間運行秒數（普通車/直達車） | `useTravelTime` |
| `/taoyuan-mrt/timetable` | 站別時刻表 | `useTimetable` |
| `/taoyuan-mrt/first-last-train` | 各站首末班車時刻 | `useFirstLastTrain` |

---

## 1. 起迄站間票價資料 — `/taoyuan-mrt/fare`

**用途**：查詢兩站之間的行車時間與距離（名稱為「票價」但不含實際票價金額，票價由本地 `src/data/fares.ts` 提供）

| 項目 | 值 |
|------|---|
| 原始 rid | `22e689bd-3b8b-4d28-b354-e5a0bc5b1527` |
| 資料筆數 | 462 筆 |
| 更新頻率 | 每日 |

### Request

```http
GET https://mechakucha-api.vercel.app/taoyuan-mrt/fare
```

### Response `items` 範例

```jsonc
{
  "srcupdatetime": "2026-02-28T03:38:20+08:00",
  "updatetime": "2026-02-28T05:59:54+08:00",
  "versionid": "574",
  "originstationid": "A1",        // 起站代碼
  "destinationstationid": "A2",   // 迄站代碼
  "traintype": "0",               // 車種（0=不分車種）
  "traveltime": "5",              // 行車時間（分鐘）
  "traveldistance": "4.236"       // 距離（公里）
}
```

### 欄位說明

| 欄位 | 型別 | 說明 |
|------|------|------|
| `originstationid` | string | 起站代碼（A1~A21） |
| `destinationstationid` | string | 迄站代碼（A1~A21） |
| `traintype` | string | 車種：`"0"` 不分車種 |
| `traveltime` | string | 行車時間，單位**分鐘** |
| `traveldistance` | string | 行車距離，單位**公里** |

---

## 2. 列車站間運行時間 — `/taoyuan-mrt/travel-time`

**用途**：查詢各站間的實際行駛秒數，區分普通車/直達車

| 項目 | 值 |
|------|---|
| 原始 rid | `4b4ea6d2-84b6-4614-b67d-9fe50084fca3` |
| 資料筆數 | 482 筆 |
| 更新頻率 | 不定期 |

### Request

```http
GET https://mechakucha-api.vercel.app/taoyuan-mrt/travel-time
```

### Response `items` 範例

```jsonc
{
  "路線代碼": "A",           // 路線（A=機場線）
  "車種": "1",               // 1=普通車、2=直達車
  "站間序號": "1",           // 排序
  "起站車站代號": "A1",      // 起站
  "迄站車站代號": "A2",      // 迄站
  "站間行駛時間": "300"      // 單位：秒
}
```

### 欄位說明

| 欄位 | 型別 | 說明 |
|------|------|------|
| `路線代碼` | string | `"A"` 機場線 |
| `車種` | string | `"1"` 普通車、`"2"` 直達車 |
| `站間序號` | string | 排序序號 |
| `起站車站代號` | string | 起站代碼（A1~A22） |
| `迄站車站代號` | string | 迄站代碼（A1~A22） |
| `站間行駛時間` | string | 行駛時間，單位**秒** |

> 📝 資料涵蓋 A1~A22（含延伸站），車種有普通車(1)與直達車(2)。

---

## 3. 站別時刻表 — `/taoyuan-mrt/timetable`

**用途**：查詢各站的發車時刻，包含到站時間、車種與營運日

| 項目 | 值 |
|------|---|
| 原始 rid | `83358afd-010a-4989-b63a-bbf20692e408` |

### Request

```http
GET https://mechakucha-api.vercel.app/taoyuan-mrt/timetable
```

### Response `items` 範例

```jsonc
{
  "RouteID": "A",
  "LineID": "A",
  "StationID": "A1",
  "StationName": { "Zh_tw": "台北車站", "En": "Taipei Main Station" },
  "Direction": "0",                    // 0=去程（往中壢）、1=返程（往台北）
  "DestinationStaionID": "A21",
  "DestinStationName": { "Zh_tw": "環北站", "En": "Huanbei" },
  "Timetables": [
    {
      "Sequence": 1,
      "ArrivalTime": "06:00",
      "DepartureTime": "06:00",
      "TrainType": "1"                 // 1=普通車、2=直達車
    }
  ],
  "ServiceDays": {
    "ServiceTag": "weekday",
    "Monday": true,
    "Tuesday": true,
    "Wednesday": true,
    "Thursday": true,
    "Friday": true,
    "Saturday": false,
    "Sunday": false,
    "NationalHolidays": false
  },
  "SrcUpdateTime": "...",
  "UpdateTime": "...",
  "VersionID": "..."
}
```

### 欄位說明

| 欄位 | 型別 | 說明 |
|------|------|------|
| `StationID` | string | 車站代碼 |
| `Direction` | string | `"0"` 去程（往中壢）、`"1"` 返程（往台北） |
| `DestinationStaionID` | string | 目的站代碼 |
| `StationName` | `{ Zh_tw, En }` | 車站名稱 |
| `DestinStationName` | `{ Zh_tw, En }` | 目的站名稱 |
| `Timetables` | array | 時刻表陣列，含 `ArrivalTime`、`DepartureTime`、`TrainType` |
| `ServiceDays` | object | 營運日，各星期布林值 + `NationalHolidays` |

> ⚠️ 原始桃園市開放平台的時刻表 API（rid `83358afd`）巢狀欄位損壞（空白字串），Proxy 端的資料已修正此問題。

---

## 4. 首末班車時刻 — `/taoyuan-mrt/first-last-train`

**用途**：查詢各站首班車與末班車時間

### Request

```http
GET https://mechakucha-api.vercel.app/taoyuan-mrt/first-last-train
```

### Response `items` 範例

```jsonc
{
  "LineNo": "A",
  "LineID": "A",
  "StationID": "A1",
  "StationName": "台北車站",
  "DestinationStaionID": "A21",
  "DestinStationName": "環北站",
  "TrainType": "1",                    // 1=普通車、2=直達車
  "FirstTrainTime": "06:00",
  "LastTrainTime": "23:00",
  "ServiceDays": "weekday",
  "SrcUpdateTime": "...",
  "UpdateTime": "...",
  "VersionID": "..."
}
```

### 欄位說明

| 欄位 | 型別 | 說明 |
|------|------|------|
| `StationID` | string | 車站代碼 |
| `DestinationStaionID` | string | 目的站代碼 |
| `TrainType` | string | `"1"` 普通車、`"2"` 直達車 |
| `FirstTrainTime` | string | 首班車時間（HH:mm） |
| `LastTrainTime` | string | 末班車時間（HH:mm） |
| `ServiceDays` | string | 營運日標籤 |

---

## 原始 API 參考

原始資料來自 [桃園市政府資料開放平台](https://opendata.tycg.gov.tw/)：

```text
https://opendata.tycg.gov.tw/api/v1/dataset.api_access?rid={rid}&format=json&limit=1000
```

| 通用參數 | 必填 | 說明 |
|---------|------|------|
| `rid` | ✅ | 資料集 resource ID |
| `format` | ✅ | 回傳格式：`json` 或 `xml` |
| `limit` | ❌ | 回傳筆數上限（預設 20，建議 `1000`） |
| `offset` | ❌ | 分頁起始位置 |

### 已知問題

- 原始 API 的 CORS 僅允許 `https://opendata.tycg.gov.tw`，前端無法直接呼叫
- 時刻表（rid `83358afd`）與路網（rid `35cd3ed3`）的巢狀欄位在原始 API 中為空白字串，資料損壞
- 路網 API（rid `35cd3ed3-42a4-401d-90bd-7f5b82588169`）僅 `NetworkMapURL` 有值，本專案未使用
