// pages/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [
      ['深圳南山', '中山'],
      ['东莞凤岗', '梅州兴宁'],
      ['香港', '深圳龙岗'],
      ['深圳坪山', '梅州五华'],
      ['河源', '惠州仲恺'],
      ['河源', '惠州仲恺'],
      ['河源', '惠州仲恺']
    ],
    animate: false,
    isShow: false, //图片浏览组件-->控制显影
    picUrl: '', //图片浏览组件-->图片地址
    initSize: {
      width: 150,
      height: 150,
      top: 0,
      left: 0
    }, //图片浏览组件-->图片元素显示的大小，单位rpx
    pageScrollTop: 0, //页面在垂直方向已滚动的距离（单位px）

  },
  search: function (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{
          text: '搜索逻辑待定',
          value: 1
        }, {
          text: '待做',
          value: 2
        }])
      }, 200)
    })
  },
  // 点击搜索内的值
  selectResult(e) {
    console.log(e);
  },
  getClientPos(e) {
    console.log("触摸开始", e)
  },
  goFullScreen(e) {
    console.log(e);

    let initSize = {
      left: e.currentTarget.offsetLeft,
      top: e.currentTarget.offsetTop - this.data.pageScrollTop,
      width: 150,
      height: 150
    };
    this.setData({
      initSize,
      isShow: true,
      picUrl: e.currentTarget.dataset.pictureurl
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //搜索框的值
    this.setData({
      search: this.search.bind(this)
    })
  },
  onPageScroll(e) {
    console.log(e)
    this.setData({
      pageScrollTop: e.scrollTop //TODO:极其损耗内存，不建议这样做
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

  },

})