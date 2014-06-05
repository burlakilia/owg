# One way Gateway

The module can publish messages in a different services using different protocols, which is set in the configuration. 
This package is compatible with  [connect](https://github.com/senchalabs/connect) and [dispath](https://github.com/caolan/dispatch) projects.
You should use this module with  [quip](https://github.com/caolan/quip) to set correct http statuses..

# Install
```
   npm install owg
```


## Example
```
var connect = require('connect'),
    quip = require('quip'),
    owg = require('owg');

var gateway = owg({
	"protocol": "amqp",
	"connection": "amqp://localhost/rabbitmq",
	"exchange": "exchange-name",
	"routingKey": "yourRoutingKey",
	"durable": true
}, console.log);
	
connect()
    .use(quip)
    .use(connect.bodyParser())
    .use(gateway.handle);
	
gateway.send('Application started');
```

## Requests format

Apply only requests with POST methods and body with content type 'application/json'.

## Supported protocols

* rabbtimq

## Http Status
* 202 - messages sent to remote service
* 405 - a request contain incorrect method
* 400 - a request body has an incorrect format or a content type

## Configuration

The configuration of different protocols may be different. To setup the current protocol use the parameter "protocol".

### Amqp configuration
* connection - a connection string has the following format "amqp[s]://hot[:protocol]/[name]"
* exchange - exchange name
* routingKey - the name of the message field, which will be used to route between queues
* durable - the boolean flag, it is false by default. If set then the exchange will be marked as durable. Durable exchanges remain active during a server restarts.



