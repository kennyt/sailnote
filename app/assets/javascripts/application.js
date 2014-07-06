// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require cloudinary
//= require_tree .


//moving cover picture code. happens on every page with cover picture.
// function verticalAlign(){
// 	$('.cover-box img').css({'bottom': -(($('.cover-box img').height() - 200)/2)})
// 	setTimeout(function(){
// 		$('.cover-box img').css({'-webkit-transition': 'bottom 3s linear','-moz-transition': 'bottom 3s linear','-o-transition': 'bottom 3s linear','-ms-transition': 'bottom 3s linear','transition': 'bottom 3s linear'})
// 	},0)
// }
// $(document).ready(function(){
// 	if ($('.cover-box').length > 0){
// 		movingPicture = false;
// 		$('.cover-box').mousemove(function(e){
// 			cursorY = -(($('.cover-box img').height() - ($('.cover-box img').height() * (e.screenY/200)))+300)
// 			if (cursorY > 0){
// 				cursorY = 0;
// 			} else {
// 				if (cursorY < -($('.cover-box img').height() - 200)) {
// 					cursorY = -($('.cover-box img').height() - 200)
// 				}
// 			}
// 		})
// 		$('.cover-box').mouseover(function(e){
// 			$(this).attr('hovering','1')
// 			movingPicture ? false : clearInterval(movingPicture)
// 			movingPicture = setInterval(function(){
// 				if ($('.cover-box').attr('hovering').length > 0){
// 					$('.cover-box img').css({'bottom':cursorY+'px'})
// 				} else {
// 					clearInterval(movingPicture)
// 				}
// 			}, 50)
// 		})
// 		$('.cover-box').mouseout(function(e){
// 			$(this).attr('hovering','')
// 			clearInterval(movingPicture);
// 			$('.cover-box img').css({'bottom':$('.cover-box img').css('bottom')})
// 		})
// 	}
// })

function css(a) {
    var sheets = document.styleSheets, o = {};
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (a.is(rules[r].selectorText)) {
                o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
            }
        }
    }
    return o;
}

function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
        // for (var i in css) {
        //     if ((css[i]).toLowerCase) {
        //         s[(css[i]).toLowerCase()] = (css[css[i]]);
        //     }
        // }
        for (var i = 0; i < css.length; i += 1) {
			    s[css[i]] = css.getPropertyValue(css[i]);
				}
    } else if (typeof css == "string") {
        css = css.split("; ");
        for (var i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        }
    }
    return s;
}

