// components/CustomisedBar/CustomisedBar.js
Component({
  properties: {
    isHidden:{
      type:Boolean,
      value:false
    }
  },
  data: {
    statusHeight:20
  },
  methods: {
    backTo(){
      wx.navigateBack();
    }
  },
  lifetimes:{
    attached(){
      const app = getApp();
      this.setData({
        statusHeight:app.globalData.statusHeight
      })
    }
  }
})
