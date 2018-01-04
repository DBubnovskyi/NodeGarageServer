let express = require('express');
let fs = require('fs');
let jsonfile = require('jsonfile');
let router = express.Router();

let file_path = '../data/tennis-booking.json';

let data = {
    time_list : [],
    error_list :[]
};

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

let time_list = [];

router.get('/', function(req, res) {
    res.render('tennis', { title: 'Garage EPAM' });
});

router.get('/api', function(req, res) {
    res.send(time_list);
});

router.get('/clear-data', function(req, res) {
    time_list = [];
    res.send(time_list);
});

router.post('/api', function(req, res) {

    let json = req.query.json;
    let obj = JSON.parse(json);

    let error_list = [];

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
                        error_text: 'Unable book time <strong>' + obj.startTime + ' - ' + obj.endTime+ '</strong>. ' +
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
        time_list.push(reserved_time);
        res.status(200);
        res.send(JSON.stringify(time_list));
    }else{
        res.status(412);
        res.send(JSON.stringify(error_list));
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
        return index;
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
