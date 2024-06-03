const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
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
    async create(name,supplier_name,price,stock) {
        try {
            const product={name,supplier_name,price,stock}
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Products');
            const result = await collection.insertOne(product);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating product:', error);
            return null;
        }
    },

    async read(name) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Products');
            return await collection.findOne({name:name});
        } catch (error) {
            console.error('Error reading products:', error);
            return [];
        }
    },

    async update(name, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Products');
            await collection.updateOne({ name: name }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating product:', error);
            return false;
        }
    },

    async delete(name) {
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
    async create(name,surname,email,password,phone,address,history,reservations) {
        try {
            const client={name,surname,email,password,phone,address,history,reservations}
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Clients');
            const result = await collection.insertOne(client);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating client:', error);
            return null;
        }
    },

    async read(email) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Clients');
            return await collection.findOne({email:email});
        } catch (error) {
            console.error('Error reading clients:', error);
            return [];
        }
    },

    async update(email, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Clients');
            await collection.updateOne({ email: email }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating client:', error);
            return false;
        }
    },

    async delete(email) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Clients');
            await collection.deleteOne({ email: email });
            return true;
        } catch (error) {
            console.error('Error deleting client:', error);
            return false;
        }
    }
};

const Dishes = {
    async create(name,description,price,products) {
        try {
            const dish={name,description,price,products}
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Dishes');
            const result = await collection.insertOne(dish);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating dish:', error);
            return null;
        }
    },

    async read(name) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Dishes');
            return await collection.findOne({name:name});
        } catch (error) {
            console.error('Error reading dishes:', error);
            return [];
        }
    },

    async update(name, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Dishes');
            await collection.updateOne({ name: name }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating dish:', error);
            return false;
        }
    },

    async delete(name) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Dishes');
            await collection.deleteOne({ name: name });
            return true;
        } catch (error) {
            console.error('Error deleting dish:', error);
            return false;
        }
    }
};

const Suppliers = {
    async create(name,contact,products_supplied) {
        try {
            const supplier={name,contact,products_supplied}
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Suppliers');
            const result = await collection.insertOne(supplier);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating supplier:', error);
            return null;
        }
    },

    async read(name) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Suppliers');
            return await collection.findOne({name:name});
        } catch (error) {
            console.error('Error reading suppliers:', error);
            return [];
        }
    },

    async update(name, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Suppliers');
            await collection.updateOne({ name: name }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating supplier:', error);
            return false;
        }
    },

    async delete(name) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Suppliers');
            await collection.deleteOne({ name: name });
            return true;
        } catch (error) {
            console.error('Error deleting supplier:', error);
            return false;
        }
    }
};

const Carts = {
    async create(client_id,dishes) {
        try {
            const cart={client_id,dishes}
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Carts');
            const result = await collection.insertOne(cart);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating cart:', error);
            return null;
        }
    },

    async read(client_id) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Carts');
            return await collection.findOne({client_id:client_id});
        } catch (error) {
            console.error('Error reading carts:', error);
            return [];
        }
    },

    async update(client_id, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Carts');
            await collection.updateOne({ client_id: client_id }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating cart:', error);
            return false;
        }
    },

    async delete(client_id) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Carts');
            await collection.deleteOne({ client_id: client_id });
            return true;
        } catch (error) {
            console.error('Error deleting cart:', error);
            return false;
        }
    }
};


const Orders = {
    async create(client,date,cart,dishes,price,address,status) {
        try {
            const order={client,date,cart,dishes,price,address,status}
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Orders');
            const result = await collection.insertOne(order);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating order:', error);
            return null;
        }
    },

    async read(client) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Orders');
            return await collection.findOne({client:client});
        } catch (error) {
            console.error('Error reading orders:', error);
            return [];
        }
    },

    async update(client, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Orders');
            await collection.updateOne({ client: client }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating order:', error);
            return false;
        }
    },

    async delete(client) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Orders');
            await collection.deleteOne({ client: client });
            return true;
        } catch (error) {
            console.error('Error deleting order:', error);
            return false;
        }
    }
};

const SupplierOrders = {
    async create(supplier_id,date,product,price,status) {
        try {
            const supplierOrder={supplier_id,date,product,price,status}
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('SupplierOrders');
            const result = await collection.insertOne(supplierOrder);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating supplierOrder:', error);
            return null;
        }
    },

    async read(supplier_id) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('SupplierOrders');
            return await collection.findOne({supplier_id:supplier_id});
        } catch (error) {
            console.error('Error reading supplierOrders:', error);
            return [];
        }
    },

    async update(supplier_id, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('SupplierOrders');
            await collection.updateOne({ supplier_id: supplier_id }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating supplierOrder:', error);
            return false;
        }
    },

    async delete(supplier_id) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('SupplierOrders');
            await collection.deleteOne({ supplier_id: supplier_id });
            return true;
        } catch (error) {
            console.error('Error deleting supplierOrder:', error);
            return false;
        }
    }
};

const Admins = {
    async create(name,surname,email,password,phone,address) {
        try {
            const admin={name,surname,email,password,phone,address}
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Admins');
            const result = await collection.insertOne(admin);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating admin:', error);
            return null;
        }
    },

    async read(email) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Admins');
            return await collection.findOne({email:email});
        } catch (error) {
            console.error('Error reading admins:', error);
            return [];
        }
    },

    async update(email, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Admins');
            await collection.updateOne({ email: email }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating admin:', error);
            return false;
        }
    },

    async delete(email) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Admins');
            await collection.deleteOne({ email: email });
            return true;
        } catch (error) {
            console.error('Error deleting admin:', error);
            return false;
        }
    }
};

const Sessions = {
    async create(expires,session) {
        try {
            const session={expires,session}
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Sessions');
            const result = await collection.insertOne(session);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating session:', error);
            return null;
        }
    },

    async read(cookie) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Sessions');
            return await collection.findOne({cookie:cookie});
        } catch (error) {
            console.error('Error reading sessions:', error);
            return [];
        }
    },

    async update(cookie, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Sessions');
            await collection.updateOne({ cookie: cookie }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating session:', error);
            return false;
        }
    },

    async delete(cookie) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Sessions');
            await collection.deleteOne({ cookie: cookie });
            return true;
        } catch (error) {
            console.error('Error deleting session:', error);
            return false;
        }
    }
};

const Reservations = {
    async create(client,date,time,people,isCanceled) {
        try {
            const reservation={client,date,time,people,isCanceled}
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Reservations');
            const result = await collection.insertOne(reservation);
            return result.insertedId;
        } catch (error) {
            console.error('Error creating reservation:', error);
            return null;
        }
    },

    async read(client) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Reservations');
            return await collection.findOne({client:client});
        } catch (error) {
            console.error('Error reading reservations:', error);
            return [];
        }
    },

    async update(client, updates) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Reservations');
            await collection.updateOne({ client: client }, { $set: updates });
            return true;
        } catch (error) {
            console.error('Error updating reservation:', error);
            return false;
        }
    },

    async delete(client) {
        try {
            const database = client.db('RestaurantDataBaseProject');
            const collection = database.collection('Reservations');
            await collection.deleteOne({ client: client });
            return true;
        } catch (error) {
            console.error('Error deleting reservation:', error);
            return false;
        }
    }
};

module.exports = { connect, close, Products, Clients, Dishes, Suppliers, Carts, Orders, SupplierOrders, Admins, Sessions, Reservations };
