// Create express app
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
// const db = 
require("./database");

// Server port
var PORT = process.env.PORT || 80;
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(bodyParser.json())
app.use('/room', require('./api/roomRoute'));
app.use('/table', require('./api/tableRoute'));
app.use('/dish', require('./api/dishRoute'));
app.use('/order', require('./api/orderRoute'));
app.use('/orderitem', require('./api/orderItemRoute'));

// Root endpoint
// app.get("/", async (req, res, next) => {
//     // const r = await new db.RoomModel({name:"room 1"}).save()
//     // const r = await db.RoomModel.getAll()
//     // const r = await db.RoomModel.getOne(8);
//     res.json({"message":"Ok"});
// });

// Default response for any other request
app.use(function(req, res){
    console.log("404");
    res.status(404).send('Page not found');
});
app.use(function(err, req, res, next){
    res.status(500).send(err.toString());
});