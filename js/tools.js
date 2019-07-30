

/*
* 营销工具--------视频提取
* */
$(document).on("click", ".videoTq", function () {
    var url = $(this).prev().val();
    //校验URL是否合法
    if (url.indexOf("http://mp.weixin.qq.com/") > -1 || url.indexOf("https://mp.weixin.qq.com/") > -1) {
        //验证通过，后台处理获取文章中视频
        $.ajax({
            url: getVideo,
            data: {"url": url},
            type: 'get',
            dataType: 'json',
            success: function (msg) {
                if (msg.err_code !== 0) {
                    alert(msg.message);
                } else {
                    //准备展示数据
                    var str = '';
                    $.each(msg.message, function (key, val) {
                        val = val.replace(/width=\d*&amp;height=\d*/,'');
                        str += '<div class="toolsRightFirst videoBody">\n' +
                            '                        <p class="toolsRightFirstP1">视频地址：</p>\n' +
                            '                        <input type="" value="' + val + '" name="" class="toolsRightFirstInput1">\n' +
                            '                        <p class="tools-right-video-btn1 fzBtn">复制</p>\n' +
                            '                        <p class="tools-right-video-btn1 tools-audio-add">插入</p><span style="display: none;">  <iframe class="video_iframe" frameborder="0" src="'+val+'" allowfullscreen="1" style="height:280px; width:100%; "></iframe></span>\n' +
                            '                    </div>';

                    });
                    //替换到页面
                    $(".videoBody").remove();
                    $(".videoUrl").after(str);
                }
            }
        })
    }
    //不合法，提示错误信息
    else {
        alert('请填写 “ http://mp.weixin.qq.com/ ” 开头的网址');
    }
});

/*
* 营销工具--------一键关注
* */
$(document).on("click", ".getUrlBtn", function () {
    if ($(this).prev().val().indexOf("__biz=") > -1) {
        $.ajax({
            url: getUrl,
            data: {url: $(this).prev().val()},
            type: 'get',
            dataType: 'json',
            success: function (msg) {
                if (msg.err_code !== 0) {
                    alert(msg.message);
                } else {
                    $(".getUrlInput").val(msg.url);
                    $("#tu").prop('src', "/index.php/home/Tools/qrCode?e=" + msg.en_url);
                }
            }
        })
    } else {
        alert('请输入正确的历史图文消息链接地址');
    }
});
/*
* 营销工具------新建留言板
* */
$(document).on("click",".newBoardBtn",function(){
    var obj =  $(this);
    var public  = $(".publicInputText").val();
    var title = $(".titleInputText").val();
    var image =  $(".picInputUrl").val();
    // console.log($("#coverImg").prop("src"))
    if(public=='') {
        alert('请输入公众号名字');
    } else if(title=='') {
        alert('请输入留言板标题');
    } else if(image.indexOf("http")>-1){
        $("#shorUrlInput").val('pages/board/board?title='+encodeURIComponent(title)+'&public='+public+'&image='+image);
        $("#coverImg").prop("src",image);
        $("#imgLookBtn").prop("href",image);
        setCookie('username',public,365)
        setCookie('image',image,365)
    } else if(image=='') {
        $("#shorUrlInput").val('pages/board/board?title='+encodeURIComponent(title)+'&public='+public);
        setCookie('username',public,365)
        setCookie('image',image,365)
    } else {
        alert('请输入一个正确的网址');
    }
});
/*
* 营销工具------观看使用视频
* */
$(document).on("click",".watchVideo",function(){
    window.open("https://mp.weixin.qq.com/cgi-bin/appmsg?begin=0&count=10&action=list_video&type=15&token=973524001&lang=zh_CN"，"_blank");
});
/*
* 营销工具------微信短网址
* */
$(document).on("click",".shortUrlBtn",function(){
    var obj =  $(this);
  var url =  $(this).prev().val();
    if(url.indexOf("http")>-1){
        $.ajax({
            url:shortUrl,
            data:{url:url},
            type:'get',
            dataType:'json',
            success:function(con){
                if(con.err_code == 1){
                    alert(con.message);
                }else{
                    $(".shortUrlInput").val(con.message[0].url_short);
                }
            }
        })

    }else if(url.value==''){
        alert('请输入一个网址');
    }else{
        alert('请输入一个正确的网址');
    }
});
/*
* 营销工具------微信封面图提取
* */
$(document).on("click",".coverBtn",function(){
    var url = $(this).prev().val();
    if(url.indexOf("http://")>-1 || url.indexOf("https://")>-1){
        $.ajax({
            url:coverUrl,
            data:{"url":url},
            type:'get',
            dataType:'json',
            success:function (con) {
                if(con.err_code == 0){
                    $("#coverImg").prop("src",con.message);
                    $(".coverInput").val(con.message);
                    $("#imgLookBtn").prop("href",con.message);
                }else{
                    alert(con.message);
                }
            }
        })
    }else {
        alert('请填写 “ http://mp.weixin.qq.com/ ” 开头的网址');
    }
});
/*
* 营销工具-------微信超链接
* */
$(document).on("click",".superUrlBtn",function(){
    var url =  $(this).prev();
    var prev  = $(".urlInputText").val();
    var later = $(".urlInputLater").val();
    if(url.val().indexOf("http")>-1){
         $("#wxUrl").val('<a href="'+url.val()+'">'+prev+'</a>'+later);
         $("#peopleUrl").val('<a href="'+url.val()+'">'+prev+'</a🐜>'+later);
    }else{
        alert("请输入正确的网址！");
    }
});

//美图秀秀接口
function toolsXiuxiu(type,img,_XIUXIU) {
    var userInfo = getUser();
    if(!userInfo){
        layer.msg("请登录后操作",{"time":1500});
       return false;
    }
    layer.open({
        type: 2,
        title:false,
        // closeBtn:0,   //关闭差号
        masksToBounds:true,
        shade: 0.8,
        move: false,
        area: ['1020px', '560px'],
        content:"/home/editor/meitu?img="+img+'&module='+type+'&type='+_XIUXIU
    });
}

function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if(c_start!=-1)
        { 
            c_start=c_start + c_name.length+1 
            c_end=document.cookie.indexOf(";",c_start)
            if(c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return ""
}

function setCookie(c_name,value,expiredays)
{
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+expiredays)
    document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

function checkCookie()
{
    username=getCookie('username')
    if (username!=null && username!="")
    {
        alert('Welcome again '+username+'!')
        $(".publicInputText").attr('value',username);
        $(".publicInputText").attr('placeholder',"");
    }
    // else 
    // {
    //     username=prompt('请输入你的公众号名字:',"")
    //     if(username!=null && username!="")
    //     {
    //         setCookie('username',username,365)
    //     }
    // }
    image=getCookie('image')
    if (image!=null && image!="")
    {
        $(".picInputUrl").attr('value',image);
        $(".picInputUrl").attr('placeholder',"");
        $("#coverImg").prop("src",image);
        $("#imgLookBtn").prop("href",image);
    }
}