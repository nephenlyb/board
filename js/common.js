/**
 * 更新用户的本地缓存
 * 如果系统给用户赠送会员，或蚁币，系统无法更新用户本地缓存，执行这个方法，更新用户本地缓存
 * */
$(document).ready(function(){
    if(getUser() === false){
    }else{
        $.post('/member/sj/gengJson',{"userid":getUser().id},function(msg){
            if(msg.code ==1){
                updateUser();
            }
        },'json');
    }
});
//上传
function zzcmsUpload(url, title, name) {
    layer.open({
        type: 2,
        title: title,
        btn: ['确认'],
        area: ['500px', '330px'], //宽高
        content: url,
        yes: function (index, layero) {
            //关闭
            layer.close(index);
        }
    });

}

//获取URL参数
function getUrlPara() {
    var url = document.location.toString();
    var arrUrl = url.split("?");
    var param = arrUrl[1];
    return param;
}


/**
 * 首页广告展示
 */
function posterShow() {
    var posterStatus = localStorage.getItem('posterStatus');
    $.ajax({
        url: '/home/poster/posterList',
        success: function (msg) {
            if (msg.code == 200) {
                if (posterStatus != null && posterStatus == 'index_show') {
                    return;
                } else {
                    $(".div1-guang-gao").children("iframe").prop("src","{:url('home/poster/index')}");
                    $(".div1-guang-gao").show();
                }
            }
        }
    });
}

/**
 * 加入QQ群
 */
function joinQQqun() {
    var url = "https://jq.qq.com/?_wv=1027&k=5uAzoG4";
    layer.open({
        type: 2,
        title: false,
        closeBtn: 0,   //关闭差号
        masksToBounds: true,
        shade: 0,
        move: false,
        area: ['0px', '0px'],
        content: [url, 'no']
    });
}


/**
 * 图片自动排序
 */
function imageLoad() {
    var options ={
        srcNode: '.rightMyUpDetailsLi',         // grid items (class, node)
        margin: '4px',             // margin in pixel, default: 0px
        width: '140px',             // grid item width in pixel, default: 220px
        max_width: '140px;',              // dynamic gird item width if specified, (pixel)
        resizable: true,          // re-layout if window resize
        transition: 'all 0.5s ease' // support transition for CSS3, default: all 0.5s ease
    };
    $('.rightMyUpDetailsul').gridify(options);
}


/**
 * 获取图片尺寸
 */
function conver(limit){
    var size = "";
    if( limit < 0.1 * 1024 ){
        size = limit.toFixed(2) + "B";
    }else if(limit < 0.1 * 1024 * 1024 ){
        size = (limit / 1024).toFixed(2) + "K";
    }else if(limit < 0.1 * 1024 * 1024 * 1024){
        size = (limit / (1024 * 1024)).toFixed(2) + "M";
    }else{
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "G";
    }
    return size;
}





/**
 * 获取用户信息缓存
 *
 */
function getUser() {
    var userinfo = localStorage.getItem('userinfo');
    if (userinfo) {
        return JSON.parse(userinfo);
    }else{
		return false;
	}
}

/**
 * 更新用户信息缓存
 */
function updateUser() {
    $.ajax({
        url: '/home/vip/getUser',
        data: {
            t: Date.parse(new Date())
        },
        async: false,
        type: 'POST',
        success: function (res) {
			if(res.code == 401){
				return false;
			}else if(res.code == 1 ){
                deleteUser();
				localStorage.setItem('userinfo', JSON.stringify(res.data));
				return true;
			}else{
				return false;
			}
        }
    });
}


/**
 * 删除用户信息缓存
 */
function deleteUser() {
    localStorage.removeItem('userinfo');
}

/**
 * 统计点击量
 * @param style_id
 * @param table
 */
