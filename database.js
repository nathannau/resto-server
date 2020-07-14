const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "db.sqlite"

const db = new sqlite3.Database(DBSOURCE, async (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } 
    console.log('Connected to the SQLite database.')
    // Init 
    await RoomModel.init();
    await TableModel.init();
    await DishModel.init();
    await OrderModel.init();
    await OrderItemModel.init();
});
const RoomModel = require('./models/RoomModel')(db);
const TableModel = require('./models/TableModel')(db);
const DishModel = require('./models/DishModel')(db);
const OrderModel = require('./models/OrderModel')(db);
const OrderItemModel = require('./models/OrderItemModel')(db);

db.runAsync = async (query, params)=>{
    return new Promise((res, rej) => {
        db.run(query, params, function(err) {
            if (err) rej(err); else res(this);
        });
    });
}
db.allAsync = async (query, params)=>{
    return new Promise((res, rej) => {
        db.all(query, params, (err, rows) => {
            if (err) rej(err); else res(rows);
        });
    });
}
db.getAsync = async (query, params)=>{
    return new Promise((res, rej) => {
        db.get(query, params, (err, row) => {
            if (err) rej(err); else res(row);
        });
    });
}

module.exports = { db, RoomModel, TableModel, DishModel, OrderModel, OrderItemModel };
