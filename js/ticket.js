let currentViewDate = new Date(2025, 11, 1); // 預設從 2025 年 12 月開始

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    
    // 標題
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('calendar-title').textContent = `${monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay(); // 該月第一天是星期幾
    const lastDay = new Date(year, month + 1, 0).getDate(); // 該月最後一天是幾號

    const calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = ""; // 清空舊內容

    let dateCounter = 1;
    for (let i = 0; i < 6; i++) { // 最多 6 週
        let row = document.createElement("tr");
        row.classList.add("day");

        for (let j = 0; j < 7; j++) {//一周7天
            let cell = document.createElement("td");
            
            if (i === 0 && j < firstDayIndex) { 
                //i===0代表第一週,j的日期格子小於星期數(firstDayIndex)的話，保持空白
                cell.textContent = "";
            } else if (dateCounter > lastDay) {
                // 底下有寫dateCounter++，日期會持續計算直到最後一天。超過最後一天的會斷開運算，出現空白格子
                break;
            } else {
                // 底下有寫dateCounter++，生成的td會持續計算直到最後一天。
                cell.textContent = dateCounter;
                // 在td裡加上.background的class
                cell.classList.add("background");
                
                // 綁定點擊事件
                cell.addEventListener('click', function() {
                    document.querySelectorAll('.background').forEach(d => d.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 同步到右側面板
                    const selectedDateStr = `${year}/${String(month + 1).padStart(2, '0')}/${String(this.textContent).padStart(2, '0')}`;
                    document.getElementById('selected-date').textContent = selectedDateStr;
                });
                
                dateCounter++;
            }
            row.appendChild(cell);//在tr裡生成td(日)
        }
        calendarBody.appendChild(row);//在calendar-body裡生成tr的row(週)
        if (dateCounter > lastDay) break;//如果數超過每月最後一天就斷開
    }
}

// 切換月份監聽
document.getElementById('prevMonth').addEventListener('click', () => {
    currentViewDate.setMonth(currentViewDate.getMonth() - 1);
    renderCalendar(currentViewDate);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentViewDate.setMonth(currentViewDate.getMonth() + 1);
    renderCalendar(currentViewDate);
});

// 初始化
renderCalendar(currentViewDate);






//單價
const TICKET_DATA = {
    adult:{ name: "大人", price: 2000 },
    kids: { name: "小・中学生", price: 1000 },
    littleKids: { name: "未就学児", price: 600 },
    old: { name: "シニア", price: 1500 }
};

//初始化狀態
let ticketCounts = {
    adult: 0,
    kids: 0,
    littleKids: 0,
    old: 0
};


function updateSummary() {
    const summaryList = document.getElementById('ticket-summary-list');
    const totalPriceDisplay = document.getElementById('total');
    
    let totalAmount = 0;
    let htmlContent = "";

    // 遍歷所有票種
    for (const key in ticketCounts) {
        const count = ticketCounts[key];
        const price = TICKET_DATA[key].price;
        const name = TICKET_DATA[key].name;

        if (count > 0) {
            // 計算該票種總額並累加到總計
            totalAmount += count * price;
            // 產生顯示在右側的 HTML (例如：大人 2枚)
            htmlContent += `<li>${name} ${count}枚</li>`;
        }
        
        // 更新左側列表旁邊的數字 (假設 class 為 .adult-count 等)
        const leftDisplay = document.querySelector(`.${key}-count`);
        if (leftDisplay) leftDisplay.textContent = count;
    }

    // 更新右側列表：如果沒票就顯示提示
    summaryList.innerHTML = htmlContent || "<li>-</li>";
    // 更新總金額
    totalPriceDisplay.textContent = totalAmount.toLocaleString();
}


document.getElementById('AdultPlus').addEventListener('click', () => {
    ticketCounts.adult++;
    updateSummary();
});

document.getElementById('AdultMinus').addEventListener('click', () => {
    if (ticketCounts.adult > 0) {
        ticketCounts.adult--;
        updateSummary();
    }
});


document.getElementById('kidsPlus').addEventListener('click', () => {
    ticketCounts.kids++;
    updateSummary();
});

document.getElementById('kidsMinus').addEventListener('click', () => {
    if (ticketCounts.kids > 0) {
        ticketCounts.kids--;
        updateSummary();
    }
});
document.getElementById('littleKidsPlus').addEventListener('click', () => {
    ticketCounts.littleKids++;
    updateSummary();
});

document.getElementById('littleKidsMinus').addEventListener('click', () => {
    if (ticketCounts.littleKids > 0) {
        ticketCounts.littleKids--;
        updateSummary();
    }
});
document.getElementById('oldPlus').addEventListener('click', () => {
    ticketCounts.old++;
    updateSummary();
});

document.getElementById('oldMinus').addEventListener('click', () => {
    if (ticketCounts.old > 0) {
        ticketCounts.old--;
        updateSummary();
    }
});



