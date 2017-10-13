var express = require('express');
var eventApi = require('./events/api');

var router = express.Router();
router.get('/events/test', eventApi.test);
router.get('/events/list', eventApi.list);

module.exports = router;