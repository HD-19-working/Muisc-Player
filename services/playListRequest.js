import getRequest from "./getRequest"

function playListRequest(id) {
  return getRequest({
    url:`http://www.codercba.com:9002/playlist/detail?id=${id}`,
    method:"GET"
  }).then(res => {
    return res.playlist;
  }).catch(err => {
    console.log("playListRequest.js Error:",err);
  })
}

export default playListRequest