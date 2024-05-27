const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27018';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function connect() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

async function close() {
    try {
        await client.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

const Products = {
    async create(product) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Products');
            const result = await collection.insertOne(product);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating product:', error);
            return null;
        }
    },

    async read() {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Products');
            return await collection.find({}).toArray();
        } catch (error) {
            console.error('Error reading products:', error);
            return [];
        }
    },

    async update(id, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Products');
            await collection.updateOne({ _id: id }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating product:', error);
            return false;
        }
    },

    async delete(id) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Products');
            await collection.deleteOne({ _id: id });
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    }
};

const Clients = {
    async create(client) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Clients');
            const result = await collection.insertOne(client);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating client:', error);
            return null;
        }
    },

    async read() {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Clients');
            return await collection.find({}).toArray();
        } catch (error) {
            console.error('Error reading clients:', error);
            return [];
        }
    },

    async update(id, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Clients');
            await collection.updateOne({ _id: id }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating client:', error);
            return false;
        }
    },

    async delete(id) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Clients');
            await collection.deleteOne({ _id: id });
            return true;
        } catch (error) {
            console.error('Error deleting client:', error);
            return false;
        }
    }
};


Carts = {
    async create(cart) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Carts');
            const result = await collection.insertOne(cart);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating cart:', error);
            return null;
        }
    },

    async read() {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Carts');
            return await collection.find({}).toArray();
        } catch (error) {
            console.error('Error reading carts:', error);
            return [];
        }
    },

    async update(id, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Carts');
            await collection.updateOne({ _id: id }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating cart:', error);
            return false;
        }
    },

    async delete(id) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Carts');
            await collection.deleteOne({ _id: id });
            return true;
        } catch (error) {
            console.error('Error deleting cart:', error);
            return false;
        }
    }
};


Deliveries = {
    async create(delivery) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Deliveries');
            const result = await collection.insertOne(delivery);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating delivery:', error);
            return null;
        }
    },

    async read() {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Deliveries');
            return await collection.find({}).toArray();
        } catch (error) {
            console.error('Error reading deliveries:', error);
            return [];
        }
    },

    async update(id, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Deliveries');
            await collection.updateOne({ _id: id }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating delivery:', error);
            return false;
        }
    },

    async delete(id) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Deliveries');
            await collection.deleteOne({ _id: id });
            return true;
        } catch (error) {
            console.error('Error deleting delivery:', error);
            return false;
        }
    }
};


Dishes = {
    async create(dish) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Dishes');
            const result = await collection.insertOne(dish);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating dish:', error);
            return null;
        }
    },

    async read() {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Dishes');
            return await collection.find({}).toArray();
        } catch (error) {
            console.error('Error reading dishes:', error);
            return [];
        }
    },

    async update(id, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Dishes');
            await collection.updateOne({ _id: id }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating dish:', error);
            return false;
        }
    },

    async delete(id) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Dishes');
            await collection.deleteOne({ _id: id });
            return true;
        } catch (error) {
            console.error('Error deleting dish:', error);
            return false;
        }
    }
};


Orders = {
    async create(order) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Orders');
            const result = await collection.insertOne(order);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating order:', error);
            return null;
        }
    },

    async read() {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Orders');
            return await collection.find({}).toArray();
        } catch (error) {
            console.error('Error reading orders:', error);
            return [];
        }
    },

    async update(id, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Orders');
            await collection.updateOne({ _id: id }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating order:', error);
            return false;
        }
    },

    async delete(id) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Orders');
            await collection.deleteOne({ _id: id });
            return true;
        } catch (error) {
            console.error('Error deleting order:', error);
            return false;
        }
    }
};

Suppliers = {
    async create(supplier) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Suppliers');
            const result = await collection.insertOne(supplier);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating supplier:', error);
            return null;
        }
    },

    async read() {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Suppliers');
            return await collection.find({}).toArray();
        } catch (error) {
            console.error('Error reading suppliers:', error);
            return [];
        }
    },

    async update(id, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Suppliers');
            await collection.updateOne({ _id: id }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating supplier:', error);
            return false;
        }
    },

    async delete(id) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Suppliers');
            await collection.deleteOne({ _id: id });
            return true;
        } catch (error) {
            console.error('Error deleting supplier:', error);
            return false;
        }
    }
};
