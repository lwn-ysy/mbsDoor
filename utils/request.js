import config from './config';


export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.test_host + url,
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