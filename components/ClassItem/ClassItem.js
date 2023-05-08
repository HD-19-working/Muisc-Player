// components/ClassItem/ClassItem.js
Component({
  properties: {
    itemData:{
      type:Object,
      value:{}
    }
  },
  methods: {
    toClassItemPage(){
      wx.navigateTo({
        url: `/pages/classItemPage/classItemPage?className=${this.properties.itemData.name}`
      })
    }
  }
})
