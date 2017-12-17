"use strict";

//  Data main       ----------------------------------------------------------------------------------------------------
class Element{
    constructor(params) {
        this.id = params.id;
        this.style = params.style;
        this.tag = params.tag;
        this.class = params.class;
        this.text = params.text;
        this.eventName = params.eventName;
        this.function = params.function;
        this.childElement = params.childElement;
    }
}

class ElementCreator {
    constructor(param) {
        this.parent = param.parent;
        this.container = param.container;
    }
    create(){
        addElement(this.parent, this.container);
    }
}
//----------------------------------------------------------------------------------------------------------------------

function addElement(parentElement, component) {
    if (!!component && !!parentElement){
        if (component.length) {
            for (const data of component) {
                parentElement.appendChild(createElement(data));
            }
        } else {
            parentElement.appendChild(createElement(component));
        }
    }
}

function createElement(data) {
    let element = document.createElement(!!data.tag ? data.tag : 'div');
    if (!!data.id) {
        element.id = data.id;
    }
    if (!!data.style) {
        element.style.cssText = data.style;
    }
    if (!!data.class) {
        element.className = data.class;
    }
    if (!!data.text) {
        element.innerHTML = data.text;
    }
    if (typeof data.function === typeof  function () {}){
        if (!!data.eventName) {
            element.addEventListener(data.eventName, data.function);
        }
    }
    if (!!data.childElement) {
        if( data.childElement.length) {
            for (const childElement of data.childElement) {
                element.appendChild(createElement(childElement));
            }
        }else{
            element.appendChild(createElement(data.childElement));
        }
    }
    return element;
}