const jsonfile = require('jsonfile');
const id_generator = require('../id_generator');
const t = require('./time');
const time = t.time;

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
        let _reserved_time = new Reserved_time(this);
        _reserved_time.id = id_generator.id(6);
        time_list.dataArray.push(_reserved_time);
    }
}

class Time_list {
    constructor(parameters){
        this.dataArray = parameters.dataArray;
    }
    add_to_list(){
        let _reserved_time = new Reserved_time(reserved_time);
        _reserved_time.id = id_generator.id(6);
        this.dataArray.push(_reserved_time);
    }
    get_all(){
        return this.dataArray;
    }
    get_hour(){
        let buffer = [];

        let current_time = `${time.current.hour()}:${time.current.minutes()}`;

        for(let i = 0; i < this.dataArray.length; i++){
            let time_diff = (new Date(`01/01/01 ${this.dataArray[i].startTime}`)- new Date(`01/01/01 ${current_time}`)) /3600000;
            if( time_diff < 1 && time_diff > 0){
                buffer.push(this.dataArray[i]);
            }else if(this.dataArray[i].startTime <= current_time && this.dataArray[i].endTime >= current_time){
                buffer.push(this.dataArray[i]);
            }
        }

        return buffer;
    }
    clear(){
        this.dataArray = [];
    }
    save(){
        let file_name = `tennis_booking_${time.day}-${time.month()}-${time.year()}`;
        let file_format = '.json';
        jsonfile.writeFile(file_path + file_name + file_format, this.dataArray, {spaces: 2}, function (err) {
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
let time_list = new Time_list({dataArray : []});
let error = new Error({error_title:''});

module.exports = {reserved_time, time_list, error};