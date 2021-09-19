// pages/show/show.js
import request from '../../utils/request';

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
    lists: [], // blog数据
    bottomShow:true,//loading组件

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
  async getData() {
    let offset = this.data.lists.length || 0;
    let {
      data: lists
    } = await request('/blog', {
      offset
    });
    lists = this.data.lists.concat(lists)
    this.setData({
      lists,
      bottomShow: false
    })
  },
  // 点击搜索内的值
  selectResult(e) {
    console.log(e);
  },
  getClientPos(e) {
    console.log("触摸开始", e)
  },
  goPreviewImage(e) {
    if (!e.target.id) {
      return;
    }
    wx.previewImage({
      current: e.currentTarget.dataset.imgurls[e.target.id],
      urls: e.currentTarget.dataset.imgurls,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //搜索框的值
    this.setData({
      search: this.search.bind(this)
    });
    this.getData()
  },
  onPageScroll() {},
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
    this.setData({
      bottomShow: true
    });
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})