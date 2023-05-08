// pages/playListPage/playListPage.js
import playListRequest from "../../services/playListRequest"
import songListStore from "../../store/SongListStore"
import Collection from "../../database/index"

Page({
  data: {
    playListData:{},
    columns:[],
    show:false,
    songId:0,
    imageSrc:""
  },
  onLoad(options) {
    if(options.id){
      this.getPlayListData(options.id).then(()=>{
        const arr = [];
        for(const item of this.data.playListData.trackIds){
          arr.push(item.id);
        }
        songListStore.setState("songList",arr);
      });
    }
    this.getSongListName();
  },
  async getPlayListData(id){
    this.setData({
      playListData: await playListRequest(id)
    })
  },
  async getSongListName(){
    const arr = wx.getStorageSync('songlist');
    if(!arr){
      const openid = wx.getStorageSync('openid');
      if(openid){
        const c_list_catalog = new Collection("c_list_catalog");
        const res = await c_list_catalog.find({
          _openid:openid
        },false).orderBy("addtime","desc").get();
        const arr = [];
        for(const item of res.data){
          arr.push(item.name);
        }
        wx.setStorageSync('songlist', arr);
        this.setData({
          columns:wx.getStorageSync('songlist')
        })
      }else{
        console.log("未登录");
      }
    }else{
      this.setData({
        columns:wx.getStorageSync('songlist')
      })
    }
  },
  addFn(event){
    // console.log(event);
    const openid = wx.getStorageSync('openid');
    if(openid){
      this.setData({
        show:true
      })
      this.data.songId = event.detail.songId;
      this.data.imageSrc = event.detail.imageSrc;
    }else{
      console.log("未登录")
    }
  },
  async onConfirm(event){
    this.setData({
      show:false
    })
    const {value} = event.detail;
    const c_list_content = new Collection("c_list_content");
    await c_list_content.add({
      songid:this.data.songId,
      addtime:new Date().getTime(),
      name:value
    })
    const c_list_catalog = new Collection("c_list_catalog");
    const res = await c_list_catalog.find({
      _openid:wx.getStorageSync('openid'),
      name:value
    },false).get()
    // console.log(res);
    await c_list_catalog.update({
      _openid:wx.getStorageSync('openid'),
      name:value
    },{
      cover_url:this.data.imageSrc,
      num:res.data[0].num+1
    },false)
  },
  onCancel(){
    this.setData({
      show:false
    })
  }
})