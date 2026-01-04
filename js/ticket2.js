const navbtn = document.querySelector('.topnav__navhanbergar');
const navlist = document.querySelector('.topnav__navlist');
const body = document.querySelector('body');

navbtn.addEventListener('click', function() {
    navlist.classList.toggle('active'); 
    body.classList.toggle('no-scroll');
    navbtn.classList.toggle('is-active');
});

const title1 = document.querySelector('.title1');
const title2 = document.querySelector('.title2');
const title3 = document.querySelector('.title3');
const set1 = document.querySelector('.set1');
const set2 = document.querySelector('.set2');
const set3 = document.querySelector('.set3');

title1.addEventListener('click', function() {
    set1.classList.toggle('active'); 
});

title2.addEventListener('click', function() {
    set2.classList.toggle('active'); 
});

title3.addEventListener('click', function() {
    set3.classList.toggle('active'); 
});

// 【修正區域開始】
// 1. 使用 querySelectorAll 取得所有語言標題按鈕
const languageBtns = document.querySelectorAll('.language--title');
// 注意：我們不需要單獨選取 .select，因為我們只需要切換父元素的 .is-active class
// 2. 遍歷所有按鈕，為每個按鈕添加事件監聽器
languageBtns.forEach(button => {
    button.addEventListener('click', function() {
        // 點擊 title 時，切換它的【父元素】(.languageset) 上的 is-active class
        // 使用 .closest() 找到最近的父級 .languageset 容器
        const languageContainer = button.closest('.languageset');
        // 切換父容器的 is-active class
        languageContainer.classList.toggle('is-active');
        // 額外處理：讓選單在點擊後失去焦點，強制收起 (可選)
        const languageSelect = languageContainer.querySelector('.select');
        if (languageContainer.classList.contains('is-active')) {
             languageSelect.focus();
        } else {
             languageSelect.blur();
        }
    });
});


// 為了讓選單收起，我們還需要給 select 加上 blur 事件
document.querySelectorAll('.languageset .select').forEach(select => {
    select.addEventListener('blur', function() {
        // 當 select 失去焦點時，移除父容器的 is-active class
        this.closest('.languageset').classList.remove('is-active');
    });
});
// 【修正區域結束】

// 修正選取器，確保抓到「次へ」按鈕
const nextButton = document.querySelectorAll('.nextBtn a'); 

nextButton.forEach(btn => {

    //e =eventの略
    btn.addEventListener('click', (e) => {
        // 取得當前的購票資訊
        const bookingData = {
            date: document.getElementById('selected-date').textContent,
            counts: ticketCounts,
            total: document.getElementById('total').textContent,
            summaryHtml: document.getElementById('ticket-summary-list').innerHTML
        };
        //存取目前網域的本機 [Storage](https://developer.mozilla.org/zh-TW/docs/Web/API/Storage) 物件，並使用 [Storage.setItem()](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem) 向其新增一個資料項目。
        localStorage.setItem('aquariumBooking', JSON.stringify(bookingData));
        // console.log("資料已儲存", bookingData); // 除錯用
    });
});

window.addEventListener('load', () => {
    // 檢查 localStorage 裡是否有資料且畫面上是否有對應的 ID
    const savedData = localStorage.getItem('aquariumBooking');
    const isStep2 = document.querySelector('.MemberInfo'); // 第二頁特有的類別

    if (savedData && isStep2) {
        const data = JSON.parse(savedData);
        
        // 確保 ID 存在才填入內容
        const dateBox = document.getElementById('selected-date');
        if (dateBox) dateBox.textContent = data.date;

        const listBox = document.getElementById('ticket-summary-list');
        if (listBox) listBox.innerHTML = data.summaryHtml;

        const totalBox = document.getElementById('total');
        if (totalBox) totalBox.textContent = data.total;
        
        // console.log("資料已同步至第二頁"); // 除錯用
    }
});