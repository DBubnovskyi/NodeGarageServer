let express = require('express');
let fs = require('fs');
let jsonfile = require('jsonfile');
let router = express.Router();

let file_path = '../data/'; //tennis-booking.json';

let data_sender = {
    time_list : [],
    error_list :[]
};

setInterval(function(){
    let _minutes = new Date().toLocaleString("en-US",{minute: 'numeric'});
    let minutes = _minutes < 10 ? '0' +  _minutes : _minutes;
    let hour = new Date().toLocaleString("en-US",{hour: 'numeric',hour12: false });
    let current_time = hour + ':' + minutes;
    if(current_time >= '23:00'){
        let file_name = 'tennis_booking_' + new Date().toLocaleString("en-US",{day: 'numeric'}) + '-' +
            new Date().toLocaleString("en-US",{month: 'numeric'}) + '-' +
            new Date().toLocaleString("en-US",{year: 'numeric'});
        let file_format = '.json';
        jsonfile.writeFile(file_path + file_name + file_format, time_list, {spaces: 2}, function (err) {
            if (err) throw err;
            else console.log('file ' + file_name + ' saved')
        });
    }
    if(current_time < '05:00'){
        time_list = [];
        error_list = [];
    }
}, 200000);

let time_list = [];
let error_list = [];

class Reserved_time{
    constructor(parameters) {
        this.id = parameters.id;
        this.title = parameters.title;
        this.startTime = parameters.startTime;
        this.endTime = parameters.endTime;
        this.comment = parameters.comment;
    }
}

class Error{
    constructor(parameters) {
        this.error_title = parameters.error_title;
        this.error_text = parameters.error_text;
    }
}

router.get('/', function(req, res) {
    res.render('tennis', { title: 'Tennis EPAM' });
});

router.get('/api', function(req, res) {   //  hostName/tennis/api
    data_sender.time_list = time_list;
    data_sender.error_list = [];
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data_sender));
});

router.get('/api/one_hour', function(req, res) {    //  hostName/tennis/api/one_hour
    data_sender.time_list = [];
    data_sender.error_list = [];

    let _minutes = new Date().toLocaleString("en-US",{minute: 'numeric'});
    let minutes = _minutes < 10 ? '0' +  _minutes : _minutes;
    let hour = new Date().toLocaleString("en-US",{hour: 'numeric',hour12: false });
    let current_time = hour + ':' + minutes;

    for(let i = 0; i < time_list.length; i++){
        let time_diff = (new Date(`01/01/01 ${time_list[i].startTime}`)- new Date(`01/01/01 ${current_time}`)) /3600000;
        if( time_diff < 1 && time_diff > 0){
            data_sender.time_list.push(time_list[i]);
        }else if(time_list[i].startTime <= current_time && time_list[i].endTime >= current_time){
            data_sender.time_list.push(time_list[i]);
        }
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data_sender));
});

router.get('/api/book_time', function(req, res) {   //  hostName/tennis/api/book_time?time=5
    error_list = [];
    let time = req.query.time;
    let title = req.query.title;
    let comment = req.query.comment;
    let reserved_time = new Reserved_time({});

    //let time = 5;

    let minutes = parseInt(new Date().toLocaleString("en-US",{minute: 'numeric'}));
    let hour = parseInt(new Date().toLocaleString("en-US",{hour: 'numeric',hour12: false }));
    let _minutes = minutes < 10 ? '0' +  minutes : minutes;
    let startTime = hour + ':' + _minutes;
    minutes = parseInt(minutes) + parseInt(time);
    hour = minutes > 59 ?  hour + Math.floor(minutes/60) : hour;
    minutes = minutes > 59 ?  minutes%60 : minutes;
    minutes = minutes < 10 ? '0' +  minutes : minutes;
    let endTime = hour + ':' + minutes;


    let time_coincidence = false;
    if(time_list.length > 0) {
        for (let i = 0; i < time_list.length; i++) {
            if(time_list[i].startTime <= startTime && time_list[i].endTime >= startTime) {
                console.log('time coincidence');
                time_coincidence = true;
                startTime = time_list[i].startTime;
                let buf_endTime = time_list[i].endTime.split(':');
                minutes = parseInt(buf_endTime[1]);
                hour = parseInt(buf_endTime[0]);
                minutes = parseInt(minutes) + parseInt(time);
                hour = minutes > 59 ?  hour + Math.floor(minutes/60) : hour;
                minutes = minutes > 59 ?  minutes%60 : minutes;
                minutes = minutes < 10 ? '0' +  minutes : minutes;
                let endTime = hour + ':' + minutes;

                let overlap = false;
                let id = time_list[i].id;
                console.log('start');
                for (let s = 0; s < time_list.length; s++) {
                    if (time_list[s].endTime < startTime || time_list[s].startTime > endTime ) {
                        console.log('if');
                    } else if(time_list[s].id !== id){
                        console.log('else overlap-true');
                        overlap = true;
                        error_list.push({
                            error_title: 'Time is overlap',
                            error_text: 'An attempt to extend the time is unable, time ' + startTime + ' - ' + endTime +
                            ' It\'s overlap with already booked time ' + time_list[s].startTime + ' - ' + time_list[s].endTime
                        });
                    }
                }
                console.log(!overlap);
                if (!overlap) {
                    time_list[i].startTime = startTime;
                    time_list[i].endTime = endTime;
                }
            }
        }
    }
    console.log(time_coincidence);
    if(time_coincidence === false){
        if(time_list.length > 0) {
            for (let i = 0; i < time_list.length; i++) {
                if (time_list[i].endTime < startTime || time_list[i].startTime > endTime) {
                    reserved_time.title = title;
                    reserved_time.startTime = startTime;
                    reserved_time.endTime = endTime;
                    reserved_time.comment = comment;
                    reserved_time.id = guid(4);
                    time_list.push(reserved_time);
                    break;
                } else {
                    error_list.push({
                        error_title: 'Time is overlap',
                        error_text: 'Unable to book time ' + startTime + ' - ' + endTime +
                        ' It\'s overlap with already booked time ' + time_list[i].startTime + ' - ' + time_list[i].endTime
                    });
                }
            }
        }else{
            reserved_time.id = guid(4);
            reserved_time.title = title;
            reserved_time.startTime = startTime;
            reserved_time.endTime = endTime;
            reserved_time.comment = comment;
            time_list.push(reserved_time);
        }
    }

    data_sender.time_list = time_list;
    data_sender.error_list = error_list;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data_sender));
});

