// components/RecommondItem/RecommondItem.js

Component({
  properties: {
    itemData:{
      type:Object,
      value:{}
    },
    sumPlayCount:{
      type:Number,
      value:0
    }
  },
  data: {
    imgStyle:"",
    isChangeHeight:false,
    showBoxWidth:"width:0%",
  },
  methods: {
    setHotShowWidth(){
      const personality = this.properties.itemData.playCount/this.properties.sumPlayCount*100;
      this.setData({
        showBoxWidth:`width:${personality}%`
      })
    },
    toPlayListPage(){
      wx.navigateTo({
        url: `/pages/playListPage/playListPage?id=${this.properties.itemData.id}`,
      })
    }
  },
  lifetimes:{
    attached(){
      const timer = setTimeout(()=>{
        this.setHotShowWidth();
        clearTimeout(timer);
      },1000);
    }
  }
})
