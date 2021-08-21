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
    showDeleteIcon: false, //显示图片右上角的删除icon
    showDeleteButton: true, //切换单个删除按钮
    show: false, // 是否显示删除半屏弹窗
    title: '', // 要删除的title
    desc: '', //删除的描述
    buttons: [{
        type: 'default',
        className: '',
        text: '取消',
        value: 0
      },
      {
        type: 'default',
        className: '',
        text: '确认',
        value: 1
      }
    ], // 删除/取消的按钮
    deleteCollectShopID: '', //要删除的shopID
    deleteAllCollect: false, //是否删除所有收藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goShowpic(e) {
    let shopID = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../showpic/showpic?shopID=${shopID}`,
    })
  },
  // 显示删除按钮
  showDeleteButton() {
    this.setData({
      showDeleteIcon: true,
      showDeleteButton: false
    })
  },
  // 隐藏删除按钮
  hideDeleteButton() {
    this.setData({
      showDeleteIcon: false,
      showDeleteButton: true
    })
  },
  // 获取收藏/历史数据的函数
  // table 必须是字符串 'collect' or 'history'
  async getCollectList(openID, table) {
    let collectListData = await request('/personal/collectlist', {
      openID,
      table,
    })
    if (table === "collect") {
      this.setData({
        collectList: collectListData.data
      })
    } else {
      this.setData({
        historyList: collectListData.data
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

  // 点击，切换到半屏弹窗，进一步操作删除
  showDeleteOneDialog(e) {
    this.setData({
      desc: '删除此条收藏？',
      deleteCollectShopID: e.currentTarget.dataset.shopid,
      title: e.currentTarget.dataset.title,
      show: true
    })
  },
  // 点击，切换到半屏弹窗，进一步操作删除
  showDeleteAllDialog() {
    this.setData({
      desc: '删除所有收藏？',
      title: '',
      deleteAllCollect: true,
      show: true
    })
  },
  // 半屏弹窗，真实删除单个收藏的语句
  async deleleCollect(e) {
    let deleteAllCollect = this.data.deleteAllCollect;
    if (e.detail.index === 0) {
      this.setData({
        deleteAllCollect: false,
        show: false
      });
      return;
    };
    let openID = appInstance.globalData.openID;
    if (deleteAllCollect === true) {
      // ???
    } else {
      let shopID = this.data.deleteCollectShopID;
      // 向服务端发送请求,更改数据库的collect表数据
      await request('/personal/collect', {
        openID,
        shopID
      }, 'POST');
    }

    this.setData({
      show: false
    });
    // 请求新收藏数据
    this.getCollectList(openID, "collect");
    // 告诉index界面，收藏数据有更新
    wx.setStorage({
      key: 'collect',
      data: true
    });
  },
  // 半屏弹窗，删除所有收藏
  deleteAll() {

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