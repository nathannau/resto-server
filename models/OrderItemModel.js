module.exports = function(db) {
    return class OrderItemModel {
        constructor(values = {}) {
            this.populate(values);
        }
        populate(values) {
            this.id = values.id || this.id || null;
            this.orderId = values.order.id || values.orderId || this.orderId || null;
            this.dishId = values.dish.id || values.dishId || this.dishId || null;
            this.createDate = values.createDate || this.createDate || 0;
            this.comment = values.comment || this.comment || "";
        }
        
        static async init() {
            return new Promise((res, rej) => {
                db.run(
                    `CREATE TABLE IF NOT EXISTS "orderItem" (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    orderId INTEGER,
                    dishId INTEGER,
                    comment TEXT,
                    FOREIGN KEY (orderId) REFERENCES "order"(id),
                    FOREIGN KEY (dishId) REFERENCES "dish"(id))`,
                    (err) => { if (err) rej(err); else res(); } 
                );
            });
        }

        async save() {
            if (this.id !== null) {
                await db.runAsync(
                    `UPDATE "orderItem" SET 
                        orderId=$orderId,
                        dishId=$dishId,
                        comment=$comment
                    WHERE id=$id`, 
                    {
                        $id: this.id,
                        $orderId: this.orderId,
                        $dishId: this.dishId,
                        $comment: this.comment,
                    }
                );
            } else {
                const ret = await db.runAsync(
                    `INSERT INTO "orderItem" (name) VALUES ($name)`, 
                    { $name: this.name }
                );
                this.id = ret.lastID;
            };
            return this;
        }
        async delete() {
            if (this.id !== null) {
                db.runAsync(
                    `DELETE FROM "orderItem" WHERE id=$id`,
                    { $id: this.id }
                );
                this.id = null;
            } else {
                throw new Error('Entity not exist');
            }
            return this;
        }
        static async getAll() {
            const orderItems = await db.allAsync(`SELECT * FROM "orderItem"`);
            return orderItems.map(v=>new OrderItemModel(v));
        }
        static async getOne(id) {
            const orderItem = await db.getAsync(
                `SELECT * FROM "orderItem" WHERE id=$id`,
                { $id: id }
            );
            if (orderItem === undefined) throw new Error('Entity not found');
            return new OrderItemModel(orderItem);
        }
    }
}
