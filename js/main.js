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

// 1. 取得所有可點擊的圖片容器
const aquariumcreatures = document.querySelectorAll('.aquariumcreatures__item');

// 遍歷每個圖片容器，為它添加兩個事件監聽器：mouseover 和 mouseout
aquariumcreatures.forEach(item => {
    // 取得當前圖片容器內部的文字區塊
    const itemTxt = item.querySelector('.aquariumcreatures__item--txt');
   
    if (itemTxt) { // 確保文字區塊存在
        // A. 滑鼠進入 (Hover) 時，新增 .is-active
        item.addEventListener('mouseover', function() {
            itemTxt.classList.add('is-active');
        });

        // B. 滑鼠離開 (Un-hover) 時，移除 .is-active
        item.addEventListener('mouseout', function() {
            itemTxt.classList.remove('is-active');
        });
    }
});

// 另外，您需要為主圖 (main-item) 也加上相同的邏輯
const mainItem = document.querySelector('.aquariumcreatures__main-item');
const mainItemTxt = mainItem.parentElement.querySelector('.aquariumcreatures__item--txt');

if (mainItemTxt) {
    mainItem.addEventListener('mouseover', function() {
        mainItemTxt.classList.add('is-active');
    });

    mainItem.addEventListener('mouseout', function() {
        mainItemTxt.classList.remove('is-active');
    });
}


function createBubble() {
      const bubble = document.createElement('div');
      const size = Math.random() * 40 + 10;
      bubble.classList.add('bubble');
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * window.innerWidth}px`;
      bubble.style.animationDuration = `${5 + Math.random() * 10}s`;
      document.body.appendChild(bubble);

      // 一定時間後に削除
      setTimeout(() => bubble.remove(), 15000);
    }

    // 定期的にバブルを生成
    setInterval(createBubble, 500);



//$(' ').offset().top; は jQuery で使われ、指定したHTML要素が ビューポート（表示領域）の左上からどれだけ下に位置しているか（ピクセル単位） を取得するためのコードです。空白のセレクタ $(' ') はおそらく間違いで、$('要素のセレクタ') のように正しい要素を指定することで、その要素の画面上部からの距離が取得できます。

/*コードの解説
$('要素のセレクタ'): jQueryで特定のHTML要素を選択します（例: $('#myElement') や $('.myClass')）。
.offset(): 選択された要素の、ビューポート（ブラウザの表示領域）を基準とした位置（topとleft）を取得します。
.top: offset() で取得した位置情報のうち、上からの距離（topの値）だけを取り出します。 */



   $(function() {
    //在頁面載入完成後，先取得目標元素的位置
    // 使用 .offset().top 取得 .bottomnav 距離網頁最頂端的高度
    var navTop = $('.bottomnav').offset().top;

    function scrollFixTop() {
        // 取得目前視窗已經捲動的垂直距離
        var scroll = $(window).scrollTop();
        var windowWidth = $(window).width(); // 取得當前螢幕寬度

        //如果捲動距離 >= 目標元素的高度且寬度大於768
        if (windowWidth > 768 && scroll >= navTop) {
            $('.bottomnav--hide').addClass('show');
        } else {
            //捲回去時移除 show
            $('.bottomnav--hide').removeClass('show');
        }
    }

    //監聽視窗的捲動事件
    $(window).on('scroll', function() {
        scrollFixTop();
    });
});


$(document).ready(function(){
$('.enjoyslide').slick({
  dots: true,
  infinite: false,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
   
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
});

});


