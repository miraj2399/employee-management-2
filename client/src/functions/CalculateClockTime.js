export function CalculateClockTime(clockIn,clockOut){
    // clockIn and clockOut are strings in the format "hhmm"
    // calculate the time difference between clockIn and clockOut
    // return the time difference in hhmm format
    // example: clockIn = "0900", clockOut = "1700"
    // return "0800"

    clockIn = parseInt(clockIn);
    clockOut = parseInt(clockOut);
    let clockInHour = Math.floor(clockIn/100);
    // 513 = 5*100 + 13 2012
    let clockInMinute = clockIn%100;
    let clockOutHour = Math.floor(clockOut/100);
    let clockOutMinute = clockOut%100;
    let clockInTotalMinutes = clockInHour*60 + clockInMinute;
    let clockOutTotalMinutes = clockOutHour*60 + clockOutMinute;
    let totalMinutes = clockOutTotalMinutes - clockInTotalMinutes;
    let totalHours = Math.floor(totalMinutes/60);
    let totalMinutesLeft = totalMinutes%60;
    if (totalHours<0){
        totalHours = 24 + totalHours;
    }
    if (totalMinutesLeft<0){
        totalMinutesLeft = 60 + totalMinutesLeft;
    }
    let totalHoursString = totalHours.toString();
    let totalMinutesLeftString = totalMinutesLeft.toString();
    if (totalHoursString.length===1){
        totalHoursString = "0"+totalHoursString;
    }
    if (totalMinutesLeftString.length===1){
        totalMinutesLeftString = "0"+totalMinutesLeftString;
    }
    //console.log("clockIn: "+clockIn, "clockOut: "+clockOut, "clockInMinute: "+clockInMinute,"clockOutHour: "+clockOutHour,"clockOutMinute: "+clockOutMinute,"clockInTotalMinutes: "+clockInTotalMinutes,"clockOutTotalMinutes: "+clockOutTotalMinutes,"totalMinutes: "+totalMinutes,"totalHours: "+totalHours,"totalMinutesLeft: "+totalMinutesLeft,"totalHoursString: "+totalHoursString);

    return [totalHoursString+":"+totalMinutesLeftString,totalMinutes>0?totalMinutes:(1440+totalMinutes)]

}