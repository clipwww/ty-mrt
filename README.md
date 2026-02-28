# 桃園機場捷運查詢

桃園機場捷運（機場線 A1–A21）票價、行車時間、時刻表與路線查詢工具。

## 功能

- **起訖站查詢** — 選擇起站與迄站，查看單程票價、普通車/直達車行車時間、站間距離，以及今日出發時刻表
- **站點時刻表** — 依車站、方向、星期、車種、目的地篩選完整時刻表
- **路線總覽** — 垂直路線圖標示全線 21 站，區分直達車/普通車停靠站，點擊跳轉時刻表

## 技術棧

- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vuetify 4](https://vuetifyjs.com/) — UI 元件庫
- [Vue Router 5](https://router.vuejs.org/) — 路由
- [UnoCSS](https://unocss.dev/) — 原子化 CSS
- [Vite 7](https://vite.dev/) — 開發與建構工具

## 開發

```bash
# 安裝相依套件
bun install

# 啟動開發伺服器
bun dev

# 型別檢查 + 建構
bun run build

# Lint
bun run lint
```

## 專案結構

```
src/
├── components/          # 共用元件
├── composables/         # 組合式函式（API 呼叫與資料處理）
│   ├── useFirstLastTrain.ts
│   ├── useTimetable.ts
│   └── useTravelTime.ts
├── data/                # 靜態資料（車站、票價）
│   ├── fares.ts
│   └── stations.ts
├── pages/               # 頁面元件
│   ├── QueryPage.vue        # 起訖站查詢（首頁）
│   ├── TimetablePage.vue    # 站點時刻表
│   ├── RoutePage.vue        # 路線總覽
│   └── FirstLastTrainPage.vue # 首末班車
├── plugins/vuetify.ts   # Vuetify 設定
├── router/index.ts      # 路由設定
├── types/index.ts       # TypeScript 型別定義
├── constants.ts         # API Base URL
└── App.vue              # 主佈局（App Bar + 底部導航列）
```

## 資料來源

- **票價**：本地靜態對照表（`src/data/fares.ts`）
- **行車時間 / 距離 / 時刻表**：桃園市政府資料開放平台 API，經 Proxy 轉發（詳見 [docs/API.md](docs/API.md)）

## 部署

本專案部署於 GitHub Pages，base path 為 `/taoyuan-mrt/`。`public/404.html` 處理 SPA 路由重導。
