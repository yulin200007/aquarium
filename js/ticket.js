// --- 基礎設定 ---
// 設定日曆初始顯示日期 (2025年12月1日) [cite: 310]
let currentViewDate = new Date(2025, 11, 1);
/**
 * 風之城水族館 - 購票系統核心邏輯 (ticket.js)
 * 包含：動態日曆渲染、票價即時計算、localStorage 跨頁傳遞數據
 */
// 定義各票種的顯示名稱與單價
const TICKET_DATA = {
    adult: { name: "大人", price: 2000 },
    kids: { name: "小・中学生", price: 1000 },
    littleKids: { name: "未就学児", price: 600 },
    old: { name: "シニア", price: 1500 }
};

// 用來紀錄使用者選取的各票種數量
let ticketCounts = { adult: 0, kids: 0, littleKids: 0, old: 0 };

// --- 1. 日曆渲染功能 (核心邏輯) ---
function renderCalendar(date) {
    const calendarBody = document.getElementById('calendar-body');
    
    // 安全檢查：若目前頁面沒有日曆容器（如第2、3頁），則跳出不執行，避免發生 null 錯誤
    if (!calendarBody) return; 

    const year = date.getFullYear();
    const month = date.getMonth(); // 注意：JavaScript 月份是從 0 開始 (0=1月)
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // 更新日曆標題文字
    document.getElementById('calendar-title').textContent = `${monthNames[month]} ${year}`;

    // 原理：取得該月 1 號是星期幾，用來決定日曆開頭要留幾個空白格子
    const firstDayIndex = new Date(year, month, 1).getDay(); 
    
    // 原理：利用日數為 0 會回退一天的特性，取得該月的最後一天日期
    const lastDay = new Date(year, month + 1, 0).getDate(); 
    
    calendarBody.innerHTML = ""; // 每次切換月份前先清空舊的表格內容

    let dateCounter = 1;
    // 建立日曆表格 (最多 6 週)
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        row.classList.add("day");
        
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");
            
            if (i === 0 && j < firstDayIndex) {
                // 第一週 1 號之前的空白格
                cell.textContent = "";
            } else if (dateCounter > lastDay) {
                // 超過該月最後一天後停止產生成成員
                break;
            } else {
                // 填充日期數字
                cell.textContent = dateCounter;
                cell.classList.add("background"); // 加入 CSS 樣式類別
                
                // 綁定點擊事件：選擇日期
                cell.addEventListener('click', function() {
                    // 移除其他格子的選取狀態 (active class)
                    document.querySelectorAll('.background').forEach(d => d.classList.remove('active'));
                    // 幫目前點擊的格子加上選取狀態
                    this.classList.add('active');
                    
                    // 格式化日期字串 (補零：例如 2025/12/01)
                    const selectedDateStr = `${year}/${String(month + 1).padStart(2, '0')}/${String(this.textContent).padStart(2, '0')}`;
                    // 更新右側面板的日期顯示
                    document.getElementById('selected-date').textContent = selectedDateStr;
                });
                dateCounter++;
            }
            row.appendChild(cell); // 使用 appendChild 將格子放入列中
        }
        calendarBody.appendChild(row); // 將整列放入表格主體
        if (dateCounter > lastDay) break;
    }
}

// --- 2. 安全綁定事件監聽器 (解決跨頁面報錯問題) ---
// 原理：GitHub Pages 上多個頁面共用 JS，若元素不存在卻綁定監聽會導致後續程式碼崩潰
const safeAddListener = (id, event, callback) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, callback); 
};

// 月份切換按鈕
safeAddListener('prevMonth', 'click', () => { currentViewDate.setMonth(currentViewDate.getMonth() - 1); renderCalendar(currentViewDate); });
safeAddListener('nextMonth', 'click', () => { currentViewDate.setMonth(currentViewDate.getMonth() + 1); renderCalendar(currentViewDate); });

// 票數加減按鈕監聽
safeAddListener('AdultPlus', 'click', () => { ticketCounts.adult++; updateSummary(); });
safeAddListener('AdultMinus', 'click', () => { if (ticketCounts.adult > 0) { ticketCounts.adult--; updateSummary(); } });
safeAddListener('kidsPlus', 'click', () => { ticketCounts.kids++; updateSummary(); });
safeAddListener('kidsMinus', 'click', () => { if (ticketCounts.kids > 0) { ticketCounts.kids--; updateSummary(); } });
safeAddListener('littleKidsPlus', 'click', () => { ticketCounts.littleKids++; updateSummary(); });
safeAddListener('littleKidsMinus', () => { if (ticketCounts.littleKids > 0) { ticketCounts.littleKids--; updateSummary(); } });
safeAddListener('oldPlus', 'click', () => { ticketCounts.old++; updateSummary(); });
safeAddListener('oldMinus', 'click', () => { if (ticketCounts.old > 0) { ticketCounts.old--; updateSummary(); } });

