/**
 * Created by jin on 2018/7/7.
 */
loginGetCoin();
/******************左侧系统通知   start ***************/
$(document).ready(function () {
    $.ajax({
        url: '/home/Header/systemMenu',
        type: 'get',
        dataType: 'json',
        success: function (con) {
            if (con) {
                con = $.parseJSON(con);
                var str = '';
                $.each(con.msg, function (key, val) {
                    if(val.url.length>5){
                        var url='<span><a href="'+val.url+'" target="_blank">' + val.title + '</a></span>';
                    }else{
                        var url='<span><a href="/help/'+val.id+'.html" target="_blank">' + val.title + '</a></span>';
                    }
                    str += ' <li>\n' +
                        '                        <p>\n' +
                        '                            <i class="fa fa-volume-up" aria-hidden="true"></i>\n' + url+'\n' +
                        '                        </p>\n' +
                        '                    </li>';
                });
                $(".header_News").find("ul").html(str);
            }
        }
    });
    $(document).on("mouseover", ".header_News > ul > li", function () {
        header_is_gun = false;
    });
    $(document).on("mouseout", ".header_News > ul > li", function () {
        header_is_gun = true;
    });
    var header_is_gun = true;
    setInterval(function () {
        var top = $(".header_News > ul").css("top");
        top = parseInt(top);
        var max = $(".header_News > ul > li").length;
        if (top - 40 <= -(max * 40)) {
            top = 0;
            $(".header_News > ul").animate({top: top}, 1);
        } else {
            if (header_is_gun) {
                $(".header_News > ul").animate({top: top - 40}, 1000)
            }
        }
    }, 4000);
});
/**********左侧系统通知   end ***************/



$(document).on('click', "#logout-xmyeditor", function () {
    edi_islogin = 1;
    localStorage.removeItem('userinfo');
    localStorage.removeItem('posterStatus');
});

//显示登录
var edi_islogin = 0;
$(document).on('click', ".header_login a", function () {
    if (localStorage.getItem('memberVip')) {
        localStorage.removeItem('memberVip');
    }
    edi_islogin = 1;
});
//显示注册
$(document).on('click', ".header_register a", function () {
    if (localStorage.getItem('memberVip')) {
        localStorage.removeItem('memberVip');
    }
    edi_islogin = 1;
});

function messageList() {
    var user = getUser();
    if (user == false) {
        return;
    }
    var len = user['message_count'];
    if (len > 0) {
        if (len > 9) {
            $(".red-dian").html('...');
            $(".red-dian").css('line-height','10px');
        } else {
            $(".red-dian").html(len);
            $(".red-dian").css('line-height','14px');
        }
        $(".header-user-mail").show();
        $(".header-user-self-img").append('<span></span>');
    } else {
        $(".red-dian").html('');
        $(".header-user-mail").hide();
        $(".header-user-self-img").children("span").remove();
    }
    if (/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[com]+$/.test(user['nickname'])) {
        var pl = user['nickname'].indexOf('@');
        $(".head-self-center-one-p2").children("span").html(user['nickname'].substring(0, 4) + '****' + user['nickname'].substring(pl));
    } else if (/^[1][\d]{10}$/.test(user['nickname'])) {
        $(".head-self-center-one-p2").children("span").html(user['nickname'].substring(0, 3) + '****' + user['nickname'].substr(-4));
    } else{
        $(".head-self-center-one-p2").children("span").html(user['nickname']);
        if(parseInt($(".head-self-center-one-p2").children("span").css('width')) > 150){
            $(".head-self-center-one-p2").children("span").css('width','150px');
            if($(".head-self-center-one-p2").children("span").html().indexOf("<img") == -1){
                $(".head-self-center-one-p2").children("span").html(user['nickname'].substring(0,15)+'...');
            }
        }

    }

}
messageList();
$(".user-head-img").each(function () {
    var userinfo = getUser();
    var is_has=new RegExp('http').test(userinfo['avatar']);
    if (!is_has) {
        $(this).prop('src', '/' + userinfo['avatar']);
    } else {
        $(this).prop('src', userinfo['avatar']);
    }
});
$.cookie('browser', isChrome());