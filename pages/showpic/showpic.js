// pages/showpic/showpic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData: {
      "urlList": [
        "https://mbsdoor.com:5000/static/image/showpic/shop100001-1.jpg",
        "https://mbsdoor.com:5000/static/image/showpic/shop100001-2.jpg",
        "https://mbsdoor.com:5000/static/image/showpic/shop100001-3.jpg",
        "https://mbsdoor.com:5000/static/image/showpic/shop100001-4.jpg",
        "https://mbsdoor.com:5000/static/image/showpic/shop100001-5.jpg",
        "https://mbsdoor.com:5000/static/image/showpic/shop100001-6.jpg"
      ],
      "shopDetail": {
        "shopID": "shop_100001",
        "publishdate": "2021-08-20",
        "color": " 红古铜色 ",
        "material": "紫铜板",
        "category": "欧式臻品",
        "type": "四开门"
      },
      "isDianzan": true,
      "dianzanCount": 1,
      "isCollected": true,
      "shopList": {
        "shopID": "shop_100001",
        "categoryID": 10001,
        "picUrl": "https://mbsdoor.com:5000/static/image/shop/1.jpg",
        "des": "中式臻品系列是设计师在追根溯源中逐渐恢复东方文化的自信，学会扬弃，在寻找中国传统文化的同时，吸纳了西方现代学的精髓创造了真正属于中国人的新中式生活",
        "isFull": 0,
        "tags": "热销,铜门",
        "title": "DR-A004梅兰竹菊"
      }
    },
    goZoom: true, //
    currentIndex: 0, //指定轮播图的播放的图片index
    currentPicUrl: '', //全屏时，图片地址
    distance: 0, //缩放功能，手指移动的距离
    scale: 1, //缩放功能，缩放比例
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
    }

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
    console.log('start-->长度', e.touches.length)
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
    let distance = this.calcDistance(e.touches[0], e.touches[1]);
    this.setData({
      distance
    })
  },
  // 触摸过程
  touchmoveCallback(e) {
    console.log('move-->长度', e.touches.length)
    if (e.touches.length === 1) {
      let scale = this.data.scale;
      if (scale <= 1) {
        return;
      }
      // console.log('move进入单手触摸')
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
    // 缩放功能
    let moveDistance = this.calcDistance(e.touches[0], e.touches[1]);
    let diffDistance = moveDistance - this.data.distance;
    let newScale = this.data.scale + 0.005 * diffDistance; // 0.005可以调节
    if (newScale > 4) {
      newScale = 4; // 最大放大倍速
    }
    if (newScale < 0.25) {
      newScale = 0.25; // 最小缩放倍数
    }
    this.setData({
      scale: newScale,
      distance: moveDistance
    })
  },
  // 触摸结束
  touchendCallback(e) {
    console.log('end-->长度', e.touches.length)
    if (e.touches.length > 1) {
      return;
    }

    if (e.touches.length === 1) {
      // 双指-->单指，然后可能会移动需求
      this.setData({
        startPos: {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        }
      });
    }


    let scale = this.data.scale;
    // console.log('end-->缩小回弹为1')
    // console.log('end-->length:', e.touches.length)
    // 缩小回弹
    if (scale < 1) {
      this.setData({
        scale: 1,
        transitionPos: {
          x: 0,
          y: 0
        }
      })
    }
  },
  switchHalfScreen(e) {
    console.log('tap-->长度', e.touches.length)
    let timeStamp = this.data.timeStamp;
    let newTimeStamp = e.timeStamp;
    // 有move过程大于200ms时不触发tap
    if (newTimeStamp - timeStamp > 200) {
      return;
    }
    // TODO: 这里的点击有时touches.length是0，还存在疑问;正常永远都是1
    this.setData({
      goZoom: !this.data.goZoom,
      scale: 1,
      currentIndex: this.data.currentIndex,
      transitionPos: {
        x: 0,
        y: 0
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 获取当前窗口的宽高
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
  },

  // 外围的点击tap切换事件
  handleTap(e) {
    let currentPicUrl = e.currentTarget.dataset.url || '';
    let currentIndex = e.currentTarget.dataset.index || 0;
    this.setData({
      goZoom: !this.data.goZoom,
      currentPicUrl,
      currentIndex
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})