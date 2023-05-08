function  getElement(selector,thisPtr = wx) {
  return new Promise((resolve) => {
    if(selector){
      const query = thisPtr.createSelectorQuery();
      query.select(selector).boundingClientRect();
      query.exec(function(res){
        resolve(res[0]);
      });
    }
  })
}

export default getElement;

