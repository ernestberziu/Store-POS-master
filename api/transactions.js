let app = require("express")();
let bodyParser = require("body-parser");
let Products = require("./products");
const mongoose = require("./mongose");

app.use(bodyParser.json());

module.exports = app;

const transactionsDB = mongoose.model('transactions', new mongoose.Schema({
  _id: { type: String },
  order: { type: Number },
  ref_number: { type: String },
  discount: { type: Number },
  customer: {
    id: Number,
    name: String,
  },
  status: { type: Number },
  subtotal: { type: String },
  tax: { type: Number },
  order_type: { type: Number },
  items: [{
    id: Number,
    product_name: String,
    barcode: Number,
    price: String,
    quantity: Number
  }],
  date: { type: String },
  payment_type: { type: String },
  payment_info: { type: String },
  total: { type: String },
  paid: { type: String },
  change: { type: String },
  user: { type: String },
  user_id: { type: Number },
}))


app.get("/", function (req, res) {
  res.send("Transactions API");
});


app.get("/all", async function (req, res) {
  try {
    const data = await transactionsDB.find();
    res.send(data);
  }
  catch (error) {
    res.status(500).send(error);
  }
});




app.get("/on-hold", async function (req, res) {
  try {
    const item = await transactionsDB.find(
      { $and: [{ ref_number: { $ne: "" } }, { status: 0 }] })
    res.send(item);
  }
  catch (error) {
    res.status(500).send("ID field is required.");
  }
});



app.get("/customer-orders", async function (req, res) {
  try {
    const item = await transactionsDB.find(
      { $and: [{ customer: { $ne: "0" } }, { status: 0 }, { ref_number: "" }] })
    res.send(item);
  }
  catch (error) {
    res.status(500).send("ID field is required.");
  }
});



app.get("/by-date", async function (req, res) {

  let startDate = new Date(req.query.start);
  let endDate = new Date(req.query.end);

  if (req.query.user == 0 && req.query.till == 0) {
    try {
      const item = await transactionsDB.find(
        { $and: [{ date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } }, { status: parseInt(req.query.status) }] })
      res.send(item);
    }
    catch (error) {
      res.status(500).send("ID field is required.");
    }
  }

  if (req.query.user != 0 && req.query.till == 0) {
    try {
      const item = await transactionsDB.find(
        { $and: [{ date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } }, { status: parseInt(req.query.status) }, { user_id: parseInt(req.query.user) }] })
      res.send(item);
    }
    catch (error) {
      res.status(500).send("ID field is required.");
    }
  }

  if (req.query.user == 0 && req.query.till != 0) {
    try {
      const item = await transactionsDB.find(
        { $and: [{ date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } }, { status: parseInt(req.query.status) }, { till: parseInt(req.query.till) }] })
      res.send(item);
    }
    catch (error) {
      res.status(500).send("ID field is required.");
    }
  }

  if (req.query.user != 0 && req.query.till != 0) {
    try {
      const item = await transactionsDB.find(
        { $and: [{ date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } }, { status: parseInt(req.query.status) }, { till: parseInt(req.query.till) }, { user_id: parseInt(req.query.user) }] })
      res.send(item);
    }
    catch (error) {
      res.status(500).send("ID field is required.");
    }
  }

});



app.post("/new", async function (req, res) {
  let newTransaction = req.body;
  const item = transactionsDB(newTransaction)
  try {
    await item.save();
    if (newTransaction.paid >= newTransaction.total) {
      await Products.decrementInventory(newTransaction.items, res);
    } else res.sendStatus(200);
  }
  catch (error) {
    res.status(500).send(error);
  }
});



app.put("/new", async function (req, res) {
  const options = { new: true };
  try {
    const result = await transactionsDB.findByIdAndUpdate(
      req.body._id, req.body, options
    )
    res.send(result)
  } catch (e) {
    res.status(500).send(e);
  }
});


app.post("/delete", async function (req, res) {
  try {
    await transactionsDB.deleteOne({ _id: req.body.orderId })
    res.sendStatus(200)
  } catch (e) {
    res.status(500).send(e);
  }
});



app.get("/:transactionId", async function (req, res) {
  try {
    const item = await inventoryDB.findById(req.params.transactionId)
    if (item) res.send(item);
  }
  catch (error) {
    res.status(500).send("ID field is required.");
  }
});
