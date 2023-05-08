function getRequest(set){
  return new Promise((resolve,reject)=>{
    wx.request({
      ...set,
      success:res => {
        resolve(res.data);
      },
      fail:err => {
        reject(err);
      }
    })
  })
}

export default getRequest

