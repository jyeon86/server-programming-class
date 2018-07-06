$(document).ready(function(){
		var sidebarEl = '';
		
		sidebarEl += '<div class="ui sidebar inverted vertical menu right overlay">';
        sidebarEl += '<div class="top">';
        sidebarEl += '<img src="images/top_logo.png" alt="">';
        sidebarEl += '<a href="#" class="icon close"><span>닫기</span></a>';
        sidebarEl += '</div>';
        sidebarEl += '<nav class="navi">';
        sidebarEl += '<ul>';
        sidebarEl += '<li><a href="index.html">청남대 소개</a></li>';
        sidebarEl += '<li><a href="page1.html">청남대 둘러보기</a></li>';
        sidebarEl += '<li><a href="page2.html">청남대 지도보기</a></li>';
        sidebarEl += '<li><a href="page3.html">주변관광정보</a></li>';
        sidebarEl += '<li><a href="page4.html">이용안내</a></li>';
        sidebarEl += '</ul></nav></div>';
   		
   		$("body").append(sidebarEl);
   		
        $(".header .menu").on("click", function(){
            $('.ui.sidebar').sidebar('toggle');
        })
        $(".ui.sidebar .close").on("click",function(){
            $('.ui.sidebar').sidebar('toggle');
        })

        // 뒤로가기
        $(".header .back").on("click",function(){
        	window.history.back();
        })
 
});