const parseDate = date => {
 let stringDate = date.toString();
 let splitDate = stringDate.split(" ");
 let timeStr = splitDate[4];
 let timeArray = timeStr.split(":");

 let dateObj = {
  fullDate: `${splitDate[0]} ${splitDate[1]} ${splitDate[2]} ${splitDate[3]}`,
  day: splitDate[0],
  month: splitDate[1],
  numDate: splitDate[2],
  year: splitDate[3],
  fullTime: `${timeArray[0]}:${timeArray[1]}`,
  fullTimeWithSeconds: splitDate[4],
  timeObj: {
   hours: timeArray[0],
   minutes: timeArray[1],
   seconds: timeArray[2]
  },
  stringTimeObj: {
   hours: timeArray[0] + "hrs",
   minutes: timeArray[1] + "mins",
   seconds: timeArray[2] + "secs"
  },
  geoSpecs: `${splitDate[5]} ${splitDate[6]}${splitDate[7]}${splitDate[8]}`
 };

 return dateObj;
};

export default parseDate;
