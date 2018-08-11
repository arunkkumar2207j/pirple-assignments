// Add Dependencies
var http = require('http')
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// Define Server Port
var port = 3000;

// Create Server
var server = http.createServer(function(req, res) {
    // Parse the incoming URL from Client
    var parseUrl = url.parse(req.url, true);

    // Get pathname of incoming URL
    var path = parseUrl.pathname;

    // Trim pathname, so that we get only the pathname with no /
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get QueryString in the form of object
    var queryStringObject = parseUrl.query;

    // Get the header as an object
    var headers = req.headers;

    // Get payload 
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data)
    })
    req.on('end', function() {
        buffer += decoder.end();

        // Choose the handler that the request should serve
        var chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct data to be send to handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        // 
        chooseHandler(data, function(statusCode, payload) {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);
            
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('Returning the response', statusCode, payloadString);
        })
    })    
});

// Define Handlers
var handlers = {}

handlers.hello = function (data, callback) {
    //console.log('Hello Handler called');
    callback(406, {'message':'Welcome to the first API'})
}
handlers.notFound = function(data, callback) {
    callback(404, {})
}

// Listen to Server
server.listen(port, function() {
    console.log(`Listening to port ${port}`);
});

// Set Request Router
var router = {
    'hello': handlers.hello
}