function countClick(style_id,table){
    var user = getUser();
    if(table == 'Style') {
        var $data = localStorage.getItem('style_ids'+user.id);
        if($data == null || $data == ''){
            var arr = new Array();
            arr.push(style_id);
            localStorage.setItem('style_ids'+user.id,arr.join(','));
        }else{
            $data = $data.split(',');
            var $index = $.inArray(style_id,$data);
            if( $index > -1) {
                $data.splice($index,1);
            }
            if($data.length == 40) {
                $data.splice(0,1);
            }
            $data.push(style_id);
            localStorage.setItem('style_ids'+user.id,$data.join(','));
        }
    }
    $.ajax({
        url:'/home/index/clickCount',
        data:{style_id:style_id,table:table},
        type:'GET',
        success:function(msg) {
            if(msg.code==200){
                return true;
            }else{
                return false;
            }
        }
    })
}

function saveInvite() {
    edi_islogin = 1;
    if($.cookie('invite_url') != null && $.cookie('invite_url') != '') {
        location.href=$.cookie('invite_url');
    }
    if(getUser()) {
        location.href='/member/user/invitefriends';
    }else{
        $.cookie('invite_url', '/member/user/invitefriends');
        location.href='/member/user/invitefriends';
    }
}

function posterCount(poster_id,space_id){
    $.post("/home/index/posterApi",{"poster_id":poster_id,"space_id":space_id},function (con) {
        console.log(con);
    },"json");
}


/**
 * 接受获取用户登录状态（接收后台基类返回过来的值 ）string版
 */
function getBaseUserStatus(msg) {
    if(msg != '{"code":401}'){
        return;
    }
    msg = $.parseJSON(msg);
    if(msg.code==401){
        edi_islogin = 1;
        deleteUser();
        location.href='/home/common/handLefail';
        return 1;
    }
}
/**
 * 接受获取用户登录状态（接收后台基类返回过来的值 ）json版
 */
function getBaseUserStatusJson(msg) {
    if(msg.code==401){
        edi_islogin = 1;
        deleteUser();
        location.href='/home/common/handLefail';
        return 1;
    }
}

/**
 * 获取cookie
 * @param c_name
 * @returns {number}
 */
function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        var c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1;
            var c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return 1;
}

/**
 * 复制图片
 */
function getImageData(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/jpeg");
}


/**
 * 使用浏览器搜索微信编辑器完成任务统计
 * @type {string}
 */
function useBrowerSearch() {
    var refer = document.referrer;
    var sosuo = refer.split(".")[1];
    if (localStorage.getItem('tesk_info')) {
        setTimeout(function () {
            var arr = JSON.parse(localStorage.getItem('tesk_info'));
            var getuser = getUser();
            var source = arr.source;
            if (source.indexOf(sosuo) > (-1) && getuser.id == arr.user_id) { // 搜索成功
                $.ajax({
                    url: "/member/coin/cointesk",
                    type: 'POST',
                    dataType: 'json',
                    data: arr,
                    success: function (msg) {
                        if (msg.code == 1) {
                            // layer.msg("任务记录成功");
                        }
                    }
                });
            }
        }, 4000);
    }
}

