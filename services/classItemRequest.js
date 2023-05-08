import getRequest from "./getRequest"

function getClassItemData(name="华语",limit=20,offset=0,type="hot") {
  return getRequest({
    url:`http://www.codercba.com:9002/top/playlist?limit=${limit}&order=${type}&cat=${name}&offset=${offset}`
  }).then(res => {
    return res.playlists || [];
  }).catch(err => {
    console.log("classItemRequest Error:",err);
  })
}

export default getClassItemData