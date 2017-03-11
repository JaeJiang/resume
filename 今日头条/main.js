$(function(){

    var $cur = $('.left'),
        curH = $cur.height(),
        curW = $cur.width(),
        offT = $cur.offset().top,
        offL = $cur.offset().left;

    var $curClone = $cur.clone()
        .css({ display: 'none'})
        .insertBefore($cur);

    $(window).on('scroll',function(){
        var scrollTop = $(this).scrollTop();

        if(scrollTop >= offT){
            setFix();

        }else{
            $curClone.hide();
            $cur.css('visibility','initial');
            $cur.show();
        }
    })

    function setFix(){
        $curClone.css({
            'position': 'fixed',
            'top': '15px',
            'left': offL,
            'width': curW,
            'margin': 0,
            'z-index': 9999
        });
        $curClone.show();
        $cur.css('visibility','hidden')

    }

    //var $channel = $('.channel-item');
    //
    //$channel.on('mouseenter',function(){
    //    $channel.find('li').addClass('active');
    //    console.log(1)
    //
    //});
    $('.channel-item').on('mouseenter',  function(e){
        $(this).addClass('active');
    });
    $('.channel-item').on('mouseleave',  function(e){
        $(this).removeClass('active');
    });


    var $window = $('window'),
        $ct = $('.ct'),
        $items = $ct.children(),
        $bullet = $('.bullet'),
        imgwd = $items.width(),
        imgCount = $ct.children().size();

    //1.克隆 2.克隆后的真实图片个数 3.改变css

    //$ct.append($items.first().clone());
    //   $ct.prepend($items.last().clone());
    //   realCount = $ct.children().size();
    //  $ct.css({left: -imgwd,width: realCount*imgwd})


    var curIdx = 0;
    var isAnimate = false; //状态锁


    $bullet.find('li').on('mouseenter',function(){
        var idx = $(this).index();
        play(idx);

    });
    //自动播放
    autoPlay();

    //  function stopAuto(){
    //clearInterval(clock);
    //  }
    function autoPlay(){
        clock = setInterval(function(){
            playNext();
        }, 3000);
    }

    function playNext(){
        play((curIdx+1)%imgCount)
    }
    function play(idx){
        $items.eq(curIdx).fadeOut(500);
        $items.eq(idx).fadeIn(300, function(){
            isAnimate = false;
        });
        curIdx = idx;
        setBullet();
    }

    //设置bullet

    function setBullet(){
        $bullet.find('li').removeClass('active')
            .eq(curIdx).addClass('active');
    }

    //console.log(1);

    //不感兴趣按钮
    $(".center-item .source button").on('click',function(){

        $(this).parents(".center-item").css("display","none");
        console.log(1);
    })


});
