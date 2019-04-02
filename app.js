var pm2monit     = require('./lib/process.js');
var eslogger    = require('./lib/eslogger.js');

var conf = {
    interval: 5,
    elasticsearch_url: "localhost:9200",
    elasticsearch_index: "server_monitoring",
    elasticsearch_user: "",
    elasticsearch_password: ""
}

function refreshMetrics() {
    conf.interval = (process.env.interval!==undefined) ? process.env.interval : conf.interval;

    pm2monit.getMetrics(function (error, results) {
        if (error) return;
        results.forEach(function (metric) {
            eslogger.log(conf, metric);
        });
    });
    
    setTimeout(function() {
        refreshMetrics();
    }, conf.interval * 1000);
    
    
}

refreshMetrics();