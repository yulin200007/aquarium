// --- 基礎設定 ---
// 設定日曆初始顯示的日期 (2025年12月1日)
let currentViewDate = new Date(2025, 11, 1);

// 定義各票種的顯示名稱與單價資訊
const TICKET_DATA = {
    adult: { name: "大人", price: 2000 },
    kids: { name: "小・中学生", price: 1000 },
    littleKids: { name: "未就学児", price: 600 },
    old: { name: "シニア", price: 1500 }
};

// 建立一個物件來記錄使用者點擊加減後的票數
let ticketCounts = { adult: 0, kids: 0, littleKids: 0, old: 0 };

// --- 1. 日曆渲染 (包含安全檢查) ---
// 根據傳入的日期物件，動態產生 HTML 日曆表格
function renderCalendar(date) {
    const calendarBody = document.getElementById('calendar-body');
    // 安全檢查：如果目前頁面沒有日曆容器 (例如在第二頁) 就不執行，避免程式出錯
    if (!calendarBody) return; 

    const year = date.getFullYear();
    const month = date.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // 更新日曆上方的月份標題
    document.getElementById('calendar-title').textContent = `${monthNames[month]} ${year}`;

    // 計算該月第一天是星期幾，以及該月總共有幾天
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    calendarBody.innerHTML = "";// 渲染前先清空舊的日曆內容

    let dateCounter = 1;
    // 建立日曆的列 (最多 6 週)
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        row.classList.add("day");

        // 建立一週的七天
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");
            if (i === 0 && j < firstDayIndex) {
                // 第一週 1 號之前的空格不填數字
                cell.textContent = "";
            } else if (dateCounter > lastDay) {
                // 超過當月最後一天就停止產生成員
                break;
            } else {
                // 填入日期數字並加上點擊事件
                cell.textContent = dateCounter;
                cell.classList.add("background");
                cell.addEventListener('click', function() {
                    // 點擊日期後，先移除其他格子的選取狀態，再幫目前的格子加上 active
                    document.querySelectorAll('.background').forEach(d => d.classList.remove('active'));
                    this.classList.add('active');

                    // 格式化選中的日期 (例如：2025/12/01) 並顯示在右側面板
                    const selectedDateStr = `${year}/${String(month + 1).padStart(2, '0')}/${String(this.textContent).padStart(2, '0')}`;
                    document.getElementById('selected-date').textContent = selectedDateStr;
                });
                dateCounter++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
        if (dateCounter > lastDay) break;
    }
}

// --- 2. 安全綁定事件監聽器 ---
// 輔助函式：確保 HTML 元素存在才綁定點擊事件，避免跨頁面執行時報錯
const safeAddListener = (id, event, callback) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, callback); // 確保元素存在才監聽
};

// 綁定月份切換按鈕
safeAddListener('prevMonth', 'click', () => { currentViewDate.setMonth(currentViewDate.getMonth() - 1); renderCalendar(currentViewDate); });
safeAddListener('nextMonth', 'click', () => { currentViewDate.setMonth(currentViewDate.getMonth() + 1); renderCalendar(currentViewDate); });

// 綁定各票種的加減按鈕，點擊後會更新數字並觸發摘要更新
safeAddListener('AdultPlus', 'click', () => { ticketCounts.adult++; updateSummary(); });
safeAddListener('AdultMinus', 'click', () => { if (ticketCounts.adult > 0) { ticketCounts.adult--; updateSummary(); } });
safeAddListener('kidsPlus', 'click', () => { ticketCounts.kids++; updateSummary(); });
safeAddListener('kidsMinus', 'click', () => { if (ticketCounts.kids > 0) { ticketCounts.kids--; updateSummary(); } });
safeAddListener('littleKidsPlus', 'click', () => { ticketCounts.littleKids++; updateSummary(); });
safeAddListener('littleKidsMinus', () => { if (ticketCounts.littleKids > 0) { ticketCounts.littleKids--; updateSummary(); } });
safeAddListener('oldPlus', 'click', () => { ticketCounts.old++; updateSummary(); });
safeAddListener('oldMinus', 'click', () => { if (ticketCounts.old > 0) { ticketCounts.old--; updateSummary(); } });

// --- 3. 更新摘要 ---
// 計算總票數與總金額，並即時更新畫面上顯示的內容
function updateSummary() {
    const summaryList = document.getElementById('ticket-summary-list');
    const totalPriceDisplay = document.getElementById('total');
    // 如果目前頁面沒有摘要欄位 (例如在其他頁面) 則不執行
    if (!summaryList || !totalPriceDisplay) return;

    let totalAmount = 0;
    let htmlContent = "";

    // 遍歷所有票種的紀錄
    for (const key in ticketCounts) {
        const count = ticketCounts[key];
        const { price, name } = TICKET_DATA[key];
        if (count > 0) {
            // 計算總金額並產生購票明細的清單項目
            totalAmount += count * price;
            htmlContent += `<li>${name} ${count}枚</li>`;
        }
        // 更新左側按鈕中間顯示的張數數字
        const leftDisplay = document.querySelector(`.${key}-count`);
        if (leftDisplay) leftDisplay.textContent = count;
    }
    // 將產生的明細填入右側面板，若無購票則顯示 "-"
    summaryList.innerHTML = htmlContent || "<li>-</li>";
    // 顯示格式化後的總金額 (例如：2,000)
    totalPriceDisplay.textContent = totalAmount.toLocaleString();

    
}