// --- 3. 更新購票摘要與總金額 ---
function updateSummary() {
    const summaryList = document.getElementById('ticket-summary-list');
    const totalPriceDisplay = document.getElementById('total');
    if (!summaryList || !totalPriceDisplay) return;

    let totalAmount = 0;
    let htmlContent = "";

    // 遍歷目前的票數狀態並計算
    for (const key in ticketCounts) {
        const count = ticketCounts[key];
        const { price, name } = TICKET_DATA[key];
        if (count > 0) {
            totalAmount += count * price;
            htmlContent += `<li>${name} ${count}枚</li>`;
        }
        // 更新左側各票種旁邊顯示的數字
        const leftDisplay = document.querySelector(`.${key}-count`);
        if (leftDisplay) leftDisplay.textContent = count;
    }
    // 更新側邊面板的列表與格式化後的總金額 (toLocaleString 加上千分位)
    summaryList.innerHTML = htmlContent || "<li>-</li>";
    totalPriceDisplay.textContent = totalAmount.toLocaleString();
}

// --- 4. 儲存數據至 LocalStorage (跨頁面同步關鍵) ---
// 當使用者點擊「下一步」按鈕時，將購票資訊存入瀏覽器的「保險箱」
const nextButtons = document.querySelectorAll('.nextBtn a');
nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const bookingData = {
            date: document.getElementById('selected-date').textContent,
            counts: ticketCounts,
            total: document.getElementById('total').textContent,
            // 儲存已生成的 HTML 摘要，方便下一頁直接讀取顯示
            summaryHtml: document.getElementById('ticket-summary-list').innerHTML
        };
        [cite_start]// JSON.stringify 將物件轉為字串存入 localStorage [cite: 316]
        localStorage.setItem('aquariumBooking', JSON.stringify(bookingData));
    });
});

// --- 5. 跨頁面讀取與初始化 ---
window.addEventListener('load', () => {
    // 1. 偵測目前是哪一頁
    const calendarEl = document.getElementById('calendar-body'); // 第一頁特有
    const memberInfoEl = document.querySelector('.MemberInfo');  // 第二頁特有
    const completionEl = document.querySelector('.ticket-completion-page'); // 第三頁特有

    // 2. 處理第一頁的「重新整理/新開啟」重置邏輯
    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

    if (calendarEl) {
        renderCalendar(currentViewDate); // 初始化日曆 [cite: 310]
        if (isReload) {
            localStorage.removeItem('aquariumBooking');
            console.log("第一頁重整：已清空舊資料");
            return; // 結束執行，不讀取舊資料
        }
    }

    // 3. 執行資料讀取與填入 (僅在第二頁或第三頁執行)
    if (memberInfoEl || completionEl) {
        const savedData = localStorage.getItem('aquariumBooking');
        if (!savedData) {
            console.warn("找不到購票資料");
            return;
        }

        const data = JSON.parse(savedData);
        console.log("成功讀取資料：", data);

        // 更新日期與金額 
        const dateBox = document.getElementById('selected-date');
        if (dateBox) dateBox.textContent = data.date;

        const totalBox = document.getElementById('total');
        if (totalBox) totalBox.textContent = data.total;

        const listBox = document.getElementById('ticket-summary-list');
        if (listBox) listBox.innerHTML = data.summaryHtml;

        // 同步第二頁左側藍色條的日期
        const leftDateStrip = document.querySelector('.NumberOfTicket__time');
        if (leftDateStrip) leftDateStrip.textContent = `${data.date} 入場`;

        // 如果是第三頁，額外更新特有欄位
        if (completionEl) {
            const timeInfo = document.querySelector('.NumberOfTicket__timeInfo--time');
            if (timeInfo) timeInfo.textContent = `${data.date} 入場`;
            const finalTotal = document.querySelector('.total__pay--number');
            if (finalTotal) finalTotal.textContent = data.total;
        }
    }
});