function isChrome(){
    var ua = navigator.userAgent.toLowerCase();
    var is = 'IE浏览器';
    if(isIE()){
        is = 'IE浏览器';
        return is;
    }
    if(ua.indexOf("chrome") > 1){
        is = '谷歌浏览器';
    }
    if(ua.indexOf("safari") > 1 && ua.indexOf("macintosh") > 1){
        is = 'Safari浏览器';
        return is;
    }
    if(ua.indexOf("firefox") > 1){
        is = '火狐浏览器';
        var reg  =  /firefox\/([^ ]*)/;
        var b = reg.exec(ua);
        if(b && b[1]){
            b[1] = b[1].replace(")","");
            return is+b[1];
        }else{
            return is;
        }
    }
    if(ua.indexOf("opr") > 1){
        is = '欧朋浏览器';
        var reg  =  /opr\/([^ ]*)/;
        var b = reg.exec(ua);
        if(b && b[1]){
            b[1] = b[1].replace(";","");
            return is+b[1];
        }else{
            return is;
        }
    }
    if((ua.indexOf("ubrowser") >1 && ua.indexOf("ubrowser") == 95) || (ua.indexOf("ubrowser") >1 && ua.indexOf("ubrowser") == 58)){
        is = 'UC浏览器';
        var reg  =  /ubrowser\/([^ ]*)/;
        var b = reg.exec(ua);
        if(b && b[1]){
            b[1] = b[1].replace(")","");
            return is+b[1];
        }else{
            return is;
        }
    }
    if(ua.indexOf("metasr") > 1){
        is = '搜狗浏览器';
        return is;
    }
    if(ua.indexOf("qqbrowser") > 1){
        is = 'QQ浏览器';
        var reg  =  /qqbrowser\/([^ ]*)/;
        var b = reg.exec(ua);
        if(b && b[1]){
            b[1] = b[1].replace(";","");
            return is+b[1];
        }else{
            return is;
        }
    }
    if(ua.indexOf("maxthon") > 1){
        is = '遨游浏览器';
        var reg  =  /maxthon\/([^ ]*)/;
        var b = reg.exec(ua);
        if(b && b[1]){
            b[1] = b[1].replace(";","");
            return is+b[1];
        }else{
            return is;
        }
    }
    if(ua.indexOf("bidubrowser") > 1){
        is = '百度浏览器';
        if(ua.indexOf("chrome") > 1){
            var reg  =  /bidubrowser\/([^ ]*)/;
            var b = reg.exec(ua);
            if(b && b[1]){
                b[1] = b[1].replace(";","");
                return is+b[1];
            }else{
                return is;
            }
        }else{
            var reg = /bidubrowser ([^)]*)/;
            var b   = reg.exec(ua);
            if(b && b[1]){
                b[1] = b[1].replace(";","");
                return is+b[1];
            }else{
                return is;
            }
        }
    }
    if(ua.indexOf("2345explorer") > 1){
        is = '2345浏览器';
        var reg  =  /2345explorer\/([^ ]*)/;
        var b = reg.exec(ua);
        if(b && b[1]){
            b[1] = b[1].replace(";","");
            return is+b[1];
        }else{
            return is;
        }
    }
    if(ua.indexOf("lbbrowser") > 1){
        is = '猎豹浏览器';
        return is;
    }
    if(ua.indexOf("edge") > 1){
        is = 'Edge浏览器';
        return is;
    }
    var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
    if (ua.indexOf("chrome") > 1 && is360) {
        is = '360浏览器';
        return is;
    }
    return is;
}
function _mime(option, value) {
    var mimeTypes = navigator.mimeTypes;
    for (var mt in mimeTypes) {
        if (mimeTypes[mt][option] == value) {
            return true;
        }
    }
    return false;
}
// 此方法兼容最新的IE11，IE10
function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window){
        return true;
    }else{
        return false;
    }
}











//检测IE版本
function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) {
            return 7;
        } else if(fIEVersion == 8) {
            return 8;
        } else if(fIEVersion == 9) {
            return 9;
        } else if(fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if(isEdge) {
        return 'edge';//edge
    } else if(isIE11) {
        return 11; //IE11
    }else{
        return -1;//不是ie浏览器
    }
}


/**
 * 获取手机浏览器方法
 */
function getMobileBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    document.write(ua);
    var name = '谷歌浏览器';
    if(ua.indexOf("firefox") > 1){
        name = '火狐浏览器';
    }
    if(ua.indexOf("ucbrowser") > 1){
        name = 'UC浏览器';
    }
    if(ua.indexOf("sogou") > 1){
        name = '搜狗浏览器';
    }
    if(ua.indexOf("sogou") > 1){
        name = '搜狗浏览器';
    }
    alert(name);
}





/**
 * 用户到期通知
 */
