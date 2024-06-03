const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function baseAggregate(db) {
    const ordersCollection = db.collection('Orders');
    const clientsCollection = db.collection('Clients');

    const pipeline = [
        {
            $lookup: {
                from: 'Clients',
                localField: 'client.client_id',
                foreignField: '_id',
                as: 'clientDetails'
            }
        },
        {
            $unwind: '$clientDetails'
        },
        {
            $group: {
                _id: '$client.client_id',
                totalSpent: { $sum: '$price' },
                totalDishesOrdered: { $sum: { $size: '$dishes' } },
                clientInfo: { $first: '$clientDetails' }
            }
        },
        {
            $project: {
                _id: 0,
                client_id: '$_id',
                clientName: { $concat: ['$clientInfo.name', ' ', '$clientInfo.surname'] },
                totalSpent: 1,
                totalDishesOrdered: 1
            }
        },
        {
            $sort: { totalSpent: -1 }
        }
    ];

    const result = await ordersCollection.aggregate(pipeline).toArray();
    console.log('Client Spending Report:', result);
}

async function main() {
    const uri = "mongodb://localhost:27017/"; // replace with your MongoDB connection string
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('RestaurantDataBaseProject');
        await baseAggregate(database);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
