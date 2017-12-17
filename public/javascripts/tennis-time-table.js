'use strict';
/*import { Element, ElementCreator } from "element-processor";*/
/*

let timeTable = document.getElementById('tennis-time-table');
let timeClock = document.getElementById('tennis-current-time');

timeClock.querySelector('.title').innerHTML = new Date().toLocaleTimeString();
window.setInterval(function s(){
    timeClock.querySelector('.title').innerHTML = new Date().toLocaleTimeString();
}, 1000);


let hour = new ElementCreator({parent : timeTable, container : [
    new Element({tag: 'h1', class: 'title is-hidden-mobile'}),
    new Element({tag: 'h1', class: 'title', text : new Date().toISOString().substr(0,10)}),
    new Element({tag: 'h2', class: 'subtitle', text : 'Schedule'})
]}).create();

let i;
for(i = 8; i < 21; i++)
    createHour(i);
createHourEnd(i);

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

function createHour(startHour) {
    let lines = new Element({
        class: 'space is-hidden-mobile',
        childElement: [
            new Element({class: 'line'}),
            new Element({class: 'empty'}),
            new Element({class: 'line'}),
            new Element({class: 'empty'})
        ]
    });

    let time = new Element({class: 'time', childElement: [
        new Element({class: 'time-text', text: startHour+':00'}),
        new Element({class: 'time-text', text: startHour+':30'})
        ]
    });

    new ElementCreator({
        parent : timeTable,
        container :
            new Element({class: 'hour', childElement: [
                time,
                lines,
                new Element({
                    class: 'timetable',
                    childElement: [
                        new Element({class: 'line'}),
                        new Element({class: 'line'}),
                        new Element({class: 'line'}),
                        new Element({class: 'line'})
                    ]
                }),
                lines,
                time
                ]
            })
    }).create();
}*/
