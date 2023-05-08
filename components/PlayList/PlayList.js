// components/PlayList/PlayList.js
Component({
  properties: {
    recommondList:{
      type:Array,
      value:[]
    }
  },
  data:{
    recommondPlayCount:0
  },
  methods: {

  },
  observers:{
    "recommondList":function (newVal) {
      let sum = 0;
      for(const key in newVal){
        sum += newVal[key].playCount;
      }
      this.setData({
        recommondPlayCount:sum
      })
    }
  }
})
