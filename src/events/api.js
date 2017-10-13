var events = require('./initialData');

var test = function(req, res){
    res.end('Coolio');
}

var list = function(req, res){
    res.send(events);
}

module.exports = {
    test: test,
    list: list
}