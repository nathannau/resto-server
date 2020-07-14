module.exports = function(db) {
    return class OrderModel {
        constructor(values = {}) {
            this.populate(values);
        }
        populate(values) {
            this.id = values.id || this.id || null;
            this.tableId = values.table.id || values.tableId || this.tableId || null;
            this.createDate = values.createDate || this.createDate || 0;
            this.comment = values.comment || this.comment || "";
            this.status = values.status || this.status || "";
        }
        
        static async init() {
            return new Promise((res, rej) => {
                db.run(
                    `CREATE TABLE IF NOT EXISTS "order" (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tableId INTEGER,
                    createDate INTEGER,
                    comment TEXT,
                    status TEXT,
                    FOREIGN KEY (tableId) REFERENCES "table"(id))`,
                    (err) => { if (err) rej(err); else res(); } 
                );
            });
        }

        async save() {
            if (this.id !== null) {
                await db.runAsync(
                    `UPDATE "order" SET 
                        tableId=$tableId,
                        createDate=$createDate,
                        comment=$comment,
                        status=$status
                    WHERE id=$id`, 
                    {
                        $id: this.id,
                        $tableId: this.tableId,
                        $createDate: this.createDate,
                        $comment: this.comment,
                        $status: this.status,
                    }
                );
            } else {
                const ret = await db.runAsync(
                    `INSERT INTO "order" 
                    (tableId,createDate,comment,status) 
                    VALUES ($tableId,$createDate,$comment,$status)`,
                    { 
                        $tableId: this.tableId,
                        $createDate: this.createDate,
                        $comment: this.comment,
                        $status: this.status,
                    }
                );
                this.id = ret.lastID;
            };
            return this;
        }
        async delete() {
            if (this.id !== null) {
                db.runAsync(
                    `DELETE FROM "order" WHERE id=$id`,
                    { $id: this.id }
                );
                this.id = null;
            } else {
                throw new Error('Entity not exist');
            }
            return this;
        }
        static async getAll() {
            const orders = await db.allAsync(`SELECT * FROM "order"`);
            return orders.map(v=>new OrderModel(v));
        }
        static async getOne(id) {
            const order = await db.getAsync(
                `SELECT * FROM "order" WHERE id=$id`,
                { $id: id }
            );
            if (order === undefined) throw new Error('Entity not found');
            return new OrderModel(order);
        }
    }
}
