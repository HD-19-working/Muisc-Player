// pages/index/index.js
import {getBanner,getRecommond,getNewSetAlbum} from "../../services/indexRequest"
import getElement from "../../utils/getElement"
// import songListStore from "../../store/SongListStore"

Page({
  data:{
    bannerList:[],
    recommondList:[],
    albumList:[],
    banner_style:"",
    isChangeHeight:false
  },
  linkToSearch(){
    wx.navigateTo({
      url:'/pages/searchPage/searchPage',
    })
  },
  async setHeight(event){
    if(!this.data.isChangeHeight){
      this.data.isChangeHeight = true;    //限制height只用设置一次
      const res = await getElement(".banner",this);
      const img_width = event.detail.width;
      const img_height = event.detail.height;
      const swiper_height = res.width / img_width * img_height;
      this.setData({
        banner_style:`height:${swiper_height}px`
      })
    }
  },
  onLoad(){
    this.getBannerData();
    this.getRecommondData(6);
    this.getNewSetAlbumData();
    // songListStore.dispatch("changeSong",2035075661)
  },
  async getBannerData(){
    this.setData({
      bannerList:await getBanner()
    }) 
  },
  async getRecommondData(num){
    this.setData({
      recommondList:await getRecommond(num)
    })
  },
  async getNewSetAlbumData(){
    this.setData({
      albumList:await getNewSetAlbum(6)
    })
  }
})