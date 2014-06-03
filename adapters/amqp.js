var amqp = require('amqp'),
    async = require('async');

var ready = false,
    exchange,
    config,
    logger;

function send(msg) {

    if (!ready) {
        logger.warn('Exchange doesn\'t ready.');
        return;
    }

    if (!msg || !msg[config.routingKey] || !msg.timestamp) {
        logger.warn('Message have incorrect format:', msg);
        return;
    }

    exchange.publish(config.routingKey, msg, {deliveryMode: 2, contentType: 'application/json'});
    logger.trace('Message send to exchange:', msg);
}

exports.init = function (cfg, log) {

    function complete(err, res) {

        if (err) {
            logger.error('Initialization error:', err);
            return;
        }

        exchange = res;
        ready = true;
    }

    config = cfg;
    logger = log;

    async.waterfall([

        function (next) {

            var conn = amqp.createConnection({ url: config.connection }).on('ready', function () {
                next(null, conn);
            });

        },

        function (connection, next) {

            var exc = connection.exchange(config.exchange, { durable: !!cfg.durable, type: 'topic',  autoDelete: !!cfg.autoDelete }).on('open', function () {
                next(null, exc);
            });

        }

    ], complete);

    return send;
};
