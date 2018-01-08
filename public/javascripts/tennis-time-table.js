'use strict';

get_data();
window.setInterval(function(){get_data();}, 5000);

let time_form = document.getElementById('time-form');
let time_table = document.getElementById('time-table');

time_form.querySelector('.time-submit').addEventListener('click', post_data);

function get_data(){
    let xhr = new XMLHttpRequest();
    xhr.open('get', '/tennis/api', true);
    xhr.send();
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200) {
            time_table.querySelector('.content').innerHTML = '';
            let jsonObj = JSON.parse(xhr.responseText);
            console.log(jsonObj);
            let time_list = jsonObj.time_list;
            if(time_list.length > 0){
                for(let i = 0; i < time_list.length; i++){
                    new ElementCreator({
                        parent : time_table.querySelector('.content'),
                        container : new Element({
                            class : 'hero is-small is-dark bg-tennis-dark', tag : 'section',
                            childElement : new Element({
                                class: 'hero-body',
                                childElement : new Element({
                                    class: 'container',
                                    childElement : [
                                        new Element({class: 'subtitle is-4', tag : 'p',text : time_list[i].startTime + ' - ' + time_list[i].endTime}),
                                        new Element({class: 'title is-4', tag : 'p',text : time_list[i].title}),
                                        new Element({class: 'subtitle is-6', tag : 'p',text : time_list[i].comment}),
                                    ]
                                })
                            }),
                        })
                    }).create();
                }
            }
            let error_list = jsonObj.error_list;
            for(let i = 0; i < error_list.length; i++){
                new ElementCreator({
                    parent : time_form.querySelector('.error'),
                    container : new Element({
                        class : 'notification is-warning',
                        childElement : [
                            new Element({tag:'button',class:'delete'}),
                            new Element({tag:'strong',text:error_list[i].error_title}),
                            new Element({tag:'p',text:error_list[i].error_text})
                        ],
                    })
                }).create();
            }
        }
    }
}

function post_data() {

    time_form.querySelector('.error').innerHTML = '';

    let xhr = new XMLHttpRequest();

    let obj = ({
        title : document.getElementById('time-form').querySelector('.time-title').value,
        startTime :document.getElementById('time-form').querySelector('.time-start').value,
        endTime : document.getElementById('time-form').querySelector('.time-end').value,
        comment : document.getElementById('time-form').querySelector('.time-comment').value
    });
    let body = 'json=' + JSON.stringify(obj);
    xhr.open('post', '/tennis/api?' + body, true);xhr.send();
    //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    let s = 0;
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4 /*&& xhr.status === 200*/)
        {
            time_table.querySelector('.content').innerHTML = '';
            let jsonObj = JSON.parse(xhr.responseText);
            console.log(jsonObj);
            let time_list = jsonObj.time_list;
            if(time_list.length > 0){
                for(let i = 0; i < time_list.length; i++){
                    new ElementCreator({
                        parent : time_table.querySelector('.content'),
                        container : new Element({
                            class : 'hero is-small is-dark bg-tennis-dark', tag : 'section',
                            childElement : new Element({
                                class: 'hero-body',
                                childElement : new Element({
                                    class: 'container',
                                    childElement : [
                                        new Element({class: 'subtitle is-4', tag : 'p',text : time_list[i].startTime + ' - ' + time_list[i].endTime}),
                                        new Element({class: 'title is-4', tag : 'p',text : time_list[i].title}),
                                        new Element({class: 'subtitle is-6', tag : 'p',text : time_list[i].comment}),
                                    ]
                                })
                            }),
                        })
                    }).create();
                }
            }
            time_form.querySelector('.error').innerHTML = '';
            let error_list = jsonObj.error_list;
            for(let i = 0; i < error_list.length; i++){
                new ElementCreator({
                    parent : time_form.querySelector('.error'),
                    container : new Element({
                        class : 'notification is-warning',
                        childElement : [
                            new Element({tag:'button',class:'delete'}),
                            new Element({tag:'strong',text:error_list[i].error_title}),
                            new Element({tag:'p',text:error_list[i].error_text})
                        ],
                    })
                }).create();
            }
        }
    };

}

function fill_buffer() {

}

function createHourEnd(endHour) {
    new ElementCreator({
        parent : timeTable,
        container : new Element({
            class : 'hour',
            childElement : [
                new Element({class: 'time', childElement : new Element({class: 'time-text',text: endHour+':00'})}),
                new Element({class: 'space is-hidden-mobile', childElement : new Element({class: 'line'})}),
                new Element({class: 'endLine', childElement : new Element({class: 'line'})}),
                new Element({class: 'space is-hidden-mobile', childElement : new Element({class: 'line'})}),
                new Element({class: 'time', childElement : new Element({class: 'time-text',text: endHour+':00'})})
            ]
        })
    }).create();
}

/*let timeTable = document.getElementById('tennis-time-table');
 let timeClock = document.getElementById('tennis-current-time');

 timeClock.querySelector('.title').innerHTML = new Date().toLocaleTimeString();
 window.setInterval(function s(){
 timeClock.querySelector('.title').innerHTML = new Date().toLocaleTimeString();
 }, 1000);


 let hour = new ElementCreator({parent : timeTable, container : [
 new Element({tag: 'h1', class: 'title is-hidden-mobile'}),
 new Element({tag: 'h1', class: 'title', text : new Date().toISOString().substr(0,10)}),
 new Element({tag: 'h2', class: 'subtitle', text : 'Schedule'})
 ]}).create();*/