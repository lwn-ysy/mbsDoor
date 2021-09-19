# 微信小程序--mbsDoor
这是微信小程序项目，对应mbsdoorServer项目是自己写的服务端，挂在腾讯云服务器中。

##### 门博士项目系列：

[后台--管理系统](https://github.com/lwn-ysy/mbsdoor-frontBack)

[后端服务器](https://github.com/lwn-ysy/mbsdoorServer)

##### 封装全屏预览图片组件，遇到使用wx:if 控制图片切换，会出现闪屏

```
<!-- 1.  浏览界面，图片是缩小的 -->
<view wx:if="{{isFullScreen}}">
  <image src="example.png"></image>
</view>
<!-- 2. 全屏界面，缩放和移动功能 -->
<view wx:else>
  <image src="example.png" bindload="imgLoaded"></image>
</view>
```

原因：虽然是同一张图片、且已缓存，但切换时加载解析图片url，会耗时>16ms,导致这期间是空白界面，然后图片显示

解决方案:

* 在图片url解析加载完成后，才切换显示(即跳过空白阶段)-->bindload事件可以监听图片加载完成，
* 不重新加载解析图片，改变样式
* 添加过渡/动画(淡进淡出)，从视觉方面来混淆

我是采用了第一种方法,bindload监听图片加载成功后，设置isFullScreen=false，切换到图片全屏界面显示。



##### 封装全屏预览图片组件，双手触摸touchemove过程，总是莫名其妙触发tap事件

刚开始不知道微信有wx.previewImage全屏预览图片API，就想自己写一个组件，带有缩放和移动功能。

然后遇到bug，触摸move过程中，莫名其妙会触发tap事件（退出全屏），就自己研究了下,微信端的触摸事件:

正常过程：

touchstart --> (longtap) --> (touchmove) --> (longtap) --> touchend --> tap

主要研究何时会触发tap事件，

1.快速单手点击一下情况下，会触发tap事件：

* touchstart --> touchend --> tap   这是我正常想要的tap

2.单手点击后移动，然后结束移动，停顿，松手，会触发tap事件：

* touchstart --> touchmove --> longtap --> touchend --> tap 不是我想要的tap（退出全屏），这应是移动或者缩放的功能

3.单手点击，停顿，松手，会触发tap事件：

* touchstart --> longtap --> touchend --> tap  不是我想要的tap退出全屏，



针对2和3情况的解决方案：

touchstart 开始时，记录一个startTimeStamp时间戳，tap开始时，记录一个tapTimeStamp时间戳，

```
// touchstart手指开始触摸时
  touchstartCallback(e) {
    this.setData({
      startTimeStamp: e.timeStamp // 辅助工具，区分想要的tap事件，而不是longtaop后触发的tap
    })
    ...
  }
 
 // tap手指点击事件
 tapCallback(e) {
    let startTimeStamp = this.data.startTimeStamp;
    let tapTimeStamp = e.timeStamp;
    // 有move or longtap过程大于200ms时不触发tap
    if (tapTimeStamp - startTimeStamp > 200) {
      return;
    }
    ...
  }
```



##### 微信小程序模板语法的限制

模板使用Mustache 语法（双大括号），只能进行一些简单的运算；类似vue，但vue更强大，能运行js表达式

```
微信小程序
// 组件属性
<view id="item-{{id}}"> </view>
// 控制属性
<view wx:if="{{condition}}"> </view>
// 关键字
<checkbox checked="{{false}}"> </checkbox>
// 三元运算
<view hidden="{{flag ? true : false}}"> Hidden </view>
// 算数运算
<view> {{a + b}} + {{c}} + d </view>
// 逻辑判断
<view wx:if="{{length > 5}}"> </view>
// 字符串运算
<view>{{"hello" + name}}</view>
// 数据路径运算
<view>{{object.key}} {{array[0]}}</view>
// 数组组合
<view wx:for="{{[zero, 1, 2, 3, 4]}}"> {{item}} </view>
// 对象组合
<template is="objectCombine" data="{{for: a, bar: b}}"></template>

vue
// 除以上，还可运算更强大的js表达式
<div :aa="'abc'.includes('a')"></div>

```

