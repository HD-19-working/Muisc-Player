function throttle(fn,duration) {
  let lastTime = 0;
  return function(...args) {
    const currentTime = new Date().getTime();
    if(currentTime - lastTime >= duration){
      fn.apply(this,args);
      lastTime = currentTime;
    }
  }
}

export {
  throttle
} 