function requiredTip(now_time) {
    //判断是否登录
    if(!getUser()){
        return;
    }
    var user = getUser();
    //判断是否为会员
    if(parseInt(user.group_id) < 2){
        return;
    }
    //判断过期时间
    var expire_time = user.expire_time;
    var type = '';
    //过期前七天提醒
    if((expire_time-(7*24*60*60)) <= now_time && (expire_time-(2*24*60*60)) > now_time){
        type = 7;
    }//过期前两天提醒
    else if((expire_time-(2*24*60*60)) <= now_time && (expire_time-(24*60*60)) > now_time) {
        type = 2;
    }//过期前一天提醒
    else if((expire_time-(24*60*60)) <= now_time && expire_time > now_time) {
        type = 1;
    }
    if(type == ''){
        return;
    }
    if(type == user.is_reminder){
        return;
    }
    $.ajax({
        url:'/home/common/expiredTip',
        data:{type:type},
        success: function (msg) {
            if(msg.code == 200) {
                updateUser();
                $("#checkIE").html(msg.data);
            }
        }
    });
}





/**
 * 验证当前用户是不是首次进入网站
 * @param obj
 */
function checkUserIsFirst(obj) {
    if(!getUser()){
        return;
    }
    if(localStorage.getItem('is_new_user') && localStorage.getItem('is_new_user') == 2){
        var arr=new Array();
        if(!localStorage.getItem('tips')){
            arr.push($(obj).index());
            localStorage.setItem('tips', arr.toString());
            $(".guide-step-one").hide();
            $(obj).show();
            $(obj).parent().show();
        }else{
            var num = localStorage.getItem('tips').split(',');
            if(num.length >= 6){
                localStorage.removeItem('is_new_user');
                localStorage.removeItem('tips');
                return;
            }
            var flag=0;
            for(var i=0;i<num.length;i++){
                if(num[i] == $(obj).index()){
                    flag++;
                }
            }
            if(flag < 1){
                num.push($(obj).index());
                localStorage.setItem('tips', num.toString());
                $(".guide-step-one").hide();
                $(obj).show();
                $(obj).parent().show();
            }
        }


    }
}


/**
 * 素材使用提示弹窗
 */
function useTip(data) {
    if(!getUser()) {
        layer.msg('请登录后操作！',{time:2000000});return;
    }
    var userTip = layer.confirm('<div style="text-indent:2em;font-size:14px;color:#444;letter-spacing:1px;line-height:28px;">该素材首次收藏或使用，将扣除<span id="need-coin" style="font-size:16px;font-weight:bold;color:#44b549;margin:0 5px;">'+data['coin']+'</span>蚁币，以后可在<span style="font-size:14px;font-weight:bold;color:#44b549;margin:0 5px;">【我的收藏】</span>中免费使用，无需再花费蚁币。</div><div style="margin-top:15px;color:#666;font-size:14px;text-align:center;"><span class="no-tip-check" style="display:inline-block;height:14px;width:14px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box;margin-right:5px;vertical-align:middle;position: relative;cursor:pointer;"></span><span style="vertical-align:middle;">我知道了，以后不再提示了。</span></div>',{
        title : '样式素材使用提示<p class="closeclose" onclick="layer.close(layer.index)" style="cursor:pointer;position:absolute;color:#636363;font-size:20px;line-height:38px;top:0px;right:8px;"><i class="fa fa-times-circle" aria-hidden="true"></i></p>',
        closeBtn:0,
        resize:false,
        move:false,
        skin:'useTip',
        area:['419px','233px'],
        btn  : ['仅收藏','收藏并使用','取消']
    },function() {

    },function() {
        alert(111);
    },function() {
        return;
    });
}

/**
 * 检测用户处于登录状态赠送蚁币功能
 */
