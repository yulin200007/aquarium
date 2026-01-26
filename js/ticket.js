// --- 基礎設定 ---
let currentViewDate = new Date(2025, 11, 1);
const TICKET_DATA = {
    adult: { name: "大人", price: 2000 },
    kids: { name: "小・中学生", price: 1000 },
    littleKids: { name: "未就学児", price: 600 },
    old: { name: "シニア", price: 1500 }
};
let ticketCounts = { adult: 0, kids: 0, littleKids: 0, old: 0 };

// --- 1. 日曆渲染 (包含安全檢查) ---
function renderCalendar(date) {
    const calendarBody = document.getElementById('calendar-body');
    if (!calendarBody) return; // 如果找不到日曆容器就結束，避免報錯

    const year = date.getFullYear();
    const month = date.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('calendar-title').textContent = `${monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    calendarBody.innerHTML = "";

    let dateCounter = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        row.classList.add("day");
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");
            if (i === 0 && j < firstDayIndex) {
                cell.textContent = "";
            } else if (dateCounter > lastDay) {
                break;
            } else {
                cell.textContent = dateCounter;
                cell.classList.add("background");
                cell.addEventListener('click', function() {
                    document.querySelectorAll('.background').forEach(d => d.classList.remove('active'));
                    this.classList.add('active');
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
const safeAddListener = (id, event, callback) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, callback); // 確保元素存在才監聽
};

safeAddListener('prevMonth', 'click', () => { currentViewDate.setMonth(currentViewDate.getMonth() - 1); renderCalendar(currentViewDate); });
safeAddListener('nextMonth', 'click', () => { currentViewDate.setMonth(currentViewDate.getMonth() + 1); renderCalendar(currentViewDate); });

safeAddListener('AdultPlus', 'click', () => { ticketCounts.adult++; updateSummary(); });
safeAddListener('AdultMinus', 'click', () => { if (ticketCounts.adult > 0) { ticketCounts.adult--; updateSummary(); } });
safeAddListener('kidsPlus', 'click', () => { ticketCounts.kids++; updateSummary(); });
safeAddListener('kidsMinus', 'click', () => { if (ticketCounts.kids > 0) { ticketCounts.kids--; updateSummary(); } });
safeAddListener('littleKidsPlus', 'click', () => { ticketCounts.littleKids++; updateSummary(); });
safeAddListener('littleKidsMinus', () => { if (ticketCounts.littleKids > 0) { ticketCounts.littleKids--; updateSummary(); } });
safeAddListener('oldPlus', 'click', () => { ticketCounts.old++; updateSummary(); });
safeAddListener('oldMinus', 'click', () => { if (ticketCounts.old > 0) { ticketCounts.old--; updateSummary(); } });

// --- 3. 更新摘要 ---
function updateSummary() {
    const summaryList = document.getElementById('ticket-summary-list');
    const totalPriceDisplay = document.getElementById('total');
    if (!summaryList || !totalPriceDisplay) return;

    let totalAmount = 0;
    let htmlContent = "";

    for (const key in ticketCounts) {
        const count = ticketCounts[key];
        const { price, name } = TICKET_DATA[key];
        if (count > 0) {
            totalAmount += count * price;
            htmlContent += `<li>${name} ${count}枚</li>`;
        }
        const leftDisplay = document.querySelector(`.${key}-count`);
        if (leftDisplay) leftDisplay.textContent = count;
    }
    summaryList.innerHTML = htmlContent || "<li>-</li>";
    totalPriceDisplay.textContent = totalAmount.toLocaleString();

    
}

// --- 4. 儲存資料 (點擊下一步時執行) ---
// 選取所有類別為 .nextBtn 裡面的超連結按鈕 (通常是「下一步」按鈕)
const nextButtons = document.querySelectorAll('.nextBtn a');

nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // 建立一個打包好的物件，準備把第一頁選好的資訊存起來
        const bookingData = {
            date: document.getElementById('selected-date').textContent, // 取得選中的日期字串
            counts: ticketCounts, // 儲存目前的票數計數器物件 (包含 adult, kids 等)
            total: document.getElementById('total').textContent, // 儲存計算後的總金額字串
            summaryHtml: document.getElementById('ticket-summary-list').innerHTML // 儲存右側明細面板的 HTML 內容
        };
        // 使用 sessionStorage 把資料轉成 JSON 字串存入瀏覽器暫存 (關閉分頁就會清空)
        sessionStorage.setItem('aquariumBooking', JSON.stringify(bookingData));
    });
});

// --- 5. 跨頁面同步載入與顯示邏輯 (進入新頁面時執行) ---
window.addEventListener('load', () => {
    // A. 檢查頁面上有無日曆容器，有的話就執行日曆初始化 (僅限第一頁)
    if (document.getElementById('calendar-body')) {
        renderCalendar(currentViewDate);
    }
    
    // B. 從瀏覽器暫存中嘗試取出剛才存好的購票資訊
    const savedData = sessionStorage.getItem('aquariumBooking');
    if (!savedData) return; // 如果沒資料 (例如直接輸入網址進來) 就停止執行後面的讀取邏輯

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

    // D. 同步中間的詳細明細列表 (第 2, 3 頁專用)
    if (isStep2 || isStep3) {
        // 選取畫面上所有的票種清單項目 (li)
        const categories = document.querySelectorAll('.NumberOfTicket__category li');

        categories.forEach(li => {
            const h3 = li.querySelector('h3'); // 抓取該行的標題 (如：大人、小學等)
            if (!h3) return;

            const title = h3.textContent.trim();
            let key = null;

            // 根據標題文字內容來決定目前這一行是對應哪一個票種 Key
            if (title.includes("大人")) key = 'adult';
            else if (title.includes("小学")) key = 'kids';
            else if (title.includes("未就学児")) key = 'littleKids';
            else if (title.includes("シニア")) key = 'old';

            if (key) {
                const count = ticketCounts[key]; // 取得對應的票數數量
                const price = TICKET_DATA[key].price; // 取得該票種的單價

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
                    // 如果這票種沒有購買，就將整行項目隱藏
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
