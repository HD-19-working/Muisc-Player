// pages/user/user.js
import Collection from "../../database/index"

Page({
  data: {
    user_src:"/assets/img/user.png",
    user_name:"未登录",
    favor_src:"",
    favor_num:0,
    favor_style:"流行",
    favor_lasttime:"",
    is_show:false,
    input_value:"",
    songList:[]
  },
  async onLoad() {
    if(this.isLogin()){
      this.updateLoginState();
      this.updateData();
    }
  },
  async updateData(){
    const openid =  wx.getStorageSync('openid');
    if(openid){
      await this.updateFavorData(openid);
      await this.updateSongListData(openid);
    }
  },
  async updateFavorData(openid){
    const c_favor = new Collection("c_favor");
    const res = await c_favor.find({
      _openid:openid
    },false).orderBy("addtime","desc").get();
    if(res.data.length !== 0){
      this.setData({
        favor_src:res.data[0].detail.al.picUrl,
        favor_num:res.data.length,
        favor_lasttime:this.formateTime(res.data[0].addtime)
      })
    }
    const arr = [];
    for(const item of res.data){
      arr.push(item.songid);
    }
    wx.setStorageSync('favorsong', arr);
  },
  async updateSongListData(openid){
    const c_list_catalog = new Collection("c_list_catalog");
    const res = await c_list_catalog.find({
      _openid:openid
    },false).orderBy("addtime","desc").get();
    this.setData({
      songList:res.data
    })
    const arr = [];
    for(const item of res.data){
      arr.push(item.name);
    }
    wx.setStorageSync('songlist', arr);
  },
  isLogin(){
    return wx.getStorageSync('openid') !== ""
  },
  updateLoginState(){
    const user_info = wx.getStorageSync('userinfo')
    this.setData({
      user_src:user_info.avatarUrl,
      user_name:user_info.nickName
    })
  },
  async userLogin(){      //用户登录逻辑
    if(!this.isLogin()){
      const res = await wx.getUserProfile({
        desc: '获取您的头像和昵称',
      });
      const user_openid_res = await wx.cloud.callFunction({ //获取用户openid
        name:"get-openid"
      })
      const user_openid = user_openid_res.result.openid
      
      wx.setStorageSync('openid', user_openid)    //将用户openid存储到本地
      wx.setStorageSync('userinfo', res.userInfo) //将用户信息存储到本地
    }
    this.updateLoginState();
    this.updateData();
  },
  toFavorPage(){
    wx.navigateTo({
      url: '/pages/favorPage/favorPage',
    })
  },
  formateTime(time){
    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    // return year+"年"+month+"月"+day+"日";
    return `${year}年${month}月${day}日`
  },
  async onPullDownRefresh(){
    this.updateLoginState();
    await this.updateData();
    wx.stopPullDownRefresh();
  },
  switchOverlay(){
    if(this.data.is_show){
      this.setData({
        is_show:false,
        input_value:""
      })
    }else{
      this.setData({
        is_show:true,
        input_value:""
      })
    }
  },
  addSongList(){
    this.switchOverlay();
  },
  cancelBtn(){
    this.switchOverlay();
  },
  async checkBtn(){
    const val = this.data.input_value;
    this.switchOverlay();
    const c_list_catalog = new Collection("c_list_catalog");
    await c_list_catalog.add({
      name:val,
      num:0,
      cover_url:"/assets/img/list_cover.png",
      addtime:new Date().getTime()
    })
  },
  updateVal(event){
    this.setData({
      input_value:event.detail.value
    })
  }
})