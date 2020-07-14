module.exports = function(db) {
    return class DishModel {
        constructor(values = {}) {
            this.populate(values);
        }
        populate(values) {
            this.id = values.id || this.id || null;
            this.dishParentId = values.dishParent.id || values.dishParentId || this.dishParentId || null;
            this.shortname = values.shortname || this.shortname || "";
            this.name = values.name || this.name || "";
            this.description = values.description || this.description || "";
            this.price = values.price || this.price || "";
        }

        static async init() {
            return new Promise((res, rej) => {
                db.run(
                    `CREATE TABLE IF NOT EXISTS "dish" (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    dishParentId INTEGER
                    shortname TEXT,
                    name TEXT,
                    description TEXT,
                    price REAL,
                    FOREIGN KEY (dishParentId) REFERENCES dish(id))`,
                    (err) => { if (err) rej(err); else res(); } 
                );
            });
        }

        async save() {
            if (this.id !== null) {
                await db.runAsync(
                    `UPDATE "dish" SET 
                        dishParentId=$dishParentId, 
                        shortname=$shortname, 
                        name=$name, 
                        description=$description, 
                        price=$price
                    WHERE id=$id`, 
                    {
                        $id: this.id,
                        $dishParentId: this.dishParentId,
                        $shortname: this.shortname,
                        $name: this.name,
                        $description: this.description,
                        $price: this.price,                    
                    }
                );
            } else {
                const ret = await db.runAsync(
                    `INSERT INTO "dish" 
                    (dishParentId,shortname,name,description,price) 
                    VALUES ($dishParentId,$shortname,$name,$description,$price)`, 
                    { 
                        $dishParentId: this.dishParentId,
                        $shortname: this.shortname,
                        $name: this.name,
                        $description: this.description,
                        $price: this.price,                    
                    }
                );
                this.id = ret.lastID;
            };
            return this;
        }
        async delete() {
            if (this.id !== null) {
                db.runAsync(
                    `DELETE FROM "dish" WHERE id=$id`,
                    { $id: this.id }
                );
                this.id = null;
            } else {
                throw new Error('Entity not exist');
            }
            return this;
        }
        static async getAll() {
            const tables = await db.allAsync(`SELECT * FROM "dish"`);
            return dishs.map(v=>new DishModel(v));
        }
        static async getOne(id) {
            const dish = await db.getAsync(
                `SELECT * FROM "dish" WHERE id=$id`,
                { $id: id }
            );
            if (dish === undefined) throw new Error('Entity not found');
            return new DishModel(dish);
        }
    }
}
