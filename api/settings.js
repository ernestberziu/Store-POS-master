const mongoose = require("./mongose");
const app = require("express")();
const bodyParser = require("body-parser");


app.use(bodyParser.json());

module.exports = app;
const settingsDB = mongoose.model('settings', new mongoose.Schema({
    _id: { type: Number },
    settings: {
        app: String,
        store: String,
        address_one: String,
        address_two: String,
        contact: String,
        tax: String,
        symbol: String,
        percentage: String,
        charge_tax: String,
        footer: String,
        img: String
    },

}))



app.get("/", function (req, res) {
    res.send("Settings API");
});



app.get("/get", async function (req, res) {
    try {
        const item = await settingsDB.findById(1)
        res.send(item);
    }
    catch (error) {
        res.status(500).send("ID field is required.");
    }
});


app.post("/post", async function (req, res) {
    let Settings = {
        _id: 1,
        settings: {
            "app": req.body.app,
            "store": req.body.store,
            "address_one": req.body.address_one,
            "address_two": req.body.address_two,
            "contact": req.body.contact,
            "tax": req.body.tax,
            "symbol": req.body.symbol,
            "percentage": req.body.percentage,
            "charge_tax": req.body.charge_tax,
            "footer": req.body.footer,
        }
    }

    if (!req.body.id) {
        const item = settingsDB(Settings)
        try {
            await item.save();
            res.sendStatus(200)
        }
        catch (error) {
            res.status(500).send(error);
        }
    }
    else {
        const options = { new: true };
        try {
            await settingsDB.findByIdAndUpdate(
                1, Settings, options
            )
            res.sendStatus(200)
        } catch (e) {
            res.status(500).send(e);
        }
    }
});

