import getRequest from "./getRequest"
import {parseLyric} from "../utils/parseLyric"

function getSongDetail(id) {
  return getRequest({
    url:`http://www.codercba.com:9002/song/detail?ids=${id}`
  }).then(res => {
    return res.songs[0];
  })
}

function getSongLyric(id) {
  return getRequest({
    url:`http://www.codercba.com:9002/lyric?id=${id}`
  }).then(res => {
    // console.log(res);
    // console.log(res.lrc.lyric);
    // console.log(parseLyric(res.lrc.lyric));
    return parseLyric(res.lrc.lyric);
    // return res.lrc.lyric;
  })
}

export {
  getSongDetail,
  getSongLyric
}