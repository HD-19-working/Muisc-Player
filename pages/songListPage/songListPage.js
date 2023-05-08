// pages/songListPage/songListPage.js
import songListStore from "../../store/SongListStore"
import Collection from "../../database/index"

Page({
  data: {
    songIdList:[]
  },
  async onLoad(options) {
    const c_list_content = new Collection("c_list_content");
    const res = await c_list_content.find({
      _openid:wx.getStorageSync('openid'),
      name:options.listName
    },false).orderBy("addtime","desc").get();
    const arr = [];
    for(const item of res.data){
      arr.push(item.songid);
    }
    this.setData({
      songIdList:arr
    })
    songListStore.setState("songList",arr);
  }
})