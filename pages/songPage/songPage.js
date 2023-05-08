import {throttle} from "../../utils/throttle"
import songListStore from "../../store/SongListStore"
import getElement from "../../utils/getElement"

const app = getApp();
Page({
  data: {
    songData:{},
    parsedLyric:[],
    songList:[],
    currentTime:0,
    durationTime:0,
    currentLyric:"",
    currentLyricIndex:0,

    songListBoxHeight:0,
    contentHeight:0,
    currentSlider:0,
    stateImage:"/assets/img/song_stop.png",
    play_style_img:"/assets/img/list_circle.png",
    scrollTopDistance:0,
    isShowList:true,
    image_state:"",
    list_state:"",
    lastTapTime:0,
    favor_src:"/assets/img/favor_untap.png",
    is_favor:undefined,
    songId:""
  },
  onLoad(options) {
    this.data.songId = songListStore.state.songList[songListStore.state.songIndex];
    this.setData({                    //初始化盒子高度
      contentHeight:app.globalData.contentHeight
    })
    if(!songListStore.state.songData.name){
      songListStore.dispatch("changeSong",options.id);
    }
    this.updateData();
    // console.log(songListStore.state.songList);
    this.isFavor().then(res => {
      if(res){
        this.setData({
          favor_src:"/assets/img/favor_tap.png"
        })
      }
    })
  },
  updateData(){
    songListStore.onStates(["songData","parsedLyric","currentTime","durationTime","currentLyric","currentLyricIndex","isPlaying","songList"],this.handelFn)
  },
  handelFn(val){
    if(val.songData !== undefined){
      this.setData({songData:val.songData})
    }
    if(val.songList !== undefined){
      this.setData({songList:val.songList});
    }
    if(val.parsedLyric !== undefined){
      this.setData({parsedLyric:val.parsedLyric})
    }
    if(val.currentTime !== undefined){
      this.setData({currentTime:val.currentTime * 1000})
      if(this.data.durationTime !== 0){
        this.setData({currentSlider:val.currentTime*1000 / this.data.durationTime * 100})
      }
    }
    if(val.durationTime !== undefined){
      this.setData({durationTime:val.durationTime})
    }
    if(val.currentLyric !== undefined){
      this.setData({currentLyric:val.currentLyric})
    }
    if(val.currentLyricIndex !== undefined){
      this.setData({currentLyricIndex:val.currentLyricIndex})
      this.updateLyricScroller(val.currentLyricIndex)
    }
    if(val.isPlaying !== undefined){
      if(val.isPlaying){
        this.setData({stateImage:"/assets/img/song_stop.png"})
      }else{
        this.setData({stateImage:"/assets/img/song_play.png"})
      }
    }
  },
  onUnload(){
    songListStore.offStates(["songData","parsedLyric","currentTime","durationTime","currentLyric","currentLyricIndex","isPlaying"],this.handelFn);
  },
  sliderChange:throttle(function(event){
    const value = event.detail.value;
    const targetTime = (value/100) * this.data.durationTime;
    songListStore.dispatch("toTargetTime",targetTime/1000);
  },100),
  switchState(){
    if(songListStore.state.isPlaying){
      songListStore.dispatch("toPause");
    }else{
      songListStore.dispatch("toPlay");
    }
  },
  updateLyricScroller(ct_index){
    let query = wx.createSelectorQuery();
    let distance = 0;
    query.selectAll('.lyric_item').boundingClientRect(rect=>{
      for(let i = 0;i<ct_index;i++){
        distance += rect[i].height + 30;
      }
      this.setData({
        scrollTopDistance:distance
      })
    }).exec();
    
  },
  changePlayMode(){
    songListStore.state.play_style_mode = (songListStore.state.play_style_mode + 1)%3;
    let img_src;
    if(songListStore.state.play_style_mode === 0){
      img_src = "/assets/img/list_circle.png";
    }else if(songListStore.state.play_style_mode === 1){
      img_src = "/assets/img/song_circle.png"
    }else{
      img_src = "/assets/img/random_circle.png"
    }
    this.setData({
      play_style_img:img_src
    })
  },
  toLastSong(){
    this.setData({
      stateImage:"/assets/img/song_stop.png"
    })
    songListStore.dispatch("toLastSong");
  },
  toNextSong(){
    this.setData({
      stateImage:"/assets/img/song_stop.png"
    })
    songListStore.dispatch("toNextSong");
  },
  async setHeight(event){   
    const res = await getElement(".song_image",this);
    const img_width = event.detail.width;
    const img_height = event.detail.height;
    this.setData({
      songListBoxHeight:res.width / img_width * img_height
    })
  },
  showList(){
    const Time = new Date().getTime();
    if(this.data.isShowList && Time-this.data.lastTapTime>=1000){
      this.setData({
        image_state:"moveLeave",
        list_state:"moveShow"
      })
      this.data.isShowList = false;
      this.data.lastTapTime = Time;
    }else if(Time-this.data.lastTapTime>=1000){
      this.setData({
        image_state:"moveShow",
        list_state:"moveLeave"
      })
      this.data.isShowList = true;
      this.data.lastTapTime = Time;
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
          songid:this.data.songId,
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
        songid:this.data.songId
      }).remove()
    }
  },
  isFavor(){
    const db = wx.cloud.database();				
    const c_favor = db.collection("c_favor");	
    return c_favor.where({
      _openid:wx.getStorageSync('openid'),
      songid:this.data.songId
    }).get().then(res => {
      if(res.data.length !== 0){
        this.data.is_favor = true
        return true
      }
      this.data.is_favor = false
      return false
    })
  }
})