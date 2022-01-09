export const formatHours = (numberOfHours : number) => {
  if (numberOfHours === 0) {
    return "0h";
  }
  const days=Math.floor(numberOfHours/24);
  const remainder=numberOfHours % 24;
  const hours=Math.floor(remainder);
  const minutes=Math.floor(60*(remainder-hours));
  
  let res = "";
  if (days > 0) {
    res += days + "d";
  }
  if (hours > 0) {
    if (days > 0) {
      res += " ";
    }
    res += hours + "h";
  }
  if (minutes) {
    if (days > 0 || hours > 0) {
      res += " ";
    }
    res += minutes + "m";
  }

  return res;
}