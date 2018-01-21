const express = require('express');
const fs = require('fs');
const jsonfile = require('jsonfile');
const router = express.Router();

const data = require('./moduls/tennis_app/data');
const time = require('./moduls/tennis_app/time');


setInterval(function(){
    let current_time = `${time.current.hour()}:${time.current.minutes()}`;
    if(current_time >= '23:00'){
        data.time_list.save();
    }
    if(current_time < '05:00'){
        data.time_list.clear();
    }
}, 200000);


router.get('/', function(req, res) {
    res.render('tennis', { title: 'Tennis EPAM' });
});

router.get('/api', function(req, res) {   //  hostName/tennis/api
    res.setHeader('Content-Type', 'application/json');
    res.send({time_list:data.time_list,error_list:[]});
});

router.get('/api/one_hour', function(req, res) {    //  hostName/tennis/api/one_hour
    res.setHeader('Content-Type', 'application/json');
    res.send({time_list:data.time_list.get_hour(),error_list:[]});
});

router.get('/api/book_time', function(req, res) {   //  hostName/tennis/api/book_time?time=
    let error_list = [];
    let time = req.query.time;
    let title = req.query.title;
    let comment = req.query.comment;

    //let time = 5;

    let minutes = parseInt(time.current.hour());
    let hour = parseInt(time.current.minutes());
    let _minutes = minutes < 10 ? '0' +  minutes : minutes;
    let startTime = hour + ':' + _minutes;
    minutes = parseInt(minutes) + parseInt(time);
    hour = minutes > 59 ?  hour + Math.floor(minutes/60) : hour;
    minutes = minutes > 59 ?  minutes%60 : minutes;
    minutes = minutes < 10 ? '0' +  minutes : minutes;
    let endTime = hour + ':' + minutes;

    let time_coincidence = false;
    if(data.time_list.length > 0) {
        for (let i = 0; i < data.time_list.length; i++) {
            if(data.time_list[i].startTime <= startTime && data.time_list[i].endTime >= startTime) {
                console.log('time coincidence');
                time_coincidence = true;
                startTime = data.time_list[i].startTime;
                let buf_endTime = data.time_list[i].endTime.split(':');
                minutes = parseInt(buf_endTime[1]);
                hour = parseInt(buf_endTime[0]);
                minutes = parseInt(minutes) + parseInt(time);
                hour = minutes > 59 ?  hour + Math.floor(minutes/60) : hour;
                minutes = minutes > 59 ?  minutes%60 : minutes;
                minutes = minutes < 10 ? '0' +  minutes : minutes;
                let endTime = hour + ':' + minutes;

                let overlap = false;
                let id = data.time_list[i].id;
                console.log('start');
                for (let s = 0; s < data.time_list.length; s++) {
                    if (data.time_list[s].endTime < startTime || data.time_list[s].startTime > endTime ) {
                        console.log('if');
                    } else if(data.time_list[s].id !== id){
                        console.log('else overlap-true');
                        overlap = true;
                        error_list.push({
                            error_title: 'Time is overlap',
                            error_text: 'An attempt to extend the time is unable, time ' + startTime + ' - ' + endTime +
                            ' It\'s overlap with already booked time ' + data.time_list[s].startTime + ' - ' + data.time_list[s].endTime
                        });
                    }
                }
                console.log(!overlap);
                if (!overlap) {
                    data.time_list[i].startTime = startTime;
                    data.time_list[i].endTime = endTime;
                }
            }
        }
    }
    console.log(time_coincidence);
    if(time_coincidence === false){
        if(data.time_list.length > 0) {
            for (let i = 0; i < data.time_list.length; i++) {
                if (data.time_list[i].endTime < startTime || data.time_list[i].startTime > endTime) {
                    data.reserved_time.title = title;
                    data.reserved_time.startTime = startTime;
                    data.reserved_time.endTime = endTime;
                    data.reserved_time.comment = comment;
                    data.reserved_time.add_to_list();
                    break;
                } else {
                    error_list.push({
                        error_title: 'Time is overlap',
                        error_text: 'Unable to book time ' + startTime + ' - ' + endTime +
                        ' It\'s overlap with already booked time ' + data.time_list[i].startTime + ' - ' + data.time_list[i].endTime
                    });
                }
            }
        }else{
            data.reserved_time.title = title;
            data.reserved_time.startTime = startTime;
            data.reserved_time.endTime = endTime;
            data.reserved_time.comment = comment;
            data.reserved_time.add_to_list();
        }
    }

    res.setHeader('Content-Type', 'application/json');
    res.send({time_list:data.time_list,error_list:error_list});
});

router.get('/clear-data', function(req, res) {
    data.time_list.clear();
    res.setHeader('Content-Type', 'application/json');
    res.send({time_list:data.time_list,error_list:[]});
});

router.get('/api/cancel-current', function(req, res) {
    let current_time = `${time.current.hour()}:${time.current.minutes()}`;

    let buf = [];
    for(let i = 0; i < data.time_list.length; i++){
        if(data.time_list[i].startTime <= current_time && data.time_list[i].endTime >= current_time){
            data.time_list[i].endTime = current_time;
        }
    }
    res.send({time_list:data.time_list.get_hour(),error_list:[]});
});

router.post('/api', function(req, res) {   //  hostName/tennis/api?json={}

    let json = req.query.json;
    let obj = JSON.parse(json);
    let error_list = [];

    if (!!obj.title === false){
        error_list.push({error_title: 'Title is not valid', error_text: 'The title value is empty'});
    }else if(obj.title.length < 3){
        error_list.push({error_title: 'Title is not valid', error_text: 'The title should consist of more than 3 characters'});
    }else{
        data.reserved_time.title = obj.title
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
        if(data.time_list.length > 0) {
            for (let i = 0; i < data.time_list.length; i++) {
                if (data.time_list[i].endTime < obj.startTime || data.time_list[i].startTime > obj.endTime ) {
                    data.reserved_time.startTime = obj.startTime;
                    data.reserved_time.endTime = obj.endTime;
                }else{
                    error_list.push({
                        error_title: 'Time is overlap',
                        error_text: 'Unable to book time <strong>' + obj.startTime + ' - ' + obj.endTime+ '</strong>. ' +
                        'It\'s overlap with already booked time <strong>' + data.time_list[i].startTime +' - ' + data.time_list[i].endTime + '</strong>'
                    });
                }
            }
        }else{
            data.reserved_time.startTime = obj.startTime;
            data.reserved_time.endTime = obj.endTime;
        }
    }

    if(!!obj.comment){
        data.reserved_time.comment = obj.comment;
    }

    if(error_list.length === 0){
        data.reserved_time.add_to_list();

        res.status(200);
        res.send({time_list:data.time_list, error_list:[]});
    }else{
        res.status(412);
        res.send({time_list:data.time_list, error_list:error_list});
    }
});

module.exports = router;

// jsonfile.writeFile(file_path, data.time_list, {spaces: 2}, function (err) {
//     if (err) throw err;
//     else console.dir(obj)
// });
// jsonfile.readFile(file_path, function(err, obj) {
//     if (err) throw err;
//     else console.lod(obj)
// });