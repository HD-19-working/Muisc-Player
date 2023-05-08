// components/VideoItemHuge/VideoItemHuge.js
Component({
  properties: {
    videoData:{
      type:Object,
      value:{}
    }
  },
  methods: {
    toVideoItemPage(){
      wx.navigateTo({         
        url: `/pages/videoItemPage/videoItemPage?id=${this.properties.videoData.id}`
      })
    }
  }
})
