function parseLyric(lyric) {
  const arr = [];
  const strArr = lyric.split("\n");
  const Reg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  for(const item of strArr){
    if(item){
      const time = formatTime(item.match(Reg));
      let content = item.replace(Reg,"");
      if(content == ""){
        content = "......";
      }
      arr.push({
        time,
        content:content[0] == " " ? content.slice(1):content
      })
    }
  }
  return arr;
}
function formatTime(arr) {
  if(!arr)return 0;
  for(let i = 1;i<arr.length;i++){
    arr[i] = arr[i]*1;
  }
  return (arr[1]*60+arr[2])*1000 + arr[3];
}

export {
  parseLyric
}