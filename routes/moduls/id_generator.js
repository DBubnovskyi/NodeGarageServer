module.exports = {guid, id};

function guid(index) {
    function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);}
    function _s4(index) {
        let buf = '';
        for(let i = 0; i < index; i++)
            buf += `-${s4()}`;
        return buf;
    }
    return s4() + s4() + _s4(index) + s4() + s4();
}

function id(index) {
    function s4() {return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);}
    function _s4(index) {
        let buf = '';
        for(let i = 0; i < index-1; i++)
            buf += `-${s4()}`;
        return buf;
    }
    return `${s4()}${_s4(index)}`;
}