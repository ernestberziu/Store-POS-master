const mongoose = require("./mongose");
const app = require("express")();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

module.exports = app;
const customerDB = mongoose.model('customers', new mongoose.Schema({ _id: { type: String }, name: { type: String }, phone: { type: String }, email: { type: String }, address: { type: String } }))


app.get("/", function (req, res) {
    res.send("Customer API");
});


app.get("/customer/:customerId", async function (req, res) {
    if (!req.params.customerId) {
        res.status(500).send("ID field is required.");
    } else {
        try {
            const item = await customerDB.findById(req.params.customerId)
            res.send(item);
        }
        catch (error) {
            res.status(500).send("ID field is required.");
        }
    }
});


app.get("/all", async function (req, res) {
    try {
        const data = await customerDB.find();
        res.send(data);
    }
    catch (error) {
        res.status(500).send(error);
    }
});


app.post("/customer", async function (req, res) {
    let newCustomer = req.body;
    const item = customerDB(newCustomer)
    try {
        await item.save();
        res.sendStatus(200)
    }
    catch (error) {
        res.status(500).send(error);
    }
});



app.delete("/customer/:customerId", async function (req, res) {
    try {
        await customerDB.deleteOne({ _id: req.params.customerId })
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send(e);
    }
});




app.put("/customer", async function (req, res) {
    const options = { new: true };
    try {
        const result = await customerDB.findByIdAndUpdate(
            req.body._id, req.body, options
        )
        res.send(result)
    } catch (e) {
        res.status(500).send(e);
    }
});



