import getRequest from "./getRequest"

function getAlbumDetail(id) {
  return getRequest({
    method:"GET",
    url:`http://www.codercba.com:9002/album?id=${id}`
  }).then(res => {
    return res.songs;
  })
}

export default getAlbumDetail;