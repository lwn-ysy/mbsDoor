// components/galary/galary.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    picUrl: {
      type: String,
      value: ''
    },
    isShow: {
      type: Boolean,
      value: false
    },
    initSize: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgHeight: 0, //图片初始化高度
    distance: 7, //缩放功能，手指移动总共距离,初始值为 => Math.pow(logNumber,scale)
    lastDistance: 0, //缩放功能，上次的两手指距离
    scale: 1, //缩放功能，缩放比例
    logNumber: 7, //缩放功能，固定常量，缩放log曲线的底数log20
    timeStamp: '', //tap功能，触摸的时间轴,用来确认是tap事件，区分touch
    transitionPos: { //移动功能, 实际要移动的距离
      x: 0,
      y: 0
    },
    startPos: { // 移动功能，初始位置
      x: 0,
      y: 0
    },
    clientValue: { // 设备窗口值
      x: 0,
      y: 0
    },
    bgc: '' //背景色
  },

  /**
   * 组件的方法列表
   */
  methods: {
    imgLoad(e) {
      setTimeout(() => {
        this.setData({
          // imgHeight: (750 / e.detail.width) * e.detail.height
          initSize: {
            width: 750,
            height: this.data.clientValue.y * 750 / this.data.clientValue.x,
            top: 0,
            left: 0
          }
        })
      })

    },
    // 辅助性，计算平方根的距离
    calcDistance(pos0, pos1) {
      let xMove = pos1.clientX - pos0.clientX;
      let yMove = pos1.clientY - pos0.clientY;
      return (Math.sqrt(xMove * xMove + yMove * yMove));
    },
    // 图片的像素最好在500px以上
    // 手指开始触摸时
    touchstartCallback(e) {
      let timeStamp = e.timeStamp; // 辅助工具，辨别真的的tap事件，而不是touch触摸接受后导致的tap
      this.setData({
        timeStamp
      })
      if (e.touches.length === 1) {
        // console.log('start-->单手指，移动功能')
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        this.setData({
          startPos: {
            x,
            y
          }
        })
        return;
      }
      // 缩放功能
      // console.log('start-->缩放功能');
      this.setData({
        lastDistance: this.calcDistance(e.touches[0], e.touches[1])
      })
    },
    // 触摸过程
    touchmoveCallback(e) {
      // 1. 单手指触摸移动功能
      if (e.touches.length === 1) {
        let scale = this.data.scale;
        if (scale <= 1) {
          return;
        }

        let clientValue = this.data.clientValue;
        let transitionPos = this.data.transitionPos;
        let startPos = this.data.startPos;
        let distanceX = e.touches[0].clientX - startPos.x;
        let distanceY = e.touches[0].clientY - startPos.y;
        let x = transitionPos.x + distanceX;
        let y = transitionPos.y + distanceY;
        // TODO: 有待研究，计算临界值,
        let limitX = (scale - 1) * clientValue.x / scale;
        // console.log('临界值x：', limitX)
        let limitY = (scale - 1) * clientValue.y / scale;
        // console.log('临界值y：', limitY)

        if (x > limitX) {
          x = limitX;
        }
        if (x < -limitX) {
          x = -limitX;
        }
        if (y > limitY) {
          y = limitY;
        }
        if (y < -limitY) {
          y = -limitY;
        }
        this.setData({
          transitionPos: {
            x: x,
            y: y
          },
          startPos: {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          }
        })
        return;
      }
      // 2. 缩放功能
      let x = this.data.logNumber; // log函数的底数
      let moveDistance = this.calcDistance(e.touches[0], e.touches[1]);
      let diffDistance = moveDistance - this.data.lastDistance;
      let distance = this.data.distance;
      distance += diffDistance;

      // let newScale = this.data.scale + 0.005 * diffDistance; // 老版本线性曲线
      let scale = 0;
      if (distance >= x) {
        scale = Math.log(distance) / Math.log(x); // 新版本曲线，对数
      } else if (-x < distance && distance < x) {
        scale = 1;
      } else {
        scale = 1 / (Math.log(Math.abs(distance)) / Math.log(x));
      }
      this.setData({
        scale,
        distance,
        lastDistance: moveDistance
      })
    },
    // 触摸结束
    touchendCallback(e) {
      // 还有大于两只手指在屏幕上
      if (e.touches.length > 1) {
        return;
      }
      // 双指-->单指，然后可能会移动需求
      if (e.touches.length === 1) {
        this.setData({
          startPos: {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          }
        });
      }

      //触摸接受后，做一些数据重置操作
      let {
        scale,
        logNumber
      } = this.data;
      // 缩放回弹
      if (scale > 3.2) {
        scale = 3.2; // 最大放大倍速
        this.setData({
          // 缩放功能的数据重置
          scale,
          // 有问题，如果distance介于-20< x <20,之间，是不需要重置的
          distance: Math.pow(logNumber, scale),
        })
      }
      if (scale < 1) {
        scale = 1; // 最小缩放倍数
        this.setData({
          // 缩放功能的数据重置
          scale,
          // 有问题，如果distance介于-20< x <20,之间，是不需要重置的
          distance: Math.pow(logNumber, scale),
          //单指滑动的数据重置
          transitionPos: {
            x: 0,
            y: 0
          }
        })
      }
    },
    backToOuter(e) {
      console.log('点击了图片');
      let timeStamp = this.data.timeStamp;
      let newTimeStamp = e.timeStamp;
      // 有move过程大于200ms时不触发tap
      if (newTimeStamp - timeStamp > 200) {
        return;
      }
      // TODO: 这里的点击有时touches.length是0，还存在疑问;正常永远都是1

      // let goZoom = this.data.goZoom;
      // goZoom.inAnimate = false;
      // goZoom.outAnimate = true;
      this.setData({
        // goZoom,
        scale: 1,
        distance: Math.pow(this.data.logNumber, 1),
        transitionPos: {
          x: 0,
          y: 0
        },
        isShow: false,
        bgc: ""
      })
    },
    transitionendCallback() {
      this.setData({
        bgc: "#010101"
      })
    }
  },
  pageLifetimes: {
    show() {
      wx.getSystemInfo({
        success: (result) => {
          this.setData({
            clientValue: {
              x: result.windowWidth,
              y: result.windowHeight
            }
          })
        },
      })
    }
  }
})