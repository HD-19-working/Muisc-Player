// components/SongItem/SongItem.js
import {getSongDetail} from "../../services/songRequest"
import songListStore from "../../store/SongListStore"

Component({
  properties: {
    songId:{
      type:Number,
      value:0
    },
    songIndex:{       //从1开始
      type:Number,
      value:0
    }
  },
  data: {
    songData:{},
    favor_src:"/assets/img/favor_untap.png",
    is_favor:undefined
  },
  observers:{
    songId(new_song_id){
      this.getSongData(new_song_id);
    }
  },
  methods: {
    async getSongData(id){
      this.setData({
        songData:await getSongDetail(id)
      })
    },
    toSongPage(){
      songListStore.setState("songIndex",this.data.songIndex-1);
      if(songListStore.state.songData.name){
        songListStore.dispatch("changeSong",this.data.songId);
      }else{
        wx.navigateTo({
          url: `/pages/songPage/songPage?id=${this.properties.songId}`
        });
      }
    },
    addFavor(){
      let favor_state = this.data.is_favor
      if(favor_state === undefined){
        this.isFavor().then(res => {
          if(res){
            favor_state = true
          }else{
            favor_state = false
          }
        })
      }
      const db = wx.cloud.database();				
      const c_favor = db.collection("c_favor");
      if(favor_state === false){	
        this.setData({
          favor_src:"/assets/img/favor_tap.png"
        })
        c_favor.add({
          data:{
            detail:this.data.songData,
            songid:this.properties.songId,
            addtime:new Date().getTime()
          }
        })
      }else{
        this.setData({
          favor_src:"/assets/img/favor_untap.png"
        })
        this.data.is_favor = false
        c_favor.where({
          _openid:wx.getStorageSync('openid'),
          songid:this.properties.songId
        }).remove()
      }
    },
    isFavor(){
      const db = wx.cloud.database();				
      const c_favor = db.collection("c_favor");	
      return c_favor.where({
        _openid:wx.getStorageSync('openid'),
        songid:this.properties.songId
      }).get().then(res => {
        if(res.data.length !== 0){
          this.data.is_favor = true
          return true
        }
        this.data.is_favor = false
        return false
      })
    },
    addList(){
      // console.log(this.data.songData);
      this.triggerEvent("addTap",{
        songId:this.properties.songId,
        imageSrc:this.data.songData.al.picUrl
      });
    }
  },
  lifetimes:{
    attached(){
      this.isFavor().then(res => {
        if(res){
          this.setData({
            favor_src:"/assets/img/favor_tap.png"
          })
        }
      })
    }
  }
})
