var themeList = {
  slideList: function(){
    this.tabChoic();
    this.choiceAjaxList();
    this.choice();
  },
  myNews: function(){
    this.news();
    this.choiceEditTab();
    this.tabChoic();
  },
  choiceEdit: function(){
    this.choiceEditTabB();
    this.lyaerDel();
    this.layerBtn();
    this.delLayer();
    this.choicesBtnAll();
    this.btnUp();
  },
  // 用户自选股数据列表渲染
  choiceAjaxList: function(){
    var html = '';
    var $this = this;
    var userId = 1;
    var waitLoading = new WaitLoading();
    waitLoading.open();
    api.ajax({
      url:url() + 'selfSelectInfo/showMySelect',
      data:{
        values:{
          userId:userId,
          infoType:2
        }
      }
    },function(ret,err){
      console.log(JSON.stringify(ret))
      if(ret.success === true){
        waitLoading.close();
        var msgList = ret.mySelect;
        console.log(JSON.stringify(msgList));
        for(var i = 0;i<msgList.length;i++){
          var msg = msgList[i];
          if( msg.infoType != 1){
            html += $this.htmlTheme(msg);
            console.log(msg.chg)
            
            // if(msg.chg <0){
            //   // console.log($(this))
            //   $(this).children('ifBackColor').css({color:'#e80618',backgroundColor:'#e80618'})
            // }else{
            //   $(this).children('ifBackColor').css({color:'#4ba54c',backgroundColor:'#4ba54c'})
            // }
          }else{
            // html += $this.htmlShares(msg);
            // console.log(msg.chg)
            // if(msg.chg <0){
            //   $this.css({color:'#e80618',backgroundColor:'#e80618'})
            // }else{
            //   $this.css({color:'#4ba54c',backgroundColor:'#4ba54c'})
            // }
          }
          // console.log(msg.infoId)
        }
        $('#listAll').append(html)
        // console.log(msg.chg<0)
        // if(msg.chg < 0){
        //   $('.ifBackColor').css('background-color','#e80618');

        //   console.log($('.ifBackColor'));
        // }else{
        //   console.log('da');
        // }
      }else{
        waitLoading.close();
        commonAlertWindow({
          message:err,
          time:2000
        })
      }
    })
  },
  htmlTheme: function(msg){
    htmlTheme = 
    '            <li class="theme hot-txt" infoId="'+msg.infoId+'" infoType="'+msg.infoType+'">'+
    '                <div class="li">'+
    '                    <span>'+msg.infoName+' <b>主题</b></span>'+
    '                    <span>--</span>'+
    '                    <span><u class="ifBackColor" '

    // (msg.chg<0) ? 'style="margin-left:3px;"' : ''


                          if(msg.chg<0){+'style="margin-left:3px;" '}
                          '>'+msg.chg+'%</u></span>'+
    '                </div>'+
    '                <i class="btn"></i>'+
    '            </li>';
    console.log($('.ifBackColor'))
    return htmlTheme;
  },
  htmlShares: function(msg){
    htmlShares = 
    '            <li class="hot-txt" infoId="'+msg.infoId+'" infoType="'+msg.infoType+'">'+
    '                <div class="li">'+
    '                    <span>'+msg.infoName+'<i>'+msg.infoCode+'</i></span>'+
    '                    <span class="ifColor">'+msg.currentPrice+'</span>'+
    '                    <span><u class="ifBackColor">'+msg.chg+'%</u></span>'+
    '                </div>'+
    '                <i class="btn"></i>'+
    '            </li>';
    return htmlShares;
  },
  // 滑动
  tabChoic: function() {
    setTimeout(function() {
      $('.btn').show();
    }, 1000);
    var expansion = null; //是否存在展开的list
    var container = document.querySelectorAll('.list li .li');
    for (var i = 0; i < container.length; i++) {
      var x, y, X, Y, swipeX, swipeY;
      container[i].addEventListener('touchstart', function(event) {
        x = event.changedTouches[0].pageX;
        y = event.changedTouches[0].pageY;
        swipeX = true;
        swipeY = true;
        if (expansion) { //判断是否展开
          expansion.className = "li";
        }
        // 删除
        $('.btn').on('click', function() {
          // $(this).siblings('.btn').parent('li').remove();
          console.log($(this))
          // var id = $(this).attr('id'),
          // infoType = $(this).attr('infoType'),
          // infoId = $(this).attr('infoId');
          // var SelfSelectInfo = {"id": id,"userId": userId,"infoType": infoType,"infoId": infoId};
          // api.ajax({
          //   url: url()+ 'selfSelectInfo/deleteBatch',
          //   data:{
          //     values:{
          //       SelfSelectInfo:JSON.stringify(SelfSelectInfo)
          //     }
          //   }
          // },function(ret,err){
          //   if(ret.success){
          //     commonAlertWindow({
          //       message:ret,
          //       time:2000
          //     })
          //     $(this).parent('li').remove();
          //   }else{
          //     commonAlertWindow({
          //       message:err,
          //       time:2000
          //     })
          //   }
          // })
        })
      });
      container[i].addEventListener('touchmove', function(event) {
        X = event.changedTouches[0].pageX;
        Y = event.changedTouches[0].pageY;
        // 左右滑动
        if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
          // 阻止事件冒泡
          event.stopPropagation();
          if (X - x > 10) { //右滑
            event.preventDefault();
            this.className = "li"; //右滑收起
          }
          if (x - X > 10) { //左滑
            event.preventDefault();
            this.className = "li swipeleft"; //左滑展开
            expansion = this;
          }
          swipeY = false;
        }
        // 上下滑动
        if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
          swipeX = false;
        }
      });
    }
  },	
  news: function(){
    $('.mynew-list li .li').each(function(){
      console.log($(this).height())
      var h = $(this).height();
      // var box = $(this).parent().height();
      var Height= h*3;
      console.log(Height)
      $(this).parent().height(Height);
    })
  },
  choice: function() {
    var userId = userId;
    var waitLoading = new WaitLoading();
    var $li = $('#tabChoice span');
    var $ul = $('#tabBox .list');
    $ul.eq(0).css('display', 'block');
    $li.mouseover(function() {
      var $this = $(this);
      var $t = $this.index();
      $li.removeClass();
      $this.addClass('active');
      $ul.css('display', 'none');
      $ul.eq($t).css('display', 'block');
      // console.log(typeof $t);
      // console.log($t);
      waitLoading.open();
      if($t === 0){
        $t = 2;
      }else if($t === 1){
        $t = 0;
      }else{
        $t = 1;
      }
      // console.log(typeof $t)
      // console.log($t);
      var userId = '1';
      api.ajax({
        url:url() + 'selfSelectInfo/showMySelect',
        data:{
          values:{
            userId:userId,
            infoType:$t
          }
        }
      },function(ret,err){
        console.log(JSON.stringify(ret));
        // if(ret.success){
        //   waitLoading.close();
        // }else{
        //   waitLoading.close();
        //   commonAlertWindow({
        //     message:err,
        //     time:2000
        //   })
        // }
      })
    })
  },
  choiceEditTab: function() {
    var $li = $('#tabChoice span');
    var $ul = $('#tabBox .list');
    $ul.eq(0).css('display', 'block');
    $li.mouseover(function() {
      var $this = $(this);
      var $t = $this.index();
      $li.removeClass();
      $this.addClass('active');
      $ul.css('display', 'none');
      $ul.eq($t).css('display', 'block');
    })
  },
  choiceEditTabB: function() {
    var $li = $('#tabChoice span');
    var $ul = $('#tabBox .tab-list');
    $ul.css('display', 'none');
    $ul.eq(0).css('display', 'block');
    $li.mouseover(function() {
      var $this = $(this);
      var $t = $this.index();
      $li.removeClass();
      $this.addClass('active');
      $ul.css('display', 'none');
      $ul.eq($t).css('display', 'block');
    })
  },
  // 删除弹框提示
  lyaerDel: function(){
    $('body').on('click','.lyaer-choices button',function(){
      // var data = obj.dataName;
      // var inputName = $('input[type=checkbox]:checked');
      // var inputName = $('input[type=checkbox]:checked').getAttribute(dataName);
      // console.log(inputName)
      function choiceLayer(obj){
        var html =
        '<div class="layer-del">'+
        '    <div class="layer-del-box">'+
        '        <p>确定删除</p>'+
        '        <p>'+obj.name+'等'+obj.number+'个自选</p>'+
        '        <div class="btn">'+
        '            <a href="#" id="btnNo">取消</a>'+
        '            <a href="#" id="yse">确定</a>'+
        '        </div>'+
        '    </div>'+
        '</div>';
        $('body').append(html);
      };
      function checkinput(obj){
        if(obj.value == ""){
          var msg;
          msg = document.getElementsByName('choice')[0].getAttribute('dataName');
          alert(msg);
        }
      };
      choiceLayer({
        name:'zzzz',
        number: 1
      })
    })
  },
  // 弹出框取消
  layerBtn: function(){
    $('body').on('click','#btnNo', function(){
      $(this).parent().parent().parent('.layer-del').remove();
    })
  },
  delLayer: function(){
    var html = 
    '<div class="lyaer-choices">'+
    '	<button>删 除</button>'+
    '</div>';
    $('body').append(html);
  },
  // 自选编辑全选
  choicesBtnAll: function(){
    $('.tab-list').on('click','a',function(e){
      var _this = $(this);
      var ns = _this.next();
      console.log(ns)
      var btnOn = $('li').children('input');
      var is = '';
      if($(this).attr('istype') == 'false') {
        is = true
      } else {
        is = false
      }
      console.log(is)
      $(this).attr('istype',is)  
      ns.children('li').children('input').each(function(){
        console.log(is,$(this).is('checked'))
        $(this).prop('checked', is)
      });
    })
  },
  btnUp: function(){
    $('.list-choice').on('click','i',function(){
      var _this = $(this).parent('li');
      var _thisUl = $(_this).parent('ul');
      // console.log(_this)			
      // console.log(_thisUl)
      $(_this).remove();
      $(_thisUl).prepend(_this)
    })
  },
  
};	
$.binLib.Slide = function (){
    themeList.slideList();
};
$.binLib.mynewsList = function (){
    themeList.myNews();
}
$.binLib.choice = function (){
    themeList.choiceEdit();
}
