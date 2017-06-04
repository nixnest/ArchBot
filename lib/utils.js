exports.fixPings = function(text) {
    return text.replace(/[?<=@](everyone|here)/g,  "\@‍$1");
}
