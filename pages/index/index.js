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
    bottomShow: false, // 上拉，加载提示的显示
  },

  // [1] 获取轮播图数据的函数
  async getBannerList() {
    let {
      data: bannerList
    } = await request('/index/banner');

    this.setData({
      bannerList
    });
  },

  // [2] 获取tab标签数据的函数
  async getCategoryList(openID) {
    let {
      data: categoryList
    } = await request('/index/category');
    let selectID = categoryList[0].categoryID;
    this.setData({
      categoryList,
      selectID,
    });

    // [3]获取商品区图片
    this.getShopList(selectID, openID);
  },

  // [3] 获取商品区图片的函数，
  async getShopList(categoryID, openID) {
    let oldShopList = this.data.shopList;
    let offset = oldShopList.length || 0; // 数值原来长度，返给后端，告诉后端查询后面的数据
    let shopListData = await request('/index/shop', {
      categoryID,
      offset,
      openID
    });

    // TODO: 目前对mysql数据库不熟悉
    // shop表格中，有一项tags列，值是字符串，例子："铜门,热销"
    // 需要手动转为数组
    let newShopList = shopListData.data.map(item => {
      item.tags = item.tags.split(',');
      return item;
    })
    this.setData({
      shopList: oldShopList.concat(newShopList),
      bottomShow: false
    })
  },

  // [5] 切换收藏状态
  switchCollect(e) {
    let _index = e.currentTarget.dataset.index;
    let _shopList = this.data.shopList;
    let openID = instance.globalData.openID;
    let shopID = _shopList[_index].shopID;
    _shopList[_index].isCollected = !_shopList[_index].isCollected;
    // 更改本地的shopList数据
    this.setData({
      shopList: _shopList,
    })
    // 向服务端发送请求,更改数据库的collect表数据
    console.log('请求服务端的data数据：', openID, shopID);
    request('/personal/collect', {
      openID,
      shopID
    }, 'POST')
  },

  // 点击门类标签，切换
  switchCategory(event) {
    let newSelectID = event.currentTarget.dataset.categoryid;
    let odlSelectID = this.data.selectID;
    let openID = instance.globalData.openID;
    if (newSelectID === odlSelectID) {
      return;
    }
    this.setData({
      selectID: newSelectID,
      shopList: []
    })
    this.getShopList(newSelectID, openID);
  },
  // 点赞
  async switchDianzan(e) {
    let _index = e.currentTarget.dataset.index;
    let oldShopList = this.data.shopList;
    let shopID = oldShopList[_index].shopID;
    let openID = instance.globalData.openID;
    // 本地更改是否已经点赞
    oldShopList[_index].isDianzan = !oldShopList[_index].isDianzan;
    this.setData({
      shopList: oldShopList
    })
    let dianzanCount = await request('/personal/dianzan', {
      shopID,
      openID
    }, 'POST', );
    // 接受后端返回的点赞数量，重新更新数据
    oldShopList[_index].dianzan = dianzanCount.data;
    this.setData({
      shopList: oldShopList
    })

  },

  // 跳转到showpic界面
  goShowPic(e) {
    let shopID = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: `../showpic/showpic?shopID=${shopID}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // [1] 发起请求，获取轮播图数据
    this.getBannerList();

    // 判断是否登录。
    // TODO:需要对openID和时间戳加密后，再保存到缓存

    // 从storage取login信息
    let loginInfo = wx.getStorageSync('loginInfo');
    if (loginInfo) { // 存在登录信息
      let oldTimeStamp = loginInfo.timeStamp;
      let diff = Date.now() - oldTimeStamp;
      if (diff < 259200000) { // 且距离上次登录少于3天
        let openID = loginInfo.openID;
        instance.globalData.openID = openID;
        this.getCategoryList(openID);
        wx.setStorage({
          key: 'loginInfo',
          data: {
            openID: openID,
            timeStamp: Date.now(),
          }
        });
        return;
      }
    }
    // 发起登录请求
    wx.login({
      success: async res => {
        if (res.code) {
          let loginData = await request('/login', {
            code: res.code
          });
          let openID = loginData.data.openid;
          instance.globalData.openID = openID;
          wx.setStorage({
            key: 'loginInfo',
            data: {
              openID: openID,
              timeStamp: Date.now(),
            }
          });

          //[2] 获取tab标签数据
          this.getCategoryList(openID);
        }
      }
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
    // personal界面更新了收藏数据,这边index界面也要重新更新
    //这里判断storage的collect长度Lengt判断
    let collect = wx.getStorageSync('collect');
    if (collect && collect === true) {
      let openID = instance.globalData.openID;
      let categoryID = this.data.selectID;
      this.setData({
        shopList: [] // 重置
      })
      this.getShopList(categoryID, openID);
      wx.setStorageSync('collect', false); //重置
    }
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
  onShareAppMessage: function (e) {
    console.log(e)
    let picUrl = e.target.dataset.picurl;
    return {
      title: "门博士",
      imageUrl: picUrl
    }
  },
  onShareTimeline: function () {
    return {
      title: "门博士",
    }
  }
})