// --- 4. 儲存資料 (點擊下一步時執行) ---
// 這裡確保點擊跳轉按鈕時，將第一頁的所有選擇狀態打包存入 sessionStorage
const nextButtons = document.querySelectorAll('.nextBtn a');
nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // 建立一個打包好的物件，準備把第一頁選好的資訊存起來
        const bookingData = {
            date: document.getElementById('selected-date').textContent, // 日期字串
            counts: ticketCounts, // 票數物件 {adult: X, kids: Y...}
            total: document.getElementById('total').textContent, // 總金額字串
            summaryHtml: document.getElementById('ticket-summary-list').innerHTML // 右側面板摘要
        };
        // 使用 sessionStorage 把資料轉成 JSON 字串存入瀏覽器暫存 (關閉分頁就會清空)
        sessionStorage.setItem('aquariumBooking', JSON.stringify(bookingData));
    });
});

// --- 5. 跨頁面同步載入與顯示邏輯 ---
window.addEventListener('load', () => {
    // A. 檢查頁面上有無日曆容器，有的話就執行日曆初始化 (僅限第一頁)
    if (document.getElementById('calendar-body')) {
        renderCalendar(currentViewDate);
    }
    
    // B. 從瀏覽器暫存中嘗試取出剛才存好的購票資訊
    const savedData = sessionStorage.getItem('aquariumBooking');
    if (!savedData) return;// 如果沒資料 (例如直接輸入網址進來) 就停止執行後面的讀取邏輯

    // 將存好的 JSON 字串資料轉回 JavaScript 可以操作的物件格式
    const data = JSON.parse(savedData);

    // 【重要：同步變數狀態】
    // 將暫存裡的票數同步回本頁面的 ticketCounts 變數，防止在第二頁按下一步時數據被重置為 0
    if (data.counts) {
        ticketCounts = data.counts;
    }

    // 辨識目前是處於購票的哪一個步驟頁面 (透過特有的 Class 判斷)
    const isStep2 = document.querySelector('.step2'); 
    const isStep3 = document.querySelector('.ticket-completion-page');

    // C. 填入基礎共用資訊：把日期與總金額填入右側面板對應的 ID 位置
    const updateText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    updateText('selected-date', data.date);
    updateText('total', data.total);
    
    // 將第一頁生成的右側明細列表內容直接印到本頁面的對應位置
    const listBox = document.getElementById('ticket-summary-list');
    if (listBox) listBox.innerHTML = data.summaryHtml;

    // D. 同步詳細列表 (第 2, 3 頁專用)
    if (isStep2 || isStep3) {
        // 選取畫面上所有的票種清單項目 (li)
        const categories = document.querySelectorAll('.NumberOfTicket__category li');

        categories.forEach(li => {
            const h3 = li.querySelector('h3');// 抓取該行的標題 (如：大人、小學等)
            if (!h3) return;

            const title = h3.textContent.trim();
            let key = null;

            // 根據 HTML 標題文字匹配對應的票種 key
            if (title.includes("大人")) key = 'adult';
            else if (title.includes("小学")) key = 'kids';
            else if (title.includes("未就学児")) key = 'littleKids';
            else if (title.includes("シニア")) key = 'old';

            if (key) {
                const count = ticketCounts[key];
                const price = TICKET_DATA[key].price;

                if (count > 0) {
                    // 如果這票種有購買，就顯示這一行項目
                    li.style.display = "flex";
                    
                    // 同步填入張數 (相容第二頁 .ticketcount 與第三頁的 p 標籤結構)
                    const countEl = li.querySelector('.ticketcount') || li.querySelector('.NumberOfTicket__category--num p:first-child');
                    if (countEl) countEl.textContent = count;

                    // 計算該票種的小計金額 (張數 * 單價) 並加上千分位符號
                    const payCountEl = li.querySelector('.NumberOfTicket__category--payCount');
                    if (payCountEl) {
                        payCountEl.textContent = `${(count * price).toLocaleString()}円`;
                    }
                } else {
                    // 若未購買此票種，則隱藏該行
                    li.style.display = "none";
                }
            }
        });

        // E. 同步顯示「入場日期」的文字條 (處理不同頁面的 Class 名稱)
        const ticketTime = document.querySelector('.NumberOfTicket__time') || document.querySelector('.NumberOfTicket__timeInfo--time');
        if (ticketTime) ticketTime.textContent = `${data.date} 入場`;

        // 同步第三頁完成畫面中，最終的大合計金額位置
        const finalTotal = document.querySelector('.total__pay--number');
        if (finalTotal) finalTotal.textContent = data.total;
    }
});
