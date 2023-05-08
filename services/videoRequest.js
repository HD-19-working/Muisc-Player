import getRequest from "./getRequest"

function videoRequest(limit = 20,offset = 0){
  return getRequest({
    url:"http://www.codercba.com:9002/top/mv",
    method:"GET",
    data:{
      limit,
      offset
    }
  });
}

function getMvData(id,id_type = "id"){
  if(id_type === "id"){
    return getRequest({
      url:`http://www.codercba.com:9002/mv/detail?mvid=${id}`,
      method:"GET"
    }).then(res => {
      return res.data;
    });
  }else if(id_type === "vid"){
    return getRequest({
      url:`http://www.codercba.com:9002/video/detail?id=${id}`,
      method:"GET"
    }).then(res => {
      return {
        name:res.data.title,
        artistName:res.data.creator.nickname,
        playCount:res.data.playTime,
        desc:res.data.description,

      }
    });
  }
}

function getMvVideo(id,id_type = "id") {
  if(id_type === "id"){
    return getRequest({
      url:`http://www.codercba.com:9002/mv/url?id=${id}`,
      method:"GET"
    }).then(res => {
      return res.data;
    });
  }else if(id_type === "vid"){
    return getRequest({
      url:`http://www.codercba.com:9002/video/url?id=${id}`,
      method:"GET"
    }).then(res => {
      return res.urls[0];
    });
  }
}

function getRelatedMv(id){
  return getRequest({
    url:`http://www.codercba.com:9002/related/allvideo?id=${id}`,
    method:"GET"
  }).then(res => {      //.then()返回一个Promise对象
    return res.data     //resolve(return的值)
  });
}           
export {
  videoRequest,
  getMvData,
  getRelatedMv,
  getMvVideo
}

