// pages/videoPage/video.js
import {videoRequest} from "../../services/videoRequest"

Page({
  data:{
    mv_data:[],         //可变，存储请求得到的mv数据
    current_index:0,    //可变，存储当前mv数据的长度
    request_num:20,     //默认不变，每次请求mv数据的个数
    toFetch:true,    //可变，限制只有前fetchMvData()执行完后才能执行下一个fetchMvData()
    hasMore:true        //可变，记录是否还有新的mv数据
  },
  onLoad(){
    this.fetchMvData();
  },
  async fetchMvData(){          //获取、处理video数据
    if(this.data.toFetch && this.data.hasMore){   
      this.data.toFetch = false;
      const res = await videoRequest(this.data.request_num,this.data.current_index);
      if(res.data){
        for(const item of res.data){
          if(item){
            this.data.mv_data.push(item);
          }
        }
        this.setData({
          mv_data:this.data.mv_data,
          current_index:this.data.mv_data.length
        })
      }
      this.data.hasMore = res.hasMore;    
      this.data.toFetch = true;     //直接修改，页面不需要响应式
    }
  },
  onReachBottom(){          //滑到底部加载更多数据
    this.fetchMvData();
  },
  async onPullDownRefresh(){      //下拉刷新，重置为初始状态，同时重新请求数据
    this.data.mv_data = [];       
    this.data.current_index = 0;
    this.data.toFetch = true;
    this.data.hasMore = true;
    await this.fetchMvData();    
    wx.stopPullDownRefresh();     //得到数据后停止下拉刷新动画
  }
})