// app.js
App({
  globalData:{
    screenHeight: 667,
    statusHeight: 20,
    contentHeight: 500,
  },
  async onLaunch(){
    wx.getSystemInfo({
      success:(res)=>{
        this.globalData.screenHeight = res.screenHeight;
        this.globalData.statusHeight = res.statusBarHeight;
        this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44;
      }
    })
    //云函数使用环境搭建
    if(!wx.cloud){
      console.error("请使用2.2.3或以上的基础库以使用云能力")
    }else{
      wx.cloud.init({
        env:"cloud1-8gm5lcrh1e81cd44"
      })
    }
  }
})
