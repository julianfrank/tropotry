var trAPI = require('tropo-webapi'),

    root = function(req, res, next) {
        console.log('root')

        var tropo = new trAPI.TropoWebAPI(),
            say = new Say("Hi, This is Lucy speaking. How can I help You?"),
            choices = new Choices("store,locater,balance,bill,billing,usage,pay,bill,complaint,promotions,plan,clarify,address,move,remove"),
            identifiedUseCase = "Unknown"

        tropo.ask(choices, 3, false, null, "root", null, null, say, 5, null)
        tropo.on("continue", null, "/api/tropo/rootcontinue", true);

        res.status(200).send(trAPI.TropoJSON(tropo))
    },

    rootcontinue = function(req, res, next) {
        console.log('rootcontinue')

        var tropo = new trAPI.TropoWebAPI(),
            answer = req.body['result']['actions']['value']

        switch (answer) {
            case 'store':
            case 'locater':
                identifiedUseCase = 'Store Locator'
                break

            case 'balance':
            case 'usage':
                identifiedUseCase = 'Balance Enquiry'
                break

            case 'billing':
                identifiedUseCase = 'Billing Enquiry'
                break

            case 'pay':
            case 'bill':
                identifiedUseCase = 'Bill Payment Enquiry'
                break

            case 'complaint':
                identifiedUseCase = 'Complaint Booking'
                break

            case 'promotions':
            case 'plan':
                identifiedUseCase = 'Plans and Promotions Enquiry'
                break

            case 'clarify':
                identifiedUseCase = 'Clarification'
                break

            case 'address':
            case 'move':
            case 'remove':
                identifiedUseCase = 'Move and Remove Request'
                break

            default:
        }

        tropo.say("I believe you are looking for " + identifiedUseCase)
        tropo.hangup()

        res.status(200).send(trAPI.TropoJSON(tropo))
    }

exports.root = root
exports.rootcontinue = rootcontinue
