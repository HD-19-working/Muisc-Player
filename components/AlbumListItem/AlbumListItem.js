// components/MusicListItem/MusicListItem.js
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
    toAlbumPage(){
      wx.navigateTo({         
        url: `/pages/albumPage/albumPage?id=${this.properties.itemData.id}`
      })
    }
  }
})
