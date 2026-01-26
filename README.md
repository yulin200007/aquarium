風之城水族館 (Wind Aquarium) 互動網頁專案
這是一個具備互動動態效果與完整購票流程的水族館官方網站專案。本專案展示了從靜態頁面開發到現代前端框架（Vue.js）的學習實踐過程。
<hr>

專案網址
HTML 版本: https://yulin200007.github.io/aquarium/

Vue (Nuxt) 參考版本: jade-kringle-8290b7.netlify.app/

<hr>

核心功能
動態購票系統:

即時日曆: 自動渲染月份日期，支援點擊選擇日期。

票價計算: 根據不同票種（大人、學生、兒童、長者）即時累加總額。

跨頁面同步: 使用 sessionStorage 技術，確保購票資訊從日期選擇頁、資料填寫頁到支付完成頁都能準確傳遞。

<hr>

視覺與互動:

動態氣泡效果: 使用原生 JS 與 CSS Animation 定時生成隨機上升的氣泡。

響應式導覽列: 固定式 Header 以及隨捲動高度顯示/隱藏的底部導覽。

漢堡選單: 專為行動裝置設計的互動選單，並具備頁面滾動鎖定功能。

生物圖鑑互動: 滑鼠懸停（Hover）在圓形圖片上時，會動態顯示生物名稱。

<hr>

技術棧
語言: HTML5, SCSS (CSS3), JavaScript (ES6+), Vue.js (Nuxt.js)。

樣式管理: 使用 SCSS 進行模組化開發，包含變數管理、Mixin 封裝以及 @each 迴圈自動生成樣式。

套件運用: jQuery (用於滾動監聽), Slick (用於輪播效果), FontAwesome (圖標)。

設計工具: Figma, Adobe Photoshop, Adobe Illustrator。

<hr>

資料夾結構
js/: 包含全站互動 main.js 與購票邏輯 ticket.js。

scss/: 存放模組化的 SCSS 檔案（如 _common.scss, _variables.scss）。

img/: 存放專案使用的圖片與 SVG 素材。

index.vue: 專案轉向 Vue 框架的初步實踐成果。

<hr>


本專案挑戰了複雜的邏輯處理，特別是在處理 GitHub Pages 環境下的路徑引用與 JavaScript 防錯機制（Error Handling）。透過此專案，我成功實踐了從「操作 DOM 元素」到「數據驅動 UI」的開發思維轉變。

製作人: yulin 開發時長: 3 個月# aquarium
aquarium
