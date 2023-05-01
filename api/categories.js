const mongoose = require("./mongose");
const app = require("express")();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

module.exports = app;
const categoryDB = mongoose.model('categories', new mongoose.Schema({ _id: { type: String }, id: { type: String }, name: { type: String } }))


app.get("/", function (req, res) {
    res.send("Category API");
});



app.get("/all", async function (req, res) {
    try {
        const data = await categoryDB.find();
        res.send(data);
    }
    catch (error) {
        res.status(500).send(error);
    }
});


app.post("/category", async function (req, res) {
    let newCategory = req.body;
    newCategory._id = Math.floor(Date.now() / 1000);
    const item = categoryDB(newCategory)
    try {
        await item.save();
        res.sendStatus(200)
    }
    catch (error) {
        res.status(500).send(error);
    }
});



app.delete("/category/:categoryId", async function (req, res) {
    try {
        await categoryDB.deleteOne({ _id: req.params.categoryId })
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send(e);
    }
});




app.put("/category", async function (req, res) {
    const id = req.body.id;
    const options = { new: true };
    try {
        const result = await categoryDB.findByIdAndUpdate(
            id, req.body, options
        )
        res.send(result)
    } catch (e) {
        res.status(500).send(e);
    }
});



