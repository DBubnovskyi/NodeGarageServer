class Current{
    hour(){
        return new Date().toLocaleString("en-US",{hour:'numeric', hour12: false });
    };

    minutes(){
        let _minutes = new Date().toLocaleString("en-US",{minute:'numeric'});
        return _minutes < 10 ? `0${_minutes}` : _minutes;
    };

    day(){
        return new Date().toLocaleString("en-US",{day: 'numeric'});
    };

    month(){
        return new Date().toLocaleString("en-US",{month: 'numeric'});
    };

    year(){
        return new Date().toLocaleString("en-US",{year: 'numeric'});
    };
}

module.exports.current = new Current();
/*
    era: 'long', //"narrow", "short", "long"
    year: 'numeric', //"numeric", "2-digit"
    month: 'short', //"numeric", "2-digit", "narrow", "short", "long"
    day: 'numeric', //"numeric", "2-digit"
    weekday: 'long', //"narrow", "short", "long"
    //timezone: 'UTC',
    timeZoneName : "short", //"short", "long"
    hour: 'numeric', //"numeric", "2-digit"
    minute: 'numeric', //"numeric", "2-digit"
    second: 'numeric', //"numeric", "2-digit"
    hour12: false
*/