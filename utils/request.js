import config from './config';

// wx.requset post的data数据，默认转为json格式
export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      success: (res) => {
        console.log('请求成功:', res);
        resolve(res);
      },
      fail: (err) => {
        console.log('请求失败:', err);
        reject(err);
      }
    })
  })
}