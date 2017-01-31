var trRoutes = require('./trroutes.js'),
  express = require('express'),
  bodyParser = require('body-parser'),
  jsonParser = bodyParser.json(),
  localPort = process.env.PORT || 80,
  localIP = process.env.IP || '0.0.0.0',
  app = express(),
  accessCounts = {},
  routeLog = []

app.route('/')
  .all(function(req, res, next) {
    res.send('Tropo Testing App...<br>' + JSON.stringify(accessCounts) + '<br>' + routeLog)
  })

var tropoLog = function(req, res, next) {
  res.set({
    'Cache-Control': 'no-cache'
  })
  res.type('application/json')

  accessCounts[req.method + req.path] = accessCounts[req.method + req.path] ? accessCounts[req.method + req.path] + 1 : 1;

  var accessDetails = {
    callId: (req.body.session ? req.body.session.callId : req.body.result.callId),
    asrresult: (req.body.result ? {
      name: req.body.result.actions.name,
      value: req.body.result.actions.value
    } : 'Root Node')
  }

  routeLog.unshift(JSON.stringify(accessDetails, null, 2));
  next()
}


/**
 * Tropo specific handlers for https://jfdn-julianfrank1.c9users.io/api/tropo/pstn
 */
app.post('/api/tropo/pstn', jsonParser, tropoLog, trRoutes.root)
app.post('/api/tropo/rootcontinue', jsonParser, tropoLog, trRoutes.rootcontinue)

app.listen(localPort, localIP, function() {
  console.log('Tropo App listening on ' + localIP + ":" + localPort)
})
