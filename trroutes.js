var trAPI = require('tropo-webapi'),

    root = function(req, res, next) {
        console.log('root')

        var tropo = new trAPI.TropoWebAPI(),
            say = new Say("What's your favorite color?  Choose from red, blue or green."),
            choices = new Choices("red, blue, green")

        tropo.ask(choices, 3, false, null, "color", null, null, say, 5, null);
        tropo.on("continue", null, "/api/tropo/rootcontinue", true);

        res.status(200).send(trAPI.TropoJSON(tropo))
    },

    rootcontinue = function(req, res, next) {
        console.log('rootcontinue')

        var tropo = new trAPI.TropoWebAPI(),
            answer = req.body['result']['actions']['value']

        tropo.say("You Said ..." + answer)
        tropo.hangup()

        res.status(200).send(trAPI.TropoJSON(tropo))
    }

exports.root = root
exports.rootcontinue = rootcontinue
