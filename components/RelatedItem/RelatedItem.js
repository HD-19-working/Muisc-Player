// components/RelatedItem/RelatedItem.js
Component({
  properties: {
    itemData:{
      type:Object,
      value:{}
    }
  },
  data: {

  },
  methods: {
    linkToVideo(){
      wx.navigateTo({
        url: `/pages/videoItemPage/videoItemPage?vid=${this.properties.itemData.vid}`,
      })
    }
  }
})
