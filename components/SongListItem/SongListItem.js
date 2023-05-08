// components/SongListItem/SongListItem.js
Component({
  properties: {
    listName:{
      type:String,
      value:""
    },
    imageSrc:{
      type:String,
      value:""
    },
    songNum:{
      type:Number,
      value:0
    }
  },
  data: {

  },
  methods: {
    toSongListPage(){
      wx.navigateTo({
        url: `/pages/songListPage/songListPage?listName=${this.properties.listName}`
      })
    }
  }
})
