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

// --- 4. 儲存資料 (GitHub 同步關鍵) ---
const nextButtons = document.querySelectorAll('.nextBtn a');
nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const bookingData = {
            date: document.getElementById('selected-date').textContent,
            counts: ticketCounts,
            total: document.getElementById('total').textContent,
            summaryHtml: document.getElementById('ticket-summary-list').innerHTML
        };
        sessionStorage.setItem('aquariumBooking', JSON.stringify(bookingData));
    });
});

// --- 5. 跨頁面同步載入 ---
// --- 5. 跨頁面同步載入 (修正變數重置問題) ---
window.addEventListener('load', () => {
    if (document.getElementById('calendar-body')) {
        renderCalendar(currentViewDate);
    }
    
    const savedData = sessionStorage.getItem('aquariumBooking');
    if (!savedData) return;

    const data = JSON.parse(savedData);

    // 【核心修正：同步全域變數】
    // 這樣在第 2 頁按按鈕時，存入的才不會是初始值 0
    if (data.counts) {
        ticketCounts = data.counts;
    }

    const isStep2 = document.querySelector('.step2');
    const isStep3 = document.querySelector('.ticket-completion-page');

    // 填入基礎 ID 欄位
    const updateText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    updateText('selected-date', data.date);
    updateText('total', data.total);
    
    const listBox = document.getElementById('ticket-summary-list');
    if (listBox) listBox.innerHTML = data.summaryHtml;

    // 同步明細列表
    if (isStep2 || isStep3) {
        const categories = document.querySelectorAll('.NumberOfTicket__category li');

        categories.forEach(li => {
            const h3 = li.querySelector('h3');
            if (!h3) return;

            const title = h3.textContent.trim();
            let key = null;

            if (title.includes("大人")) key = 'adult';
            else if (title.includes("小学")) key = 'kids';
            else if (title.includes("未就学児")) key = 'littleKids';
            else if (title.includes("シニア")) key = 'old';

            if (key) {
                const count = ticketCounts[key]; // 使用已更新的變數
                const price = TICKET_DATA[key].price;

                if (count > 0) {
                    li.style.display = "flex";
                    
                    // 相容第 2 頁 (.ticketcount) 與第 3 頁 (.NumberOfTicket__category--num p)
                    const countEl = li.querySelector('.ticketcount') || li.querySelector('.NumberOfTicket__category--num p:first-child');
                    if (countEl) countEl.textContent = count;

                    const payCountEl = li.querySelector('.NumberOfTicket__category--payCount');
                    if (payCountEl) {
                        payCountEl.textContent = `${(count * price).toLocaleString()}円`;
                    }
                } else {
                    li.style.display = "none";
                }
            }
        });

        // 同步日期標題與總金額
        const ticketTime = document.querySelector('.NumberOfTicket__time') || document.querySelector('.NumberOfTicket__timeInfo--time');
        if (ticketTime) ticketTime.textContent = `${data.date} 入場`;

        const finalTotal = document.querySelector('.total__pay--number');
        if (finalTotal) finalTotal.textContent = data.total;
    }
});