// pages/classItemPage/classItemPage.js
import getClassItemData from "../../services/classItemRequest"

Page({
  data: {
    className:"华语",
    offset:0,
    limit:20,
    type:"hot",
    playList:[]
  },
  onLoad(options) {
    this.data.className = options.className;
    this.getData();
  },
  async getData(){
    const newData = await getClassItemData(this.data.className,this.data.limit,this.data.offset,this.data.type);
    for(const item of newData){
      this.data.playList.push(item);
    }
    this.setData({
      playList:this.data.playList
    },()=>{
      this.data.offset += this.data.limit;
    })
  },
  onPullDownRefresh(){
    this.data.playList = [];
    this.getData().then(res => {
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom(){
    this.getData();
  }
})