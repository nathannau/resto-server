module.exports = function(db) {
    return class RoomModel {
        constructor(values = {}) {
            this.populate(values);
        }
        populate(values) {
            this.id = values.id || this.id || null;
            this.name = values.name || this.name || "";
        }

        static async init() {
            await db.runAsync(`CREATE TABLE IF NOT EXISTS "room" (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT)`);
        }

        async save() {
            if (this.id !== null) {
                await db.runAsync(
                    `UPDATE "room" SET name=$name WHERE id=$id`, 
                    {
                        $id: this.id,
                        $name: this.name,
                    }
                );
            } else {
                const ret = await db.runAsync(
                    `INSERT INTO "room" (name) VALUES ($name)`, 
                    { $name: this.name }
                );
                this.id = ret.lastID;
            };
            return this;
        }
        async delete() {
            if (this.id !== null) {
                db.runAsync(
                    `DELETE FROM "room" WHERE id=$id`,
                    { $id: this.id }
                );
                this.id = null;
            } else {
                throw new Error('Entity not exist');
            }
            return this;
        }
        static async getAll() {
            const rooms = await db.allAsync(`SELECT * FROM "room"`);
            return rooms.map(v=>new RoomModel(v));
        }
        static async getOne(id) {
            const room = await db.getAsync(
                `SELECT * FROM "room" WHERE id=$id`,
                { $id: id }
            );
            if (room === undefined) throw new Error('Entity not found');
            return new RoomModel(room);
        }
    }
}
