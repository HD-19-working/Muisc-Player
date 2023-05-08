import getRequest from "./getRequest"
function getBanner() {
  return getRequest({
    url:"http://www.codercba.com:9002/banner",
    method:"GET"
  }).then(res => {
    return res.banners
  })
}

function getRecommond(num) {
  return getRequest({
    url:`http://www.codercba.com:9002/top/playlist?limit=${num}&order=hot&offset=0`,
    method:"GET"
  }).then(res => {
    return res.playlists;
  })
}

function getNewSetAlbum(num) {
  return getRequest({
    url:"http://www.codercba.com:9002/album/newest",
    method:"GET"
  }).then(res => {
    return res.albums.slice(0,num);
  })
}

export {
  getBanner,
  getRecommond,
  getNewSetAlbum
}