// components/ClassPlayList/ClassPlayList.js
Component({
  properties: {
    itemData:{
      type:Object,
      value:{}
    }
  },
  methods: {
    toPlayListPage(){
      wx.navigateTo({
        url: `/pages/playListPage/playListPage?id=${this.properties.itemData.id}`,
      })
    }
  }
})
