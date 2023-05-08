// components/MusicList/MusicList.js
Component({
  properties: {
    listData:{
      type:Array,
      value:[],
    }
  },
  data: {
    box_width:"100%",
    item_width:"10%",
    item_count:2,        //设置元素个数
    gap_persent:4
  },
  observers:{
    "listData":function (newList) {
      const gap_width = this.data.gap_persent*(newList.length-1);
      const item_width = (100-this.data.gap_persent*(this.data.item_count-1))/(this.data.item_count);
      const whole_width = gap_width + item_width*newList.length;
      this.setData({
        box_width : whole_width+"%",
        item_width: item_width/whole_width*100+"%"
      })
    }
  },
  methods: {

  }
})
