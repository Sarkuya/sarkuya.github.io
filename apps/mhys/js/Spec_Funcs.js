// the day number of the first day of year y
function DayFromYear(y) {
    return 365 * (y - 1970) + Math.floor((y - 1969) / 4) - Math.floor((y - 1901) / 100) + Math.floor((y - 1601) / 400);
}

// how many days since 1970/01/01 08:00:00
function Day(t) {
    return Math.floor(t / msPerDay);
}

// how many time left in whatever days
function TimeWithinDay(t) {
    return t % msPerDay;
}

// how many days in the year
function DaysInYear(y) {
    if (y % 4 !== 0) {
        return 365;
    }

    if (y % 4 === 0 && y % 100 !== 0) {
        return 366;
    }

    if (y % 100 === 0 && y % 400 !== 0) {
        return 365;
    }

    if (y % 400 === 0) {
        return 366;
    }
}

// the time value of the start of a year
function TimeFromYear(y) {
    return msPerDay * DayFromYear(y);
}

// which year for the time, based on local time
function YearFromTime(t) {
    t -= (new Date().getTimezoneOffset()) * 60 * 1000;

    var year = 1970;
    var startTime = TimeFromYear(year);

    if (t === 0) {
        return 1970;
    }

    if (t < 0) {
        while (startTime > t) {
            year--;
            startTime = TimeFromYear(year);
        }

        return year;
    } else {
        while (startTime < t) {
            year++;
            startTime = TimeFromYear(year);
        }

        year -= 1;
        return year;
    }
}

// is in leap year
function InLeapYear(t) {
    if (DaysInYear(YearFromTime(t)) === 365) {
        return 0;
    } else if (DaysInYear(YearFromTime(t)) === 366) {
        return 1;
    } else {
        alert("Unkown switch");
    }
}

// how many days from the first day in whatever year
function DayWithinYear(t) {
    t -= (new Date().getTimezoneOffset()) * 60 * 1000;
    return Day(t) - DayFromYear(YearFromTime(t));
}

function MonthFromTime(t) {
    if (DayWithinYear(t) >= 0 && DayWithinYear(t) < 31) {
        return 0;
    } else if (DayWithinYear(t) >= 31 && DayWithinYear(t) < (59 + InLeapYear(t))) {
        return 1;
    } else if (DayWithinYear(t) >= (59 + InLeapYear(t)) && DayWithinYear(t) < (90 + InLeapYear(t))) {
        return 2;
    } else if (DayWithinYear(t) >= (90 + InLeapYear(t)) && DayWithinYear(t) < (120 + InLeapYear(t))) {
        return 3;
    } else if (DayWithinYear(t) >= (120 + InLeapYear(t)) && DayWithinYear(t) < (151 + InLeapYear(t))) {
        return 4;
    } else if (DayWithinYear(t) >= (151 + InLeapYear(t)) && DayWithinYear(t) < (181 + InLeapYear(t))) {
        return 5;
    } else if (DayWithinYear(t) >= (181 + InLeapYear(t)) && DayWithinYear(t) < (212 + InLeapYear(t))) {
        return 6;
    } else if (DayWithinYear(t) >= (212 + InLeapYear(t)) && DayWithinYear(t) < (243 + InLeapYear(t))) {
        return 7;
    } else if (DayWithinYear(t) >= (243 + InLeapYear(t)) && DayWithinYear(t) < (273 + InLeapYear(t))) {
        return 8;
    } else if (DayWithinYear(t) >= (273 + InLeapYear(t)) && DayWithinYear(t) < (304 + InLeapYear(t))) {
        return 9;
    } else if (DayWithinYear(t) >= (304 + InLeapYear(t)) && DayWithinYear(t) < (334 + InLeapYear(t))) {
        return 10;
    } else if (DayWithinYear(t) >= (334 + InLeapYear(t)) && DayWithinYear(t) < (365 + InLeapYear(t))) {
        return 11;
    } else {
        alert("Unkown switch");
    }
}

function DateFromTime(t) {
    //t += (new Date().getTimezoneOffset()) * 60 * 1000;
    switch (MonthFromTime(t)) {
        case 0:
            return DayWithinYear(t) + 1;
            break;
        case 1:
            return DayWithinYear(t) - 30;
            break;
        case 2:
            return DayWithinYear(t) - 58;
            break;
        case 3:
            return DayWithinYear(t) - 89;
            break;
        case 4:
            return DayWithinYear(t) - 119;
            break;
        case 5:
            return DayWithinYear(t) - 150;
            break;
        case 6:
            return DayWithinYear(t) - 180;
            break;
        case 7:
            return DayWithinYear(t) - 211;
            break;
        case 8:
            return DayWithinYear(t) - 242;
            break;
        case 9:
            return DayWithinYear(t) - 272;
            break;
        case 10:
            return DayWithinYear(t) - 303;
            break;
        case 11:
            return DayWithinYear(t) - 333;
            break;
        default:
            alert("Unkown switch");
            break;
    }
}

function WeekDay(t) {
    return (Day(t) + 4) % 7;
}

function testFuncs() {
    var aa = get日干支(date);
    //console.log(aa);

    var bb = DayFromYear(1953);
    //console.log(bb);

    var cc = Day(date.valueOf());
    //console.log(cc);

    var dd = TimeWithinDay(date.valueOf());
    //console.log(dd);

    var ee = DaysInYear(2014);
    // console.log(ee);

    var ff = TimeFromYear(1972);
    // console.log(ff);

    var gg = YearFromTime(date.valueOf());
    // console.log(gg);

    var hh = InLeapYear(date.valueOf());
    // console.log(hh);

    var hhh = DayWithinYear(date.valueOf());
    console.log(hhh);


    var ii = MonthFromTime(date.valueOf());
    console.log(ii);

    var jj = DateFromTime(date.valueOf());
    // console.log(jj);

    var kk = WeekDay(date.valueOf());
    //console.log(kk);
}