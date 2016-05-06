/**
 * Created by Administrator on 2016/5/3 0003.
 */
/// <reference path="jquery-2.1.1.min.js" />
/**
 *
 * Drag.js
 *
 * 拖拽交互
 *
 * version 1.0.0.0(主版本号.子版本号.编译版本号.修正版本号)
 *
 * @author Tanlx
 *
 * create log 2016年5月3日10:16:21
 *
 * update log
 *
 */

(function($){
    $.extend({
        Drag:function(options){
            //自定义类
            var opts={
                // moveTarget:".drag", //拖拽目标元素
                moveTargetCont:"", //拖拽父级元素
                moveTargetDestination:"", //拖拽目的区域
            };
            //合并自定义类
            opts = $.extend(opts, options);

            var dragging = false, //自定义控制器防止冒泡
                iX, iY,           //鼠标相对于当前移动对象的坐标
                nX=$(opts.moveTargetDestination).offset().left, //拖拽目标区域的left值
                nY=$(opts.moveTargetDestination).offset().top,//拖拽目标区域的top值
                height=$(opts.moveTargetDestination).height(),//拖拽目标区域的height值
                width=$(opts.moveTargetDestination).width();//拖拽目标区域的width值

            var bindEvent=function(el,fn){
                (function(el, fn){
                    $(el).mousedown(function(e) {
                        var cloneDiv,oX,oY;
                        dragging = true;
                        iX = e.clientX - this.offsetLeft;
                        iY = e.clientY - this.offsetTop;
                        cloneDiv=$(this).clone(true).addClass("on").css({
                            "position":"absolute",
                            'z-index':2,
                            "left":this.offsetLeft + "px",
                            "top":this.offsetTop + "px"
                        });
                        $(opts.moveTargetCont).append(cloneDiv);

                        document.onmousemove = function(e) {
                            if (dragging) {
                                var e = e || window.event;
                                var oX = e.clientX - iX;
                                var oY = e.clientY - iY;
                                $(".on").css({
                                    "left":oX + "px",
                                    "top":oY + "px",
                                    "opacity": .5
                                });
                                return oX;
                                //return false;
                            }
                        };
                        document.onmouseup = function(e) {
                            dragging = false;
                            var on=$(".on").attr('class');
                            if(on != undefined){
                                var oX=$(".on").offset().left;
                                var oY=$(".on").offset().top;
                                if( parseInt(oX-nX )>0 && parseInt(oX-nX) < width &&parseInt(oY-nY )>0 && parseInt(oY-nY) < height ){
                                    var fun=fn;
                                    fun();
                                }
                                $(".on").remove();
                            }
                            e.cancelBubble = true;
                        };
                        return false;
                    });
                })(el, fn);
            };
            this.bindEvent=bindEvent;
        }

    })

})(jQuery);

(function () {
    var fullScreenApi = {
            supportsFullScreen : false,
            isFullScreen : function () {
                return false;
            },
            requestFullScreen : function () {},
            cancelFullScreen : function () {},
            fullScreenEventName : '',
            prefix : ''
        },
        browserPrefixes = 'webkit moz o ms khtml'.split(' ');
    // check for native support
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++) {
            fullScreenApi.prefix = browserPrefixes[i];
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] != 'undefined') {
                fullScreenApi.supportsFullScreen = true;
                break;
            }
        }
    }
    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
        fullScreenApi.isFullScreen = function () {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function (el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        fullScreenApi.cancelFullScreen = function (el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }
    }
    // jQuery plugin
    if (typeof jQuery != 'undefined') {
        jQuery.fn.requestFullScreen = function () {
            return this.each(function () {
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(this);
                }
            });
        };
        jQuery.fn.cancelFullScreen = function () {
            return this.each(function () {
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.cancelFullScreen(this);
                }
            });
        };
    }
    // export api
    window.fullScreenApi = fullScreenApi;
})();