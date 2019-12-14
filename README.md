# HappyImage 轮播图组件

### 版本
最新版：1.0.0

### 文件
`HappyImage.js`&nbsp;&nbsp;&nbsp;&nbsp;（18KB）（es6 语法）<br>
`HappyImage.min.js`&nbsp;（10KB）（es5 语法）

### 依赖

```jQuery``` （1.8.0 或以上版本）


### 兼容
Chrome, Firefox, Edge, Safari, IE9+


### 安装

引入 jQuery 和 HappyImage 文件

```html
<script src="jquery.min.js"></script>
<script src="happyimage.min.js"></script>
```

### 使用

```html
// 创建
$( selector ).HappyImage( options );

// 销毁
$( selector ).destroyHappyImage();

// 异步控制
HappyImage( selector, index );
```


### 示例

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>HappyImage</title>
        <style>
            #target { width:700px;height:300px;overflow:hidden;position:relative; }
            #target img { position:absolute;top:0;left:0;width:100%;height:100%; }
        </style>
    </head>
    <body>

        <div id="target">
            <div>
                <div><img src="1.jpg"></div>
                <div><img src="2.jpg"></div>
                <div><img src="3.jpg"></div>
                <div><img src="4.jpg"></div>
            </div>
        </div>
        
        <script src="jquery.min.js"></script>
        <script src="HappyImage.min.js"></script>
        <script>
            $( "#target" ).HappyImage();
        </script>

    </body>
</html>
```

### 配置
| 属性           | 说明                                                                                    | 类型             | 默认值 |
| -------------- | --------------------------------------------------------------------------------------- | ---------------- | ------ |
| width          | 容器宽度，可通过 css 设置，可以是 px 或 百分比                                                                                | Number / String / null    | null   |
| height         | 容器高度，可通过 css 设置，可以是 px 或 百分比                                                                                 | Number / String / null    | null   |
| effect         | 轮播图切换效果，可选值：fade / slide                                                    | String           | slide  |
| duration       | 轮播图切换动画的过渡时长，单位：ms                                                      | Number           | 700    |
| defaultIndex   | 默认索引                                                                                | Number           | 0      |
| arrow          | 箭头切换器。true 表示使用内置的箭头；false 则不显示箭头；如果传入数组（2个元素）表示使用自定义元素，如：[ "#prev", "#next" ] | Boolean / Array  | true   |
| dot            | 圆点切换器。true 表示使用内置的圆点；false 则不显示圆点；如果传入字符串选择器表示使用自定义圆点控制器，此选择器对应的元素的子元素就是圆点，如："#dot-wrapper"                                                                             | Boolean / String | true   |
| arrowHoverShow | 当鼠标悬浮在目标元素上时，才显示箭头切换器（只对内置箭头有效）                          | Boolean          | false  |
| dotAlign       | 圆点切换器的对齐方式，可选值：left / center / right                                     | String           | center |
| autoplay       | 自动播放的时间间隔，单位：ms，设置为 0 则关闭自动播放功能                                     | Number           | 0 |
| onChange       | 轮播图切换时执行的回调函数，参数是当前图片的索引                                     | Function           | 空函数 |

