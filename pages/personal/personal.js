// pages/personal/personal.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectList: [], //收藏
    historyList: [], //历史
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollectList("linweinan666", "collect");
    this.getCollectList("linweinan666", "history");
  },
  // 获取收藏/历史数据的函数
  // table 必须是字符串 'collect' or 'history'
  async getCollectList(userID, table) {
    let collectListData = await request('/personal/collect', {
      userID,
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
  onShareAppMessage: function (option) {
    let imageUrl = option.target.dataset.url;
    let title = option.target.dataset.title || "设置title";
    return {
      title: title,
      imageUrl: imageUrl,
    }
  }
})