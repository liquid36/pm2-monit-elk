var os = require('os');
const winston = require('winston');
var winstonES = require('winston-elasticsearch');
var elasticsearch = require('elasticsearch');


function log(conf, payload) {
    conf.elasticsearch_url = (process.env.elasticsearch_url!==undefined) ? process.env.elasticsearch_url : conf.elasticsearch_url;
    conf.elasticsearch_index = (process.env.elasticsearch_index!==undefined) ? process.env.elasticsearch_index : conf.elasticsearch_index;
    conf.elasticsearch_user = (process.env.elasticsearch_user!==undefined) ? process.env.elasticsearch_user : conf.elasticsearch_user;
    conf.elasticsearch_password = (process.env.elasticsearch_password!==undefined) ? process.env.elasticsearch_password : conf.elasticsearch_password;

    var client = new elasticsearch.Client({
        host: conf.elasticsearch_url,
        auth: conf.elasticsearch_user + ':' + conf.elasticsearch_password,
        levels: ['error']
    });
    
    var esTransportOpts = {
        level: 'info',
        indexPrefix: conf.elasticsearch_index,
        indexSuffixPattern: 'YYYY.MM.DD',
        client: client,
        ensureMappingTemplate: true
    };
    
    
    var logger = winston.createLogger({
        transports: [
          new winstonES(esTransportOpts)
        ]
    });
    
    var message = os.hostname();
    var meta = payload;
    logger.info(message, meta);
}


module.exports.log = log;
