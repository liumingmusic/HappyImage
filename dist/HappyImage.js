/*!
 *  HappyImage v1.0.0
 *  Copyright (C) 2019, ZG
 *  Released under the MIT license.
 */
!(( global, factory ) => {

    if ( typeof define === "function" && define.amd ) { 
        define( [ "jquery" ], jQuery => factory( global, jQuery ) );
    } else if ( typeof module !== "undefined" && typeof exports === "object" ) {
        factory( global, require( "jquery" ) );
    } else {
        factory( global, global.jQuery );
    }

})( typeof window !== "undefined" ? window : this, ( window, $ ) => {

    "use strict";
    
    // 检测 jquery
    !(function checkjQuery () {
        if ( typeof jQuery === "undefined" ) {
            throw new Error( "HappyImage's JavaScript requires jQuery" );
        }
        const version = $.fn.jquery.split( "." );
        if ( ~~version[ 0 ] === 1 && ~~version[ 1 ] < 8 ) {
            throw new Error( "HappyImage's JavaScript requires jQuery version 1.8.0 or higher" );
        }
    })();

    // 不支持 IE8-
    const UA = navigator.userAgent.toLowerCase();
    const [ IE9, IE10 ] = [
        UA.match( "msie 9.0" ),
        UA.match( "msie 10.0" ),
    ];
    if ( UA.match( /msie (8|7|6)/ ) ) {
        return;
    }

    // 含有命名空间的点击事件
    // 便于自定义控制器解绑事件
    const ClickNS = "click.hy";

    // 样式
    $( "style" ).filter( '[data-from="HappyImage"]' ).remove();
    $( "<style>" ).html(`
        .hy-target{overflow:hidden}
        .hy-relative{position:relative}
        .hy-wrapper{overflow:hidden;position:absolute;top:0;left:0;height:100%}
        .hy-wrapper *{box-sizing:border-box}
        .hy-fade .hy-box{position:absolute;width:100%;height:100%;top:0;left:0;opacity:0;-webkit-transition-property:opacity;-moz-transition-property:opacity;transition-property:opacity;-webkit-transition-timing-function:ease-in-out;-moz-transition-timing-function:ease-in-out;transition-timing-function:ease-in-out}
        .hy-box.hy-fade-show{opacity:1}
        .hy-slide{display:-webkit-flex;display:-moz-flex;display:flex;justify-content:space-between;-webkit-transition-timing-function:cubic-bezier(.6,0,.52,1);-moz-transition-timing-function:cubic-bezier(.6,0,.52,1);transition-timing-function:cubic-bezier(.6,0,.52,1)}
        .hy-slide .hy-box{position:relative}
        .hy-box{overflow:hidden}
        .hy-next,.hy-prev{position:absolute;top:50%;-webkit-transform:translate(0,-50%);-moz-transform:translate(0,-50%);-ms-transform:translate(0,-50%);transform:translate(0,-50%);z-index:9;width:40px;height:40px;border-radius:50%;overflow:hidden;cursor:pointer;background:rgba(0,0,0,.3);-webkit-transition:opacity .35s;-moz-transition:opacity .35s;transition:opacity .35s}
        .hy-next i,.hy-prev i{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);display:block;width:14px;height:14px;opacity:.7;-webkit-transition:.2s;;-moz-transition:.2s;transition:.2s;background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTcxNzIwNjI0OTg1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExMDIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTM0Ni41MjM4MjM0NTQ3NzQwNiAxMDQuNDM4MzA1MzI2NzQ0MTdjLTEyLjI1NzQ5NTA1NTQ0NzY1Mi0xMi4yNTc0OTUwNTU0NDc2NTItMzAuNjQzNzM1OTYyNzg5OC0xMi4yNTc0OTUwNTU0NDc2NTItNDIuOTAxMjMxMDE4MjM3NDcgMHMtMTIuMjU3NDk1MDU1NDQ3NjUyIDMwLjY0MzczNTk2Mjc4OTggMCA0Mi45MDEyMzEwMTgyMzc0N0w2NjguMjgzMDU2MDkxNTU1MSA1MTIgMzAzLjYyMjU5MjQzNjUzNjYgODc2LjY2MDQ2MzY1NTAxODVjLTEyLjI1NzQ5NTA1NTQ0NzY1MiAxMi4yNTc0OTUwNTU0NDc2NTItMTIuMjU3NDk1MDU1NDQ3NjUyIDMwLjY0MzczNTk2Mjc4OTggMCA0Mi45MDEyMzEwMTgyMzc0NyA2LjEyODc0NzUyNzcyMzgyNiA2LjEyODc0NzUyNzcyMzgyNiAxNS4zMjE4Njc5ODEzOTQ5IDkuMTkzMTIwNDUzNjcxMDczIDIxLjQ1MDYxNTUwOTExODczNCA5LjE5MzEyMDQ1MzY3MTA3M3MxNS4zMjE4Njc5ODEzOTQ5LTMuMDY0MzcyOTI1OTQ3MjQ2IDIxLjQ1MDYxNTUwOTExODczNC05LjE5MzEyMDQ1MzY3MTA3M2wzODYuMTExMDc5MTY0MTM3Mi0zODYuMTExMDc5MTY0MTM3MmMxMi4yNTc0OTUwNTU0NDc2NTItMTIuMjU3NDk1MDU1NDQ3NjUyIDEyLjI1NzQ5NTA1NTQ0NzY1Mi0zMC42NDM3MzU5NjI3ODk4IDAtNDIuOTAxMjMxMDE4MjM3NDdMMzQ2LjUyMzgyMzQ1NDc3NDA2IDEwNC40MzgzMDUzMjY3NDQxN3oiIGZpbGw9IiNmZmZmZmYiIHAtaWQ9IjExMDMiPjwvcGF0aD48L3N2Zz4=) center no-repeat}
        .hy-next:hover i,.hy-prev:hover i{opacity:1}
        .hy-prev{left:20px;-webkit-transform:translate(0,-50%) rotate(180deg);-moz-transform:translate(0,-50%) rotate(180deg);-ms-transform:translate(0,-50%) rotate(180deg);transform:translate(0,-50%) rotate(180deg)}
        .hy-next{right:20px}
        .hy-next.hy-hovershow,.hy-prev.hy-hovershow{opacity:0}
        .hy-target:hover .hy-next.hy-hovershow,.hy-target:hover .hy-prev.hy-hovershow{opacity:1}
        .hy-dot{position:absolute;bottom:15px;z-index:9;height:12px}
        .hy-dot i{display:block;float:left;width:10px;height:10px;border-radius:50%;cursor:pointer;margin:0 5px;background:rgba(0,0,0,.3);-webkit-transition:.4s;-moz-transition:.4s;transition:.4s}
        .hy-dot i.active{background:#fff}
        .hy-dot-left{left:10px}
        .hy-dot-center{left:50%;-webkit-transform:translate(-50%,0);-moz-transform:translate(-50%,0);-ms-transform:translate(-50%,0);transform:translate(-50%,0)}
        .hy-dot-right{right:10px}
    `).attr( "data-from", "HappyImage" ).prependTo( "head" );

    $.fn.HappyImage = function ( options = {} ) {
        return this.each(function () {

            // 默认配置
            const defaults = {
                width: null,
                height: null,
                effect: "slide",
                duration: 700,
                arrow: true,
                dot: true,
                defaultIndex: 0,
                arrowHoverShow: false,
                dotAlign: "center",
                autoplay: 0,
                onChange: $.noop
            };
            const opt = $.extend( {}, defaults, options );

            const $this = $( this );
            const $wrapper = $this.children();
            const $box = $wrapper.children();
            let size = $box.length;

            // 生成一个随机 ID
            const ID = Math.random().toString( 36 ).substr( 2 );

            // 在目标元素上添加数据
            $this.data({
                happyImageOptions: opt,
                happyImageContent: $this.clone( true ),
                happyImageID: ID
            });

            // 判断 onChange 参数是否为函数
            const changeIsFunc = $.isFunction( opt.onChange );

            // 切换动画的过渡时长
            const duration = 
                ( 
                    $.isNumeric( opt.duration ) && 
                    opt.duration > 0 
                ) ? opt.duration : defaults.duration;

            // 默认索引值
            let index = 
                ( 
                    $.isNumeric( opt.defaultIndex ) && 
                    opt.defaultIndex > 0 && 
                    opt.defaultIndex <= size - 1 
                ) ? parseInt( opt.defaultIndex ) : 0;

            /**
             *  1. 目标元素内有且必须只有一个子元素
             *  2. 目标元素内必须有图片容器
             *  3. 自定义的箭头控制器和圆点控制器不能放在目标元素内
             */
            // 
            if ( $wrapper.length !== 1 || !size ) {
                return;
            }

            $this.addClass( "hy-target" );
            $wrapper.addClass( "hy-wrapper" );
            $box.addClass( "hy-box" );
            
            // 设置宽高
            if ( $.isNumeric( opt.width ) && opt.width > 0 ) {
                $this.width( opt.width );
            }
            if ( $.isNumeric( opt.height ) && opt.height > 0 ) {
                $this.height( opt.height );
            }

            // 添加定位
            if ( $this.css( "position" ) === "static" ) {
                $this.addClass( "hy-relative" );
            }

            // slide 切换效果
            if ( opt.effect === "slide" ) {

                // 头尾添加元素
                size += 2;
                $wrapper
                    .prepend( $box.last().clone( true ) )
                    .append( $box.first().clone( true ) )
                    .width( `${ size * 100 }%` )
                    .addClass( "hy-slide" )
                    .css( "transform", `translate(-${ ( index + 1 ) * 100 / size }%, 0)` )
                    .children()
                    .width( `${ 100 / size }%` );
                if ( IE9 || IE10 ) {
                    $wrapper.removeClass( "hy-slide" ).children().css({
                        float: "left",
                        position: "relative"
                    }).height( $wrapper.height() );
                }
                if ( IE9 ) {
                    $this.find( ".hy-ie9-mark" ).remove();
                    $( "<div>" ).css({
                        textIndent: `${ -( index + 1 ) * 100 / size }%`,
                        display: "none"
                    }).addClass( "hy-ie9-mark" ).appendTo( $this );
                }
            }

            // fade 切换效果
            if ( opt.effect === "fade" ) {
                $wrapper.width( "100%" ).addClass( "hy-fade" );
                $box.eq( index ).addClass( "hy-fade-show" );
                const timer = window.setTimeout(() => {
                    $box.css( "transitionDuration", `${ duration }ms` );
                    window.clearTimeout( timer );
                }, 0);
            }

            // 箭头控制器
            let [ $prev, $next ] = [ $( "" ), $( "" ) ];
            if ( opt.arrow !== false ) {

                // 内置控制器
                if ( opt.arrow === true ) {
                    const arrow = `
                        <div class="hy-prev"><i></i></div>
                        <div class="hy-next"><i></i></div>
                    `;
                    $this.append( arrow );
                    $prev = $this.find( ".hy-prev" );
                    $next = $this.find( ".hy-next" );

                    if ( opt.arrowHoverShow ) {

                        // 默认隐藏控制器
                        // 当鼠标悬浮在目标容器上面时显示出来
                        $prev.add( $next ).addClass( "hy-hovershow" );
                    }
                }

                // 自定义控制器
                // 必须传入数组且包含两个元素
                if ( Array.isArray( opt.arrow ) && opt.arrow.length === 2 ) {
                    $prev = $( opt.arrow[ 0 ] );
                    $next = $( opt.arrow[ 1 ] );
                    $prev.add( $next ).addClass( "hy-custom-arrow" ).data( "happyImageID", ID );
                }
            }

            // 圆点控制器
            let [ $dotOuter, $dot ] = [ $( "" ), $( "" ) ];
            
            // 内置控制器
            if ( $.type( opt.dot ) === "boolean" ) {
                let _size = opt.effect === "slide" ? size - 2 : size;
                let dots = "";
                if ( typeof String.prototype.repeat === "function" ) {
                    dots = '<i></i>'.repeat( _size );
                } else {
                    for ( let i = 0; i < _size; i++ ) {
                        dots += '<i></i>';
                    }
                }
                $this.append( `<div class="hy-dot">${ dots }</div>` );
                $dotOuter = $this.find( ".hy-dot" );
                $dot = $dotOuter.children();
                $dotOuter.addClass( `hy-dot-${ opt.dotAlign }` );
                $dot.eq( index ).addClass( "active" );
                if ( opt.dot === false ) {
                    $dotOuter.hide();
                }
            }

            // 自定义控制器
            // 需要传入一个字符串选择器
            if ( $.type( opt.dot ) === "string" ) {
                $dotOuter = $( opt.dot ).first();
                $dot = $dotOuter.children();
                $dot.addClass( "hy-custom-dot" ).data( "happyImageID", ID );
            }
            

            // 动画标识
            let animated = false;

            // 切换函数
            function go ( i ) {
                if ( !animated ) {
                    animated = true;
                    if ( opt.effect === "fade" ) {
                        index = i;
                        if ( IE9 ) {
                            $box
                                .eq( i ).animate({ opacity: 1 }, duration)
                                .siblings()
                                .animate({ opacity: 0 }, duration, () => {
                                    animated = false;
                                })
                        } else {
                            $box
                                .eq( i )
                                .addClass( "hy-fade-show" )
                                .siblings()
                                .removeClass( "hy-fade-show" )
                                .on("transitionend", () => {
                                    animated = false;
                                });
                        }
                        dotStatus( i );
                        changeIsFunc && opt.onChange( i );
                    }
                    if ( opt.effect === "slide" ) {
                        if ( IE9 ) {
                            const $mark = $this.find( ".hy-ie9-mark" );
                            $mark.animate({
                                textIndent: `${ -100 / size * ( i + 1 ) }%`
                            }, {
                                step: now => {
                                    $wrapper.css( "transform", `translate(${ now }%, 0)` );
                                },
                                duration: duration,
                                complete: () => {
                                    animated = false;
                                    index = i;
                                    if ( index === size - 2 ) {
                                        const dis1 = `-${ 100 / size }%`;
                                        $wrapper.css( "transform", `translate(${ dis1 }, 0)` );
                                        $mark.css( "textIndent", dis1 );
                                        index = 0;
                                    }
                                    if ( index === -1 ) {
                                        const dis2 = `-${ 100 / size * ( size - 2 ) }%`;
                                        $wrapper.css( "transform", `translate(${ dis2 }, 0)` );
                                        $mark.css( "textIndent", dis2 );
                                        index = size - 3;
                                    }
                                }
                            });
                        } else {
                            $wrapper.css({
                                transitionDuration: `${ duration }ms`,
                                transform: `translate(-${ 100 / size * ( i + 1 ) }%, 0)`
                            }).on("transitionend", () => {
                                animated = false;
                                index = i;
                                $wrapper.off( "transitionend" ).css( "transitionDuration", "0s" );
                                if ( index === size - 2 ) {
                                    $wrapper.css( "transform", `translate(-${ 100 / size }%, 0)` );
                                    index = 0;
                                }
                                if ( index === -1 ) {
                                    $wrapper.css( "transform", `translate(-${ 100 / size * ( size - 2 ) }%, 0)` );
                                    index = size - 3;
                                }
                            })
                        }
                        dotStatus( i === size - 2 ? 0 : i );
                        if ( changeIsFunc ) {
                            let _i = i;
                            if ( _i === -1 ) {
                                _i = size - 3;
                            }
                            if ( _i === size - 2 ) {
                                _i = 0;
                            }
                            opt.onChange( _i );
                        }
                    }
                }
            }

            // 圆点控制器的状态
            function dotStatus ( index ) {
                $dot.eq( index ).addClass( "active" ).siblings().removeClass( "active" );
            }

            // 箭头控制器切换
            $next.on(ClickNS, () => {
                if ( !animated ) { 
                    index++;
                    if ( opt.effect === "fade" && index > size - 1 ) {
                        index = 0;
                    }
                    go( index );
                }
            })
            $prev.on(ClickNS, () => {
                if ( !animated ) { 
                    index--;
                    if ( opt.effect === "fade" && index < 0 ) {
                        index = size - 1;
                    }
                    go( index );
                }
            })

            // 圆点控制器切换
            $dotOuter.on(ClickNS, "i", function () { 
                if ( !animated && !$( this ).hasClass( "active" ) ) {
                    index = $( this ).index();
                    go( index );
                }
            })

            // 自动切换
            let timer = null;
            function fn () {
                index++;
                if ( opt.effect === "fade" && index > size - 1 ) {
                    index = 0;
                }
                go( index );
            };
            if ( $.isNumeric( opt.autoplay ) && opt.autoplay > duration ) {
                timer = window.setInterval( fn, ~~opt.autoplay );
                $this.on({
                    mouseenter: () => window.clearInterval( timer ),
                    mouseleave: () => {
                        timer = window.setInterval( fn, ~~opt.autoplay );
                    }
                });
            }
        })
    }

    // 销毁
    $.fn.destroyHappyImage = function () {
        return this.each(function () {
            const $this = $( this );
            const opt = $this.data( "happyImageOptions" );
            if ( $.isPlainObject( opt ) && !$.isEmptyObject( opt ) ) {
                const id = $this.data( "happyImageID" ); 
                $this.replaceWith( $this.data( "happyImageContent" ) );
                $( ".hy-custom-arrow, .hy-custom-dot" ).each(function () {
                    const _this = $( this );
                    if ( _this.data( "happyImageID" ) === id ) {
                        _this.removeData( "happyImageID" ).removeClass( "hy-custom-arrow hy-custom-dot" ).off( ClickNS );
                        _this.filter( ".hy-custom-dot" ).parent().off( ClickNS );
                    }
                })
            }
        })
    }
    
    // 自定义轮播控制器
    const HappyImage = window.HappyImage = ( elem, index ) => {
        const $elem = $( elem );
        const $dot = $elem.find( ".hy-dot i" );
        const data = $elem.data( "happyImageOptions" );
        if ( 
            $.isPlainObject( data ) && 
            !$.isEmptyObject( data ) && 
            $.isNumeric( index ) && 
            index >= 0 && 
            index < $dot.length &&
            $dot.filter( ".active" ).index() !== index 
        ) {
            $elem.find( ".hy-dot i" ).eq( index ).trigger( ClickNS );
        }
    }

});
