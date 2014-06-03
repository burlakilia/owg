function handle(send, logger) {

    function admix(msg) {
        msg.timestamp = Date.now();

        return msg;
    }

    return function (req, res) {
        var messages;

        if (req.method !== 'POST') {
            logger.warn('Incorrect method ' + req.method + '. Handler waiting POST');
            return res.notAllowed(' ');
        }

        if (!req.body) {
            logger.warn('Request contain incorrect body');
            return res.badRequest(' ');
        }

        messages = req.body.length ? req.body : [ req.body ];
        messages.map(admix).forEach(send);

        res.accepted(' ');
        logger.trace('All requests sent');
    };

}

module.exports = function (cfg, log) {
    var adapter = require('./adapters/' + cfg.protocol),
        publish = adapter.init(cfg, log);

    console.log(cfg);

    return { publish: publish, handle: handle(publish, log) };
};