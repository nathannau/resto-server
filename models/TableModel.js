module.exports = function(db) {
    return class TableModel {
        constructor(values = {}) {
            this.populate(values);
        }
        populate(values) {
            this.id = values.id || this.id || null;
            this.name = values.name || this.name || "";
            this.roomId = values.room.id || values.roomId || this.roomId || null;
        }

        static async init() {
            return new Promise((res, rej) => {
                db.run(
                    `CREATE TABLE IF NOT EXISTS "table" (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    roomId INTEGER,
                    FOREIGN KEY (roomId) REFERENCES room(id))`,
                    (err) => { if (err) rej(err); else res(); } 
                );
            });
        }

        async save() {
            if (this.id !== null) {
                await db.runAsync(
                    `UPDATE "table" SET name=$name, roomId=$roomId WHERE id=$id`, 
                    {
                        $id: this.id,
                        $name: this.name,
                        $roomId: this.roomId,
                    }
                );
            } else {
                const ret = await db.runAsync(
                    `INSERT INTO "table" (name, roomId) VALUES ($name, $roomId)`, 
                    { 
                        $name: this.name,
                        $roomId: this.roomId,
                    }
                );
                this.id = ret.lastID;
            };
            return this;
        }
        async delete() {
            if (this.id !== null) {
                db.runAsync(
                    `DELETE FROM "table" WHERE id=$id`,
                    { $id: this.id }
                );
                this.id = null;
            } else {
                throw new Error('Entity not exist');
            }
            return this;
        }
        static async getAll() {
            const tables = await db.allAsync(`SELECT * FROM "table"`);
            return tables.map(v=>new TableModel(v));
        }
        static async getOne(id) {
            const table = await db.getAsync(
                `SELECT * FROM "table" WHERE id=$id`,
                { $id: id }
            );
            if (table === undefined) throw new Error('Entity not found');
            return new TableModel(table);
        }
    }
}
