// pages/videoItemPage/videoItemPage.js
import {getMvData,getMvVideo,getRelatedMv} from "../../services/videoRequest"

Page({
  data:{
    mv_data:{},
    mv_video:{},
    related_data:{}
  },
  onLoad(options) {
    if(options.id){
      this.getData(options.id,"id");
    }else if(options.vid){
      this.getData(options.vid,"vid");
    }
  },
  async getData(id,id_type){
    this.data.mv_data = await getMvData(id,id_type);
    this.data.mv_video = await getMvVideo(id,id_type);
    this.data.related_data = await getRelatedMv(id);
    this.setData({
      mv_data:this.data.mv_data,
      mv_video:this.data.mv_video,
      related_data:this.data.related_data
    })
  }
})