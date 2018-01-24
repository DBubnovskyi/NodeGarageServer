class Current{
    hour(){
        return `${new Date().toLocaleString("en-US",{hour:'numeric', hour12: false })}`;
    };

    minutes(){
        let _minutes = new Date().toLocaleString("en-US",{minute:'numeric'});
        return _minutes < 10 ? `0${_minutes}` : `${_minutes}`;
    };

    day(){
        return `${new Date().toLocaleString("en-US",{day: 'numeric'})}`;
    };

    month(){
        return `${new Date().toLocaleString("en-US",{month: 'numeric'})}`;
    };

    year(){
        return `${new Date().toLocaleString("en-US",{year: 'numeric'})}`;
    };
    current(){
        return `${this.hour()}:${this.minutes()}`
    }
    increase(time,increase_time){
        let buf_time = time.split(':');
        let minutes = parseInt(buf_time[1]);
        let hour = parseInt(buf_time[0]);
        minutes = parseInt(minutes) + parseInt(increase_time);
        hour = minutes > 59 ?  hour + Math.floor(minutes/60) : hour;
        minutes = minutes > 59 ?  minutes%60 : minutes;
        hour = leading_zero(hour);
        minutes = leading_zero(minutes);
        return `${hour}:${minutes}`;
    }
    increase_current(increase_time){
        let hour = parseInt(this.hour());
        let minutes = parseInt(this.minutes());
        minutes = parseInt(minutes) + parseInt(increase_time);
        hour = minutes > 59 ?  hour + Math.floor(minutes/60) : hour;
        minutes = minutes > 59 ?  minutes%60 : minutes;
        hour = leading_zero(hour);
        minutes = leading_zero(minutes);
        return `${hour}:${minutes}`;
    };
    decrease_current(decrease_time){
        let minutes = parseInt(this.minutes()) - decrease_time;
        let hour = parseInt(this.hour());
        hour = minutes < 0 ? parseInt(hour) - (Math.floor(Math.abs(minutes)/60)+1) : hour;
        minutes = minutes < 0 ? 60 - Math.abs(minutes) : minutes;
        hour = leading_zero(hour);
        minutes = leading_zero(minutes);
        return `${hour}:${minutes}`;
    };
}

function leading_zero(num) {
    let buf = num < 10 ? '0' +  num : num;
    return buf;
}

let time = new Current();
module.exports = {time};
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