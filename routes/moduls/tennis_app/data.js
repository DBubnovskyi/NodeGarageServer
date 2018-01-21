const jsonfile = require('jsonfile');
const id_generator = require('../id_generator');
const time = require('./time');

let file_path = '../data/'; //tennis-booking.json';

class Reserved_time{
    constructor(parameters) {
        this.id = parameters.id;
        this.title = parameters.title;
        this.startTime = parameters.startTime;
        this.endTime = parameters.endTime;
        this.comment = parameters.comment;
    }
    add_to_list(){
        this.id = id_generator.id(6);
        time_list.push(this);
    }
}

class Time_list {
    constructor(parameters){
        this.time_list = parameters.time_list;
    }
    get_hour(){
        let buffer = [];

        let current_time = `${time.current.hour()}:${time.current.minutes()}`;

        for(let i = 0; i < time_list.length; i++){
            let time_diff = (new Date(`01/01/01 ${time_list[i].startTime}`)- new Date(`01/01/01 ${current_time}`)) /3600000;
            if( time_diff < 1 && time_diff > 0){
                buffer.push(time_list[i]);
            }else if(time_list[i].startTime <= current_time && time_list[i].endTime >= current_time){
                buffer.push(time_list[i]);
            }
        }

        return buffer;
    }
    clear(){
        this.time_list = [];
    }
    save(){
        let file_name = `tennis_booking_${time.current.day()}-${time.current.month()}-${time.current.year()}`;
        let file_format = '.json';
        jsonfile.writeFile(file_path + file_name + file_format, time_list, {spaces: 2}, function (err) {
            if (err) throw err;
            else console.log('file ' + file_name + ' saved')
        });
    }
}

class Error{
    constructor(parameters) {
        this.error_title = parameters.error_title;
        this.error_text = parameters.error_text;
    }
}

let reserved_time = new Reserved_time({id:''});
let time_list = new Time_list({time_list : []});
let error = new Error({error_title:''});

module.exports = {reserved_time, time_list, error};