function loginGetCoin() {
    var user=getUser();
    if(!user){
        return;
    }
    var myDate=new Date();
    var month=myDate.getMonth()+1;
    var day=myDate.getDate();
    var browser_name = isChrome();
    if(month<10){
        month="0"+month;
    }
    if(day<10){
        day="0"+day;
    }
    var loginGetCoinTime = localStorage.getItem('loginGetCoinTime');
    var now_time=myDate.getFullYear()+'_'+month+'_'+day;
    var type=2;
    if(loginGetCoinTime==undefined || !loginGetCoinTime){
        type=1;
    }
    if(loginGetCoinTime != now_time || loginGetCoinTime == undefined || !loginGetCoinTime){
        $.ajax({
            url:'/home/index/loginTask',
            type:'GET',
            data:{type:type,browser_name:browser_name},
            success:function(msg) {
                if(msg.code==200){
                    localStorage.setItem('loginGetCoinTime',msg.time);
                }else{
                    if(type==1){
                        localStorage.setItem('loginGetCoinTime',msg.time);
                    }
                }
            }
        })
    }
}


//将RGB转化为16进制颜色值
function colorRGB2Hex(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);

    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}


/**
 * 帮助中心统计用户搜索关键字
 */
function countKeyword(keyword,type) {
    if($.trim(keyword) == '' || type == ''){
        return;
    }
    $.ajax({
        url:'/home/help/countKeyword',
        data:{keyword:keyword,type:type},
        success:function(msg){
            if(msg.code == 200){
                return true;
            }else{
                return false;
            }
        }
    })
}

/**
 * 统计用户搜索素材关键字
 */
function countStyleKeyword(keyword,type,origin){
    if($.trim(keyword) == '' || type == ''){
        return;
    }
    $.ajax({
        url:'/home/style/countKeyword',
        data:{keyword:keyword,type:type,origin:origin},
        success:function(msg){
            if(msg.code == 200){
                return true;
            }else{
                return false;
            }
        }
    })
}


/**
 * 统计用户点击信息
 */
function clickAction(btncode){
    $.ajax({
        url:"/home/Actionlog/addinfo",
        data:{code:btncode},
        async:true,
        cache:false,
        type:"POST",
        dataType:"json"
    })
}

//转译HTML
function htmlspecialchars(str){
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/'/g, '&#039;');
    return str;
}

//解析HTML
function htmlspecialchars_decode(string, quote_style) {
    var optTemp = 0
        , i = 0
        , noquotes = false;
    if (typeof quote_style === 'undefined') {
        quote_style = 2;
    }
    string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quote_style === 0) {
        noquotes = true;
    }
    if (typeof quote_style !== 'number') {
        quote_style = [].concat(quote_style);
        for (i = 0; i < quote_style.length; i++) {
            if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
            } else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/&#0*39;/g, "'");
    }
    if (!noquotes) {
        string = string.replace(/&quot;/g, '"');
    }
    string = string.replace(/&amp;/g, '&');
    return string;
}

//在文本框光标处插入
function insertAtCaret(textObj, textFeildValue) {
    if (document.all) {
        if (textObj.createTextRange && textObj.caretPos) {
            var caretPos = textObj.caretPos;
            caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? textFeildValue + ' ' : textFeildValue;
        } else {
            textObj.value = textFeildValue;
        }
    } else {
        if (textObj.setSelectionRange) {
            var rangeStart = textObj.selectionStart;
            var rangeEnd = textObj.selectionEnd;
            var tempStr1 = textObj.value.substring(0, rangeStart);
            var tempStr2 = textObj.value.substring(rangeEnd);
            textObj.value = tempStr1 + textFeildValue + tempStr2;
        } else {
            alert("This version of Mozilla based browser does not support setSelectionRange");
        }
    }
}
//设置文本框
function setCaretPosition(tObj, sPos){
    if(tObj.setSelectionRange){
        setTimeout(function(){
            tObj.setSelectionRange(sPos, sPos);
            tObj.focus();
        }, 0);
    }else if(tObj.createTextRange){
        var rng = tObj.createTextRange();
        rng.move('character', sPos);
        rng.select();
    }
}
//获取选中的文字
function getSelectText(editor) {
    if (!editor) return; editor.focus();
    if (editor.document && editor.document.selection)
        return editor.document.selection.createRange().text;
    else if ("selectionStart" in editor)
        return editor.value.substring(editor.selectionStart, editor.selectionEnd);
}