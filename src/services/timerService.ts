const timer = (function () {
  let timerObj: any;
  let count = 20;
  let myInterval: any = null;

  const timer = {
    init: (onTimeUp: () => void, onTick: (count: number) => void) => {        
      // 11 because the first number to be displayed will be 10
      count = 20;  
      myInterval = setInterval(function () {
        count--;
        onTick(count);
      }, 1000);

      timerObj = setTimeout(function () {
        clearInterval(myInterval);
        clearTimeout(timerObj);
        onTimeUp();        
      }, count * 1000);
    },

    resetCount() {
      count = 20;
    },

    stop: function () {
      clearTimeout(timerObj);
      clearInterval(myInterval);
    }
  };

  return timer; 
})();

export { timer };