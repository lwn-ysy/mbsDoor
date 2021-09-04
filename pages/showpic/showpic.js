// pages/showpic/showpic.js
import request from '../../utils/request';
let appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData: {},
    goZoom: { // 控制动画
      inAnimate: false,
      outAnimate: false
    }, //
    _hidden: true,
    currentPicUrl: '', //全屏时，图片地址
    lastDistance: 0, //缩放功能，上次的两手指距离
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
    },
    isloading: true, //控制加载组件

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
    this.setData({
      timeStamp: e.timeStamp // 辅助工具，辨别真的的tap事件，而不是touch触摸接受后导致的tap
    })
    if (e.touches.length === 1) {
      // console.log('start-->单手指，移动功能')
      this.setData({
        startPos: {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        }
      })
      return;
    }
    // 缩放功能
    this.setData({
      lastDistance: this.calcDistance(e.touches[0], e.touches[1])
    })
  },
  // 触摸过程
  touchmoveCallback(e) {
    // 1. 单手指触摸移动功能
    if (e.touches.length === 1) {
      let scale = this.data.scale;
      if (scale <= 1) { //没放大，不移动
        return;
      }
      let {
        clientValue,
        transitionPos,
        startPos
      } = this.data
      let distanceX = e.touches[0].clientX - startPos.x;
      let distanceY = e.touches[0].clientY - startPos.y;
      let x = transitionPos.x + distanceX;
      let y = transitionPos.y + distanceY;
      // TODO: 有待研究，计算临界值,
      // let limitX = clientValue.x / scale;
      let limitX = (scale - 1) * clientValue.x / 2 / scale ;
      console.log("临界值", limitX)
      // console.log('临界值x：', limitX)
      let limitY = (scale - 1) * clientValue.y / scale / 2;
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
    let scale = this.data.scale;
    let nowDistance = this.calcDistance(e.touches[0], e.touches[1])
    let diffDistance = nowDistance - this.data.lastDistance;
    if (scale > 3) {
      scale += 0.001 * diffDistance
    } else if (scale < 0.5) {
      scale += 0.0005 * diffDistance
    } else {
      scale += 0.005 * diffDistance; // 老版本线性曲线
    }

    this.setData({
      scale,
      lastDistance: nowDistance
    })
    console.log("缩放结束后缩放倍数：", this.data.scale)
  },
  // 触摸结束
  touchendCallback(e) {
    if (e.touches.length > 1) {
      return; // 还有大于两只手指在屏幕上
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

    //触摸接受后，做一些数据重置操作
    let {
      scale,
    } = this.data;
    // 缩放回弹
    if (scale > 3) {
      scale = 3; // 最大放大倍速
      this.setData({
        // 缩放功能的数据重置
        scale,
      })
    }
    if (scale < 1) {
      scale = 1; // 最小缩放倍数
      this.setData({
        // 缩放功能的数据重置
        scale,
        //单指滑动的数据重置
        transitionPos: {
          x: 0,
          y: 0
        }
      })
    }
  },
  switchHalfScreen(e) {
    let timeStamp = this.data.timeStamp;
    let newTimeStamp = e.timeStamp;
    // 有move过程大于200ms时不触发tap
    if (newTimeStamp - timeStamp > 200) {
      return;
    }
    // TODO: 这里的点击有时touches.length是0，还存在疑问;正常永远都是1

    let goZoom = this.data.goZoom;
    goZoom.inAnimate = false;
    goZoom.outAnimate = true;
    this.setData({
      goZoom,
      scale: 1,
      transitionPos: {
        x: 0,
        y: 0
      }
    })
  },
  // 外围的点击tap切换事件
  handleTap(e) {
    let currentPicUrl = e.currentTarget.dataset.url || '';
    // let currentIndex = e.currentTarget.dataset.index || 0;
    let goZoom = this.data.goZoom;
    goZoom.inAnimate = true;
    goZoom.outAnimate = false;
    this.setData({
      _hidden: true,
      currentPicUrl,
    })
    // this.setData({
    //   goZoom,
    //   _hidden: false,
    //   currentIndex,
    // })
  },
  // 图片加载完成，才触发动画，避免晃动的作用
  imgLoaded() {
    let goZoom = this.data.goZoom;
    goZoom.inAnimate = true;
    goZoom.outAnimate = false;
    this.setData({
      goZoom,
      _hidden: false,
      // currentIndex,
    })
  },
  // 动画结束后，重置url,后面才能再次触发imgLoad
  animationendHandle(e) {
    if (e.detail.animationName === "scale-out-top") {
      this.setData({
        currentPicUrl: ''
      });
      return;
    }
  },
  // 点赞操作
  async switchDianzan(e) {
    let oldShopData = this.data.shopData;
    let shopID = this.data.shopData.shopList.shopID;
    let openID = appInstance.globalData.openID;
    // 本地更改是否已经点赞
    oldShopData.isDianzan = !oldShopData.isDianzan;
    if (oldShopData.isDianzan === true) {
      wx.vibrateShort({
        type: 'medium',
      })
      oldShopData.dianzanGif = true;
    } else {
      oldShopData.dianzanGif = false;
    }
    this.setData({
      shopData: oldShopData
    })
    let dianzanCount = await request('/personal/dianzan', {
      shopID,
      openID
    }, 'POST', );
    // 接受后端返回的点赞数量，重新更新数据
    oldShopData.dianzanCount = dianzanCount.data;
    this.setData({
      shopData: oldShopData
    })
    //告诉index界面，数据有更新
    wx.setStorageSync('collect', true);
  },
  // 收藏操作
  switchCollect(e) {
    let oldShopData = this.data.shopData;
    let shopID = this.data.shopData.shopList.shopID;
    let openID = appInstance.globalData.openID;
    oldShopData.isCollected = !oldShopData.isCollected;
    // 更改本地的shopList数据
    this.setData({
      shopData: oldShopData,
    })
    // 向服务端发送请求,更改数据库的collect表数据
    request('/personal/collect', {
      openID,
      shopID
    }, 'POST');

    //告诉index界面，数据有更新
    wx.setStorageSync('collect', true);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
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
    // 获取初始data
    let shopID = options.shopID;
    let openID = appInstance.globalData.openID;
    let {
      data: shopData
    } = await request('/showpic/shop', {
      shopID,
      openID
    })
    shopData.dianzanGif = false;
    this.setData({
      shopData
    })
  },
  hideLoading(e) {
    let _index = e.currentTarget.dataset.index;
    if (_index !== 0) {
      return;
    }
    this.setData({
      isloading: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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