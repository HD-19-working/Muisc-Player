// components/SongTag/SongTag.js
import songListStore from "../../store/SongListStore"

Component({
  data: {
    isShow:false,
    songData:{},
    btnImg:"/assets/img/song_stop.png",
    currentLyric:""
  },
  methods: {
    toSongPage(){
      wx.navigateTo({
        url: `/pages/songPage/songPage?id=${this.data.songData.id}`,
      })
    },
    stateControl(){
      if(songListStore.state.isPlaying){
        songListStore.dispatch("toPause");
      }else{
        songListStore.dispatch("toPlay");
      }
    }
  },
  lifetimes:{
    attached(){
      songListStore.onStates(["songData","currentLyric","isPlaying"],val=>{
        if(val.songData && val.songData.name != undefined){
          this.setData({
            isShow:true,
            songData:val.songData
          })
        }
        if(val.currentLyric != undefined){
          this.setData({
            currentLyric:val.currentLyric
          })
        }
        if(val.isPlaying === true){
          this.setData({
            btnImg:"/assets/img/song_stop.png",
          })
        }else if(val.isPlaying === false){
          this.setData({
            btnImg:"/assets/img/song_play.png",
          })
        }
      })
    }
  }
})
