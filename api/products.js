const mongoose = require("./mongose");
const app = require("express")();
const bodyParser = require("body-parser");
const async = require("async");


app.use(bodyParser.json());


module.exports = app;
const inventoryDB = mongoose.model('products', new mongoose.Schema({ _id: { type: String }, price: { type: String }, barcode: { type: String }, category: { type: String }, quantity: { type: Number }, name: { type: String }, stock: { type: String }, }))


app.get("/", function (req, res) {
    res.send("Inventory API");
});


app.get("/product/:productId", async function (req, res) {
    if (!req.params.productId) {
        res.status(500).send("ID field is required.");
    } else {
        try {
            const item = await inventoryDB.findById(req.params.productId)
            res.send(item);
        }
        catch (error) {
            res.status(500).send("ID field is required.");
        }
    }
});



app.get("/products", async function (req, res) {
    try {
        const data = await inventoryDB.find();
        res.send(data);
    }
    catch (error) {
        res.status(500).send(error);
    }
});



app.post("/product", async function (req, res) {
    let Product = {
        _id: parseInt(req.body.id),
        price: req.body.price,
        barcode: req.body.barcode,
        category: req.body.category,
        quantity: req.body.quantity == "" ? 0 : req.body.quantity,
        name: req.body.name,
        stock: req.body.stock == "on" ? 0 : 1
    }
    if (!req.body.id) {
        Product._id = Math.floor(Date.now() / 1000);
        const item = inventoryDB(Product)
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
            const result = await inventoryDB.findByIdAndUpdate(
                req.body.id, Product, options
            )
            res.send(result)
        } catch (e) {
            res.status(500).send(e);
        }
    }
});




app.delete("/product/:productId", async function (req, res) {
    try {
        await inventoryDB.deleteOne({ _id: req.params.productId })
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send(e);
    }
});



app.post("/product/barcode", async function (req, res) {
    var request = req.body;
    const allProducts = await inventoryDB.find();
    res.send(allProducts.find((e) => parseInt(e.barcode) === parseInt(request.barCode)));
});

app.decrementInventory = async function (products, res) {
    await async.eachSeries(products, async function (transactionProduct, callback) {
        const product = await inventoryDB.findById(transactionProduct.id)
        if (!product || !product.quantity) {
            res.sendStatus(200);
            callback();
        } else {
            let updatedQuantity =
                parseInt(product.quantity) -
                parseInt(transactionProduct.quantity);

            const options = { new: true };
            await inventoryDB.findByIdAndUpdate(
                product._id, { ...product._doc, quantity: updatedQuantity }, options
            )
            res.sendStatus(200);
            callback()
        }
    });
};