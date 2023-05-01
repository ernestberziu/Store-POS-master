const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://eberziu1:Ernest2000@marketolci.vjpdm8h.mongodb.net/olci', { useNewUrlParser: true })
    .then(() => console.error('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));;
const app = require("express")();

const bodyParser = require("body-parser");
const btoa = require('btoa');
app.use(bodyParser.json());

module.exports = app;

const usersDB = mongoose.model('users', new mongoose.Schema({
    _id: { type: Number },
    username: { type: String },
    password: { type: String },
    fullname: { type: String },
    perm_products: { type: Number },
    perm_categories: { type: Number },
    perm_transactions: { type: Number },
    perm_users: { type: Number },
    perm_settings: { type: Number },
    status: { type: String },
}))


app.get("/", function (req, res) {
    res.send("Users API");
});



app.get("/user/:userId", async function (req, res) {
    if (!req.params.userId) {
        res.status(500).send("ID field is required.");
    } else {
        try {
            const item = await usersDB.findById(req.params.userId)
            res.send(item);
        }
        catch (error) {
            res.status(500).send("ID field is required.");
        }
    }
});



app.get("/logout/:userId", async function (req, res) {
    if (!req.params.userId) {
        res.status(500).send("ID field is required.");
    } else {
        try {
            await usersDB.findByIdAndUpdate(req.params.userId, {
                $set: {
                    status: 'Logged Out_' + new Date()
                }
            })
            res.send(200);
        }
        catch (error) {
            res.status(500).send("ID field is required.");
        }
    }
});



app.post("/login", async function (req, res) {
    console.log(req.body)
    try {
        const item = await usersDB.findOne({
            username: req.body.username,
            password: btoa(req.body.password)
        })
        console.log(item)
        if (item) {
            await usersDB.findByIdAndUpdate(item._id, {
                $set: {
                    status: 'Logged In_' + new Date()
                }
            })
            res.send(item);
        }
    }
    catch (error) {
        res.status(500).send("ID field is required.");
    }
});




app.get("/all", async function (req, res) {
    try {
        const data = await usersDB.find();
        res.send(data);
    }
    catch (error) {
        res.status(500).send(error);
    }
});



app.delete("/user/:userId", async function (req, res) {
    try {
        await usersDB.deleteOne({ _id: req.params.userId })
        res.sendStatus(200)
    } catch (e) {
        res.status(500).send(e);
    }
});


app.post("/post", async function (req, res) {
    let User = {
        "username": req.body.username,
        "password": btoa(req.body.password),
        "fullname": req.body.fullname,
        "perm_products": req.body.perm_products == "on" ? 1 : 0,
        "perm_categories": req.body.perm_categories == "on" ? 1 : 0,
        "perm_transactions": req.body.perm_transactions == "on" ? 1 : 0,
        "perm_users": req.body.perm_users == "on" ? 1 : 0,
        "perm_settings": req.body.perm_settings == "on" ? 1 : 0,
        "status": ""
    }

    if (!req.body.id) {
        User._id = Math.floor(Date.now() / 1000);
        const item = usersDB(User)
        try {
            await item.save();
            res.send(item)
        }
        catch (error) {
            res.status(500).send(error);
        }
    }
    else {
        try {
            await usersDB.findByIdAndUpdate(parseInt(req.body.id), {
                $set: {
                    username: req.body.username,
                    password: btoa(req.body.password),
                    fullname: req.body.fullname,
                    perm_products: req.body.perm_products == "on" ? 1 : 0,
                    perm_categories: req.body.perm_categories == "on" ? 1 : 0,
                    perm_transactions: req.body.perm_transactions == "on" ? 1 : 0,
                    perm_users: req.body.perm_users == "on" ? 1 : 0,
                    perm_settings: req.body.perm_settings == "on" ? 1 : 0
                }
            })
            res.sendStatus(200);
        } catch (e) {
            res.status(500).send(e);
        }
    }
});


app.get("/check", async function (req, res) {
    try {
        const item = await usersDB.findById(1)
        console.log(item)
        if (!item) {
            let User = {
                "_id": 1,
                "username": "admin",
                "password": btoa("admin"),
                "fullname": "Administrator",
                "perm_products": 1,
                "perm_categories": 1,
                "perm_transactions": 1,
                "perm_users": 1,
                "perm_settings": 1,
                "status": ""
            }
            const user = usersDB(User)
            await user.save()
        }
        res.status(200);
    } catch (e) {
        res.status(500).send(e);
    }

});
