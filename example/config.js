module.exports = function () {
  var host = 'localhost';
  var port = process.env.PORT || 5001;
  var endpoint = 'http://' + host + ':' + port;
  var cdn_url = endpoint + '/cdn/';
  var backend_url = endpoint + '/backend.html';
  return {
    "cdn":{
        "url": cdn_url
    },
    "parameters": {
        "urls": [
            {"pattern": "/pattern/.*-(\\d+)", "names": ["storyId"]}
        ],
        "servers": {
            "local": endpoint
        }
    },
    "backend": [
        {
            "fn": "selectGoogle",
            "target":"http://www.google.com",
            "host":"google.com"
        },
        {
            "pattern": "/quiet/.*",
            "timeout": "1000",
            "target": backend_url,
            "host": host,
            "ttl":"10s",
            "quietFailure": true
        },
        {
            "pattern": ".*",
            "timeout": "1000",
            "target": endpoint,
            "host": host,
            "ttl":"10s",
            "cacheKey":"backend:{{url:path}}",
            "dontPassUrl": false,
            "quietFailure": false
        }
    ],
    "statusCodeHandlers":{
        "403":{
            "fn":"handle403",
            "data":{
                "redirect":"http://www.google.com"
            }
        }
    },
    "circuitbreaker":{
        "windowDuration":10000,
        "numBuckets": 10,
        "errorThreshold": 20,
        "volumeThreshold": 5,
        "includePath":true,
        "publishToRedis":"redis://redis:6379?db=0"
    },
    "cache": {
        "engine": "redis",
        "url":"redis://redis:6379?db=0",
        "apiEnabled": true
    },
    "hogan": {
        "delimiters": "{{ }}"
    }
  }
};
