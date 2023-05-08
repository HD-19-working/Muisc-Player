const db = wx.cloud.database();
      
class Collection{
  constructor(c_name){
    this.clt = db.collection(c_name);
  }
  add(data){
    return this.clt.add({
      data
    })
  }
  del(cdt,isDoc = true){
    if(isDoc){
      return this.clt.doc(cdt).remove()
    }else{
      return this.clt.where(cdt).remove()
    }
  }
  update(cdt,data,isDoc = true){
    if(isDoc){
      return this.clt.doc(cdt).update({
        data
      })
    }else{
      return this.clt.where(cdt).update({
        data
      })
    }
  }
  find(cdt,isDoc = true){
    if(isDoc){
      return this.clt.doc(cdt)
    }else{
      return this.clt.where(cdt)
    }
  }
}

export default Collection