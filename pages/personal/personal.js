// pages/personal/personal.js
import request from '../../utils/request';
let appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户个人信息，包括头像和昵称
    isLogin: false, //用户是否已登录
    collectList: [], //收藏
    historyList: [], //历史
    goDelete: true, //切换删除的真实按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取收藏/历史数据的函数
  // table 必须是字符串 'collect' or 'history'
  async getCollectList(openID, table) {
    let collectListData = await request('/personal/collectlist', {
      openID,
      table,
    })
    let collectList = collectListData.data.map(e => {
      e.goDelete = true;
      return e;
    })
    if (table === "collect") {
      this.setData({
        collectList: collectList
      })
    } else {
      this.setData({
        historyList: collectList
      })
    }


  },

  // 点击button，获取用户头像和昵称
  getUserProfile() {
    wx.getUserProfile({
      desc: '登录获取用户的头像和昵称',
      success: (res) => {
        console.log("getUserProfile:", res);
        this.setData({
          userInfo: res.userInfo,
          isLogin: true
        })
      }
    })
  },

  // 点击，切换到真实的删除按钮
  switchDelete(e) {
    let _index = e.currentTarget.dataset.index;
    let oldCollectList = this.data.collectList;
    oldCollectList[_index].goDelete = !oldCollectList[_index].goDelete;
    this.setData({
      collectList: oldCollectList
    })
  },
  // 切换 收藏
  // TODO: 这里跟index.js的switchCollect函数功能差不多，后期可以考虑优化
  switchCollect(e) {
    let _index = e.currentTarget.dataset.index;
    let _collectList = this.data.collectList;
    let openID = appInstance.globalData.openID;
    let shopID = _collectList[_index].shopID;
    _collectList.splice(_index, 1);
    // 更改本地的collectList数据
    this.setData({
      collectList: _collectList,
    })
    // 向服务端发送请求,更改数据库的collect表数据
    request('/personal/collect', {
      openID,
      shopID
    }, 'POST')
    wx.setStorage({
      key: 'collect',
      data: true
    });
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
    let openID = appInstance.globalData.openID;
    this.getCollectList(openID, "collect");
    this.getCollectList(openID, "history");
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
  onShareAppMessage: function (option) {
    let imageUrl = option.target.dataset.url;
    let title = option.target.dataset.title || "设置title";
    return {
      title: title,
      imageUrl: imageUrl,
    }
  }
})