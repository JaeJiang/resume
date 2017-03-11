

var clock;
$(window).on('scroll', function(){
  //用户鼠标滚轮滚动一次，有多次事件响应。下面的 setTimeout 主要是为性能考虑，只在最后一次事件响应的时候执行 checkshow
  if(clock){
    clearTimeout(clock);
  }
  clock = setTimeout(function(){
    checkShow();
  }, 100);
});

// 用户第一次打开页面，还未滚动窗口的时候需要执行一次 checkShow
checkShow();

//判断目标出现没有
function isShow($el){
  var scrollH = $(window).scrollTop(),
      winH = $(window).height(),
      top = $el.offset().top;

  if(top < winH + scrollH){
    return true;
  }else{
    return false;
  }
}

//出现的话就 执行 loadAndPlace
function checkShow(){
  if(isShow($('#load'))){
    loadAndPlace();			//
  }
}





// 获取数据，并且摆放位置

var curPage = 1,
    perPageCount = 20;

function loadAndPlace(){
  $.ajax({
    url: 'http://platform.sina.com.cn/slide/album_tech', //新浪新闻的 jsonp接口
    // type: 'get',
    dataType: 'jsonp',
    jsonp:"jsoncallback",
    data: {
      app_key: '1271687855',
      format:'json',
      size:'img',
      num: perPageCount,
      page: curPage
    }
  }).done(function(ret){
    if(ret && ret.status && ret.status.code === "0"){
      place(ret.data);   //如果数据没问题，那么生成节点并摆放好位置
    }else{
      console.log('get error data');
    }
  });
}



function place(nodeList){
  console.log(nodeList);
  var $nodes = renderData(nodeList);  //节点生成后添加到页面上

  var defereds = [];  //创建存储 defered 对象的数组
  $nodes.find('img').each(function(){
    var defer = $.Deferred();
    $(this).load(function(){
      defer.resolve();
    });   //当每个图片加载完成后，执行 resolve
    defereds.push(defer);
  });
  $.when.apply(null,defereds).done(function() { //当所有的图片都执行 resolve 后，即全部图片加载后，执行下面的内容
    console.log('new images all loaded ...');
    //当节点里的图片全部加载后再使用瀑布流计算，否则会因为图片未加载 item 高度计算错误导致瀑布流高度计算出问题
    waterFallPlace($nodes);
  });
}



// 瀑布流

var colSumHeight = [],
    nodeWidth = $('.item').outerWidth(true),
    colNum = parseInt($('#pic-ct').width()/nodeWidth);

for(var i=0; i<colNum; i++){
  colSumHeight.push(0)
}

function waterFallPlace($nodes){
  $nodes.each(function(){
    var $cur = $(this);
    //colSumHeight = [100, 250, 80, 200]

    var idx = 0,
        minSumHeight = colSumHeight[0];

    for(var i=0;i<colSumHeight.length; i++){
      if(colSumHeight[i] < minSumHeight){
        idx = i;
        minSumHeight = colSumHeight[i];
      }
    }

    $cur.css({
      left: nodeWidth*idx,
      top: minSumHeight,
      opacity: 1
    });

    colSumHeight[idx] = $cur.outerHeight(true) + colSumHeight[idx];
    $('#pic-ct').height(Math.max.apply(null,colSumHeight));
  });

}


//将数据放入拼装成DOM放到页面上
function renderData(items){
  var tpl = '',
      $nodes;
  for(var i = 0;i<items.length;i++){
    tpl += '<li class="item">';
    tpl += ' <a href="'+ items[i].url +'" class="link"><img src="' + items[i].img_url + '" alt=""></a>';
    tpl += ' <h4 class="header">'+ items[i].short_name +'</h4>';
    tpl += '<p class="desp">'+items[i].short_intro+'</p>';
    tpl += '</li>';
  }
  $nodes = $(tpl);
  $('#pic-ct').append($nodes);
  return $nodes;
}

//$(".top-bar").('scroll',function(){
//  if ($(window).scrollTop=)
//})

 $.fn.stick =function(handler){

   var $cur = this,
       curH = $cur.height(),
       curW = $cur.width(),
       offsetTop = $cur.offset().top,
       offsetLeft = $cur.offset().left;
       onChange = handler ||function(){};

   //把目标元素克隆一个用于占位，否则目标元素 Position 变为 fix后脱离文档流，导致页面跳动

   var $div = $cur.clone()
               .css('opacity',0)
               .insertBefore($cur)
                .hide();

   $(window).on('scroll', function(){
     var scrollTop = $(this).scrollTop();

     if(scrollTop >= offsetTop ){
       if(!isFixed()){
         setFixed();
         onChange.call($cur);
       }
     }else{
       if(isFixed()){
         unsetFixed();
       }
     }
   });

    function isFixed(){
      return !!$cur.data('data-fixed');
    }

    function setFixed(){
      $cur.attr('data-fixed', true)
          .css({
                'position': 'fixed',
                'top': 0,
                'left': offsetLeft,
                'width': curW,
                'margin': 0,
                'z-index': 9999
              });
      $div.show();

    }
    function unsetFixed(){
      $cur.removeAttr('data-fixed')
          .removeAttr('style');
      $div.hide();
    };

 };
$('.top-bar').stick();