router.get('/clear-data', function(req, res) {
    time_list = [];
    data_sender.time_list = [];
    data_sender.error_list = [];
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data_sender));
});

router.get('/api/cancel-current', function(req, res) {
    let _minutes = new Date().toLocaleString("en-US",{minute: 'numeric'});
    let minutes = _minutes < 10 ? '0' +  _minutes : _minutes;
    let hour = new Date().toLocaleString("en-US",{hour: 'numeric',hour12: false });
    let current_time = hour + ':' + minutes;

    let buf = [];
    for(let i = 0; i < time_list.length; i++){
        if(time_list[i].startTime <= current_time && time_list[i].endTime >= current_time){
        }else{
            buf.push(time_list[i]);
        }
    }
    time_list = buf;
    data_sender.time_list = time_list;
    data_sender.error_list = [];
    res.send(data_sender);
});

router.post('/api', function(req, res) {   //  hostName/tennis/api?json={}

    let json = req.query.json;
    let obj = JSON.parse(json);
    error_list = [];

    let reserved_time = new Reserved_time({});

    if (!!obj.title === false){
        error_list.push({error_title: 'Title is not valid', error_text: 'The title value is empty'});
    }else if(obj.title.length < 3){
        error_list.push({error_title: 'Title is not valid', error_text: 'The title should consist of more than 3 characters'});
    }else{
        reserved_time.title = obj.title
    }

    if(!!obj.startTime === false || !!obj.endTime === false){
        if(!!obj.startTime === false){
            error_list.push({error_title: 'Time is not valid', error_text: 'The server got an empty "start time" value'});
        }
        if(!!obj.endTime === false){
            error_list.push({error_title: 'Time is not valid', error_text: 'The server got an empty "end time" value'});
        }
    }else if(obj.startTime > obj.endTime){
        error_list.push({error_title: 'Time is not valid', error_text: 'The "end time" must be later than the "start time"'});
    }else if( (new Date(`01/01/01 ${obj.endTime}`) - new Date(`01/01/01 ${obj.startTime}`)) /3600000 > 1){
        error_list.push({error_title: 'Time is not valid / test', error_text: 'The time that you trying to book is longer than one hour'});
    }else{
        if(time_list.length > 0) {
            for (let i = 0; i < time_list.length; i++) {
                if (time_list[i].endTime < obj.startTime || time_list[i].startTime > obj.endTime ) {
                    reserved_time.startTime = obj.startTime;
                    reserved_time.endTime = obj.endTime;
                }else{
                    error_list.push({
                        error_title: 'Time is overlap',
                        error_text: 'Unable to book time <strong>' + obj.startTime + ' - ' + obj.endTime+ '</strong>. ' +
                        'It\'s overlap with already booked time <strong>' + time_list[i].startTime +' - ' + time_list[i].endTime + '</strong>'
                    });
                }
            }
        }else{
            reserved_time.startTime = obj.startTime;
            reserved_time.endTime = obj.endTime;
        }
    }

    if(!!obj.comment){
        reserved_time.comment = obj.comment;
    }

    if(error_list.length === 0){
        reserved_time.id = guid(4);
        time_list.push(reserved_time);

        data_sender.time_list = time_list;
        data_sender.error_list = [];

        res.status(200);
        res.send(JSON.stringify(data_sender));
    }else{
        data_sender.time_list = time_list;
        data_sender.error_list = error_list;

        res.status(412);
        res.send(JSON.stringify(data_sender));
    }
});

function guid(index) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    function _s4(index) {
        let buf = '';
        for(let i = 0; i < index; i++) buf += '-' + s4();
        return buf;
    }
    return s4() + s4() + _s4(index) + s4() + s4();
}

module.exports = router;

// jsonfile.writeFile(file_path, time_list, {spaces: 2}, function (err) {
//     if (err) throw err;
//     else console.dir(obj)
// });
// jsonfile.readFile(file_path, function(err, obj) {
//     if (err) throw err;
//     else console.lod(obj)
// });
