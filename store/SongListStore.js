const {HYEventStore} = require("hy-event-store");
import {getSongDetail,getSongLyric} from "../services/songRequest"
import {throttle} from "../utils/throttle"

const audioContext = wx.createInnerAudioContext();      //创建播放器
const songListStore = new HYEventStore({
  state:{							//存储共享的数据
    songList:[],      //播放列表，方便进行歌曲切换
    songIndex:0,      //当前歌曲在播放列表的下标

    songData:{},      //当前播放歌曲信息
    parsedLyric:[],   //当前播放歌曲的歌词信息
    currentTime:0,    //当前歌曲此刻对应的播放时间
    durationTime:0,   //当前歌曲的总时长
    isPlaying:true,   //是否在播放
    isFirstSet:true,  //是否第一次播放(第一次播放需要进行一些设置)
    currentLyric:"",  //当前歌曲此刻对应的歌词
    currentLyricIndex:0,  //当前歌曲此刻对应的歌词在parsedLyric的下标
    play_style_mode:0,//当前播放列表的播放模式(列表循环/单曲循环/随机播放)
  },
  actions:{
    async getSongData(ctx,id){      //根据id获取播放歌曲/歌词信息
      ctx.songData = await getSongDetail(id);
      ctx.parsedLyric = await getSongLyric(id);
      // audioContext.onWaiting(()=>{      //解决点击进度条闪跳Bug
          //   audioContext.pause();
          // })
          // audioContext.onCanplay(()=>{      //解决点击进度条闪跳Bug
          //   audioContext.play();
          // })
    },
    changeSong(ctx,id){     //播放歌曲id对应的歌曲
      this.actions.getSongData(ctx,id).then(() => {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;   //加载播放歌曲对应音频
        ctx.durationTime = ctx.songData.dt;  //更新歌曲总时长
        if(ctx.isFirstSet){     //如果是创建播放器后的第一次播放
          ctx.isFirstSet = false;
          audioContext.autoplay = true;     //加载完成后自动播放
          audioContext.onEnded(()=>{        //设置歌曲播放完毕后执行的回调函数
            songListStore.dispatch("switchSong");
          })
          const throttleUpdate = throttle(()=>{
            ctx.currentLyricIndex = this.actions.getCurrentLyricIndex(ctx,audioContext.currentTime*1000);
            ctx.currentTime = audioContext.currentTime;
            ctx.currentLyric = ctx.parsedLyric[ctx.currentLyricIndex].content;
          },250);
          audioContext.onTimeUpdate(throttleUpdate); 
          //随着歌曲的播放实时更新当前歌词下标、当前播放时间、当前歌词信息
        }
      });
    },
    getCurrentLyricIndex(ctx,ct){     //获取当前歌曲播放进度对应歌词
      let index = ctx.parsedLyric.length-1;
      for(let i = 0;i<ctx.parsedLyric.length;i++){
        if(ct < ctx.parsedLyric[i].time){
          index = i-1;
          break;
        }
      }
      return index;
    },
    toTargetTime(ctx,target_time){  //跳转到指定时间位置继续播放
      audioContext.seek(target_time);
      ctx.currentTime = target_time;
      ctx.isPlaying = true;
    },
    toPause(ctx){        //暂停播放
      audioContext.pause();
      ctx.isPlaying = false;
    },
    toPlay(ctx){         //继续播放
      audioContext.play();
      ctx.isPlaying = true;
    },
    switchSong(ctx){     //根据play_style_mode切换歌曲
      if(ctx.play_style_mode === 0){
        songListStore.dispatch("toNextSong");
      }else if(ctx.play_style_mode === 1){
        songListStore.dispatch("toCurrentSong");
      }else{
        songListStore.dispatch("toRandomSong");
      }
    },
    toLastSong(ctx){     //切换到上一首歌
      if(ctx.play_style_mode === 1){
        songListStore.dispatch("toCurrentSong");
        return;
      }
      if(ctx.play_style_mode === 2){
        songListStore.dispatch("toRandomSong");
        this.actions.toRandomSong(ctx);
        return;
      }
      if(ctx.songIndex === 0){
        ctx.songIndex = ctx.songList.length-1;
      }else{
        ctx.songIndex--;
      }
      songListStore.dispatch("changeSong",ctx.songList[ctx.songIndex])
    },
    toNextSong(ctx){    //切换到下一首歌
      if(ctx.play_style_mode === 1){
        songListStore.dispatch("toCurrentSong");
        return;
      }
      if(ctx.play_style_mode === 2){
        songListStore.dispatch("toRandomSong");
        return;
      }
      if(ctx.songIndex === ctx.songList.length-1){
        ctx.songIndex = 0;
      }else{
        ctx.songIndex++;
      }
      songListStore.dispatch("changeSong",ctx.songList[ctx.songIndex])
    },
    toCurrentSong(ctx){   //重新播放当前歌曲
      audioContext.seek(0);
      ctx.isPlaying = true;
    },
    toRandomSong(ctx){    //切换到播放列表中的随机一首歌
      const index = Math.floor(Math.random()*ctx.songList.length);
      songListStore.dispatch("changeSong",ctx.songList[index])
    }
  }
})

export default songListStore