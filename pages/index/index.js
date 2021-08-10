// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerLists: [{
      title: '优惠活动',
      picUrl: '/static/image/banner/1.jpg'
    }, {
      title: '上新',
      picUrl: '/static/image/banner/2.jpg'
    }, {
      title: '优惠活动',
      picUrl: '/static/image/banner/3.jpg'
    }, ], //轮播图数据
    categoryList: [{
        doorCategoryID: 10001,
        title: '中式臻品',
        englishTitle: 'Gate'
      },
      {
        doorCategoryID: 10002,
        title: '欧式臻品',
        englishTitle: 'Room'
      },
      {
        doorCategoryID: 10003,
        title: '匠心臻品',
        englishTitle: 'Kitchen'
      },
      {
        doorCategoryID: 10004,
        title: '卓越臻品',
        englishTitle: 'Balcony '
      },
      {
        doorCategoryID: 10006,
        title: '新品',
        englishTitle: 'Balcony '
      },
      {
        doorCategoryID: 10007,
        title: '热门',
        englishTitle: 'Balcony '
      },
    ], //门类标签数据
    selectID: 10001, //当前选中的标签
    shopList: [{
      picID:1,
      picUrl: '/static/image/shop/1.jpg',
      des:'中式臻品系列是设计师在追根溯源中逐渐恢复东方文化的自信，学会扬弃，在寻找中国传统文化的同时，吸纳了西方现代学的精髓创造了真正属于中国人的新中式生活',
      tag:['铜门','热销'],
      isFull:false,//是否占一栏
    },
    {
      picID:2,
      picUrl: '/static/image/shop/1.jpg',
      des:'中式臻品系列是设计师在追',
      tag:['铜门'],
      isFull:false,
    },{
      picID:3,
      picUrl: '/static/image/shop/2.jpg',
      des:'中式臻品系列是设计师在追根溯源中逐渐恢复东方文化的自信，学会扬弃，在寻找中国传统文化的同时，吸纳了西方现代学的精髓创造了真正属于中国人的新中式生活',
      tag:['铜门','大门'],
      isFull:true
    },{
      picID:4,
      picUrl: '/static/image/shop/1.jpg',
      des:'中式臻品系列是设计师在追根溯源中逐渐恢复东方文化',
      tag:['铜门','大门'],
      isFull:false,
    },{
      picID:5,
      picUrl: '/static/image/shop/1.jpg',
      des:'中式臻品系列是设计师在追根溯源中逐渐恢复东方文化',
      tag:['铜门','大门'],
      isFull:false,
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 点击门类标签，切换
  switchCategory(event) {
    let selectID = event.currentTarget.dataset.doorcategoryid
    this.setData({
      selectID
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