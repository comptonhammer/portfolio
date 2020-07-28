//@ts-check
module.exports = function(app) {
    let log = require('clg-color');
    log.info("% Root dir:", global.appRoot);

    const PORT = process.env.PORT || process.env.PORT_CONF;

    let listener = app.listen(PORT, function () {
        log.info('% Express listening on port ' + listener.address().port + '...');
    });
}
