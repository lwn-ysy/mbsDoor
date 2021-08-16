// pages/index/index.js
import request from '../../utils/request';
let instance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //轮播图数据
    categoryList: [], //门类标签数据
    selectID: 10001, //当前选中的标签,number类型
    shopList: [], //图片区域数据
    collectedList: [], //控制是否收藏的
    bottomShow: false, // 上拉，加载提示的显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // [1] 发起请求，获取轮播图数据
    this.getBannerList();

    //[2] 获取tab标签数据
    this.getCategoryList();
  },
  // [1] 获取轮播图数据的函数
  async getBannerList() {
    let bannerListsData = await request('/index/banner');

    this.setData({
      bannerList: bannerListsData.data
    });
  },

  // [2] 获取tab标签数据的函数
  async getCategoryList() {
    let categoryListData = await request('/index/category');
    let categoryList = categoryListData.data;
    let selectID = categoryListData.data[0].categoryID;
    this.setData({
      categoryList,
      selectID,
    });

    // [3]获取商品区图片
    this.getShopList(selectID);
  },

  // [3] 获取商品区图片的函数，
  async getShopList(selectID) {

    // [4] 从缓存storage获取collect用户收藏数据
    this.getCollectFromStorage();


    let oldShopList = this.data.shopList;
    let offset = oldShopList.length || 0; // 数值原来长度，返给后端，告诉后端查询后面的数据
    let shopListData = await request('/index/shop', {
      categoryID: selectID,
      offset
    });

    // TODO: 目前对mysql数据库不熟悉
    // shop表格中，有一项tags列，值是字符串，例子："铜门,热销"
    // 需要手动转为数组
    let newShopList = shopListData.data.map(item => {
      item.tags = item.tags.split(',');
      // 增加是否已收藏的数据
      item.collect = this.data.collectedList.includes(item.shopID);
      return item;
    })
    this.setData({
      shopList: oldShopList.concat(newShopList),
      bottomShow: false
    })
  },
  // [4] 从storage加载collectedList的函数
  // 有问题，万一用户一次进来，app.js比较慢获取到colletedlist
  getCollectFromStorage() {
    let collectedList = wx.getStorageSync('collect');
    this.setData({
      collectedList: collectedList
    })
  },
  // [5] 切换收藏状态
  async switchCollect(e) {
    let _index = e.currentTarget.dataset.index;
    let _shopList = this.data.shopList;
    let openID = instance.globalData.openID;
    let shopID = _shopList[_index].shopID;
    _shopList[_index].collect = !_shopList[_index].collect;
    // 更改本地的shopList数据
    this.setData({
      shopList: _shopList,
    })
    // 向服务端发送请求,更改数据库的collect表数据
    console.log('请求服务端的data数据：', openID, shopID);
    let collectedListDta = await request('/personal/collect', {
      openID,
      shopID
    }, 'POST')
    this.setData({
      collectedList: collectedListDta.data
    });
    wx.setStorage({
      key: 'collect',
      data: collectedListDta.data
    });
    console.log('后端重新传送的：', collectedListDta.data)
  },
  // 点击门类标签，切换
  switchCategory(event) {
    let newSelectID = event.currentTarget.dataset.categoryid;
    let odlSelectID = this.data.selectID;
    if (newSelectID === odlSelectID) {
      return;
    }
    this.setData({
      selectID: newSelectID,
      shopList: []
    })
    this.getShopList(newSelectID);
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
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      bottomShow: true
    })
    this.getShopList(this.data.selectID);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "邀请好友一起，享优惠活动！",
    }
  },
  onShareTimeline: function () {
    return {
      title: "门博士，为你定制，专属门！",
    }
  }
})