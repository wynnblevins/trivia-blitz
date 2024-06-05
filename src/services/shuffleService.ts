// Fisher Yates shuffle algorithm
export const shuffle = (items: any[]): any[] => {
  var i = 0, j = 0, temp = null;
        
  for (i = items.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = items[i];
    items[i] = items[j];
    items[j] = temp;
  }

  return items;    
}