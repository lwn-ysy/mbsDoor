import request from './utils/request';
App({
  globalData: {
    // 所有界面都可以访问，全局参数，相当于vue里的
    //collect: ["123"], //收藏数据,已经改放在缓存storage里
    openID: '', //用户唯一标识
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.login({
      success: async res => {
        if (res.code) {
          let loginData = await request('/login', {
            code: res.code
          });
          let openID = loginData.data.openid;
          this.globalData.openID = openID;

          // 获取用户收藏的数据
          console.log("openID:", openID);
          this.getCollect(openID)
        }
      }
    })
  },
  getCollect: async (openID) => {
    let collectData = await request("/personal/collect", {
      openID
    });
    wx.setStorage({
      key: 'collect',
      data: collectData.data
    })
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
  onShareAppMessage() {
    return {
      title: '门博士门业'
    }
  }
})