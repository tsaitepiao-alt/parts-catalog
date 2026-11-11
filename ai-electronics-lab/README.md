# 嘉蘭 AI 電子研發中心 · 互動教學實驗室 v0.3

獨立的繁體中文互動教學模組，放在既有 `parts-catalog` 專案的 `ai-electronics-lab/` 目錄。
版型與工作台操作概念參考 [Learn ESP32](https://learn-esp32.vercel.app/)，程式、文字和示意幾何模型均獨立製作，未取得或使用對方原始碼、3D 資產與品牌素材。

## 執行

這是無建置、無 CDN、無外部套件依賴的靜態網站。從儲存庫根目錄執行：

```sh
python3 -m http.server 8080
```

開啟 `http://localhost:8080/ai-electronics-lab/`。若既有 GitHub Pages 設為 main 根目錄，網址路徑為 `/parts-catalog/ai-electronics-lab/`。

## 已實作

- 參考網站的左側導覽、中央模型、右側四分頁與程式面板、下方課程橫列。
- 以 Canvas2D 投影自建 3D 幾何模型，不依賴 WebGL：可旋轉、滾輪縮放、單指旋轉、雙指縮放、俯視、分解與標籤點選。
- 12 堂課：ESP32-S3、LED、I²C、IMU、溫度、BLE、GNSS、光學模組、音箱、溫感警示、智慧拐杖、WPCD 整合。
- 原理說明、邏輯接線表、材料與規格、實作步驟及可複製的 Arduino 範例或明確標示的規劃內容。
- LED、訊號、動作與組裝教學動畫；串列視窗明示為 DEMO。
- 元件搜尋、五大產品入口、課程選單、深淺色切換。
- 瀏覽器本機學習標記與 JSON 匯出；不是硬體驗證紀錄。
- 手機單欄版面；靜態相對路徑與 hash 路由可部署在子目錄。

## 檔案

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 工作台版面 |
| `style.css` | 桌面、手機與深色樣式 |
| `lessons.js` | 課程內容與元件清單 |
| `scene.js` | 示意 3D 幾何與投影繪圖 |
| `app.js` | 導覽、分頁、示範、搜尋與學習標記 |

## 目前界線

- 這是獨立教學原型，尚未取代或同步既有 AI 電子研發中心的資料庫。
- 沒有 AI 模型服務、雲端資料庫、帳號同步、Web Serial、實體燒錄或 Arduino 編譯器。
- 播放按鈕播放預設教學動畫，不會執行右側程式，也不提供真實感測數值。
- 模型是典型結構示意；不是到貨開發板精準針序、真實照片、實物掃描或可製造 CAD。
- GNSS、心率、體溫、應激、揮棒速度、跌倒判斷與電池續航均未在本工作中驗證。
- Arduino 範例未對實體板編譯、燒錄或量測。DS18B20 範例需要 OneWire / DallasTemperature；BLE 範例依 Arduino-ESP32 板卡套件。
- 消防與長照內容是低壓概念驗證規劃，不是經驗證的安全關鍵設備。

## 後續迭代

1. 依到貨板正反面照片、型號與實際尺寸校正模型、絲印與腳位。
2. 逐項增加實測紀錄與硬體驗收，與學習進度分開。
3. 對接既有研發中心 API，再加入真實 AI 研發助理。
4. 視實際需求改為精準 GLB 模型、電路網表與可驗證的接線互動。

## 參考資料

- [Espressif ESP32-S3](https://www.espressif.com/en/products/socs/esp32-s3)
- [Espressif Bluetooth 架構與晶片支援表](https://github.com/espressif/esp-idf/blob/master/docs/en/api-guides/bt-architecture/overview.rst)

原參考網站與本模組的視覺精細度、完整課程數、模型素材與功能並非逐項完全相同；本版先建立相近工作台架構及產品專屬教學內容。
