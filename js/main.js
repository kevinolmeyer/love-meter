/**
 *
 * Love Meter
 * Copyright Alamto.com 2020
 *
***/
var f1,f2;
$(function() {
    $(".mindmade .row button").click(function () {
        var id = $(this).attr('id');
        f1 = $(".mindmade .row input[type=text]:eq(0)");
        f2 = $(".mindmade .row input[type=text]:eq(1)");

        if( id == 'close' ){
            $(".mindmade .result").fadeOut();
            f2.val('');
            f1.val('').focus();
            return;
        }

        f1 = f1.val();
        f2 = f2.val();
        if( f1.length>2 && f2.length>2 ){
            if( f1 !== f2 ){
                $(".mindmade").addClass("load");
                setTimeout(function(){
                    makeAjax();
                },1000);
            }else alert('Please enter the Names correctly!');
        }else alert('Please enter the Names correctly!');
    });
});

var ajaxing = false;
function makeAjax(){
    // if( ajaxing ) return false;
    // ajaxing = true;
    // $.ajax({ url: '', type: 'GET', timeout: 5000, data: { 'i': Date.now() },
    //     success: function(data){
    //         //$(".mindmade").removeClass("load");
    //         //makeResult();
    //         ajaxing = false;
    //     },
    //     error: function(e){
    //         //$(".mindmade").removeClass("load");
    //         //console.log( e );
    //         ajaxing = false;
    //     }
    // });
    setTimeout( function() {
        $(".mindmade").removeClass("load");
        makeResult();
    }, 1*1000 );
}

function makeResult(){
    $(".mindmade .result").show();
    var width = 0;
    var n1 = $(".mindmade .result h2.name:eq(0)");
    var n2 = $(".mindmade .result h2.name:eq(1)");
    n1.text( f1 );
    n2.text( f2 );
    var sim = similarity();
    width = sim + '%';
    var per = $(".mindmade .result .percent");
    per.css("width","1%");
    $(".mindmade .result .row button#close").hide();
    per.find("span").text('').hide();

    var span = per.siblings("span");
    span.text('');//span.addClass('black');
    span.show();
    $({ Counter: 0 }).animate({ Counter: sim }, {
        duration: 2000,
        //easing: 'swing',
        step: function () {
            var num = Math.ceil(this.Counter);
            span.text( num + '%' );
            per.css('width', num + '%' );
            //if( num > 45 ) span.removeClass('black');
        }
    });
    setTimeout(function(){
        $(".mindmade .result .row button#close").fadeIn('slow');
    },2100);
    // per.animate({
    //         width: width
    //     }, 2000,
    //     function(){
    //         $(".mindmade .result .row button#close").fadeIn('slow');
    //         //$(this).find("span").text( width ).fadeIn();
    //     }
    // );
}

function similarity() {
    var longer = f1;
    var shorter = f2;
    if (f1.length < f2.length) {
        longer = f2;
        shorter = f1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) return 1.0;
    var adds = [1,-1,2,-3,4,5,-4]; //daily sun to fri
    var ret = 0.7 +
        (( ( longerLength - editDistance(longer, shorter) ) / parseFloat(longerLength) )*0.25);
    ret = Math.floor( ret * 100 );
    ret = ret + adds[ new Date().getDay() ];
    return ret;
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}
