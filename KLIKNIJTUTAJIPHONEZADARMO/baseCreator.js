import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { MongoClient } = require('mongodb');
const fs = require('fs');

const schemas = {
    Products: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "supplier_name", "stock"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                supplier_name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                stock: {
                    bsonType: "object",
                    required: ["quantity", "unit"],
                    properties: {
                        quantity: {
                            bsonType: "int",
                            description: "must be an int and is required"
                        },
                        unit: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    }
                }
            }
        }
    },
    Clients: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'name',
            'surname',
            'email',
            'password',
            'phone',
            'address',
            // 'history',
            // 'reservations'
          ],
          properties: {
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            surname: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            email: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            password: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            phone: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            address: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            // history: {
            //   bsonType: 'array',
            //   description: 'must be an array if present',
            //   items: {
            //     bsonType: ['object', 'null'],
            //     required: [
            //       'order_id',
            //       'date',
            //       'products'
            //     ],
            //     properties: {
            //       order_id: {
            //         bsonType: 'string',
            //         description: 'must be a string and is required'
            //       },
            //       date: {
            //         bsonType: 'date',
            //         description: 'must be a date and is required'
            //       },
            //       products: {
            //         bsonType: 'array',
            //         description: 'must be an array and is required',
            //         items: {
            //           bsonType: 'object',
            //           required: [
            //             'product_id',
            //             'amount'
            //           ],
            //           properties: {
            //             product_id: {
            //               bsonType: 'string',
            //               description: 'must be a string and is required'
            //             },
            //             amount: {
            //               bsonType: 'int',
            //               description: 'must be an int and is required'
            //             }
            //           }
            //         }
            //       }
            //     }
            //   }
            // },
        //     reservations: {
        //       bsonType: 'array',
        //       description: 'must be an array if present',
        //       minItems: 0,
        //       items: {
        //         bsonType: ['object', 'null'],
        //         required: [
        //           'date',
        //           'time',
        //           'people',
        //           'isCanceled'
        //         ],
        //         properties: {
        //           date: {
        //             bsonType: 'date',
        //             description: 'must be a date and is required'
        //           },
        //           time: {
        //             bsonType: 'string',
        //             description: 'must be a string and is required'
        //           },
        //           people: {
        //             bsonType: 'int',
        //             description: 'must be an int and is required'
        //           },
        //           isCanceled: {
        //             bsonType: 'bool',
        //             description: 'must be a bool and is required'
        //           }
        //         }
        //       }
        //     }
        //   },
          },
          additionalProperties: false
        }
    },
    Dishes: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "description", "price", "products"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                description: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                price: {
                    bsonType: "double",
                    description: "must be a double and is required"
                },
                products: {
                    bsonType: "array",
                    description: "must be an array and is required",
                    items: {
                        bsonType: "object",
                        required: ["name","supplier_name", "quantity", "unit"],
                        properties: {
                            name: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            supplier_name: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            quantity: {
                                bsonType: "int",
                                description: "must be an int and is required"
                            },
                            unit: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            }
                        }
                    }
                }
            }
        }
    },
    Suppliers: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "contact", "products_supplied"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                contact: {
                    bsonType: "object",
                    required: ["phone", "email", "address"],
                    properties: {
                        phone: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        email: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        address: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    }
                },
                products_supplied: {
                    bsonType: "array",
                    description: "must be an array and is required",
                    items: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    }
                }
            }
        }
    },
    Carts: {
        $jsonSchema: {
            bsonType: "object",
            required: ["client_id", "dishes"],
            properties: {
                client_id: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                dishes: {
                    bsonType: "array",
                    description: "must be an array and is required",
                    items: {
                        bsonType: "object",
                        required: ["dish_id", "quantity"],
                        properties: {
                            dish_id: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            quantity: {
                                bsonType: "int",
                                description: "must be an int and is required"
                            }
                        }
                    }
                }
            }
        }
    },
    Orders : {
        $jsonSchema: {
            bsonType: "object",
            required: ["client_id", "date", "cart", "dishes", "price", "address", "status"],
            properties: {
                client_id: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                date: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                cart: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                dishes: {
                    bsonType: "array",
                    description: "must be an array and is required",
                    items: {
                        bsonType: "object",
                        required: ["dish_id", "dish_name", "quantity", "price"],
                        properties: {
                            dish_id: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            dish_name: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            quantity: {
                                bsonType: "int",
                                description: "must be an int and is required"
                            },
                            price: {
                                bsonType: "double",
                                description: "must be a double and is required"
                            }
                        }
                    }
                },
                price: {
                    bsonType: "double",
                    description: "must be a double and is required"
                },
                address: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                status: {
                    enum: ["pending", "in progress", "delivered"],
                    description: "can only be one of the enum values and is required"
                }
            }
        }
    },
    Deliveries : {
        $jsonSchema: {
            bsonType: "object",
            required: ["supplier_id", "date", "products", "price", "status"],
            properties: {
                supplier_id: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                date: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                products: {
                    bsonType: "array",
                    description: "must be an array and is required",
                    items: {
                        bsonType: "object",
                        required: ["product_id", "product_name", "amount", "unit", "price"],
                        properties: {
                            product_id: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            product_name: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            amount: {
                                bsonType: "int",
                                description: "must be an int and is required"
                            },
                            unit: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            price: {
                                bsonType: "double",
                                description: "must be a double and is required"
                            }
                        }
                    }
                },
                price: {
                    bsonType: "double",
                    description: "must be a double and is required"
                },
                status: {
                    enum: ["pending", "in progress", "delivered"],
                    description: "can only be one of the enum values and is required"
                }
            }
            
        }
    },  
    Admins: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name","surname", "email", "password","phone","address"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                surname: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                password: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                phone: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                address: {
                    bsonType: "string",
                    description: "must be a string and is required"
                }
            }
        }
    },
    Sessions: {
        $jsonSchema: {
            bsonType: "object",
            required: ["expires","session"],
            properties: {
                expires: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                session: {
                    bsonType: "object",
                    required: ["cookie","isAdmin"],
                    properties: {
                        cookie: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        isAdmin: {
                            bsonType: "bool",
                            description: "must be a bool and is required"
                        }
                    }
                }
            }
        },
    },
    Reservations: {
        $jsonSchema: {
            bsonType: "object",
            required: ["client","date","time","people","isCanceled"],
            properties: {
                client: {
                    bsonType: "object",
                    required: ["name","surname","email","password","phone","address","history","reservations"],
                    properties: {
                        name: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        surname: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        email: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        password: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        phone: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        address: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        history: {
                            bsonType: "array",
                            description: "must be an array and is required",
                            items: {
                                bsonType: "object",
                                required: ["cart_id","dishes","price","address","status"],
                                properties: {
                                    order_id: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                    },
                                    date: {
                                        bsonType: "date",
                                        description: "must be a date and is required"
                                    },
                                    products: {
                                        bsonType: "array",
                                        description: "must be an array and is required",
                                        items: {
                                            bsonType: "object",
                                            required: ["product_id","amount"],
                                            properties: {
                                                product_id: {
                                                    bsonType: "string",
                                                    description: "must be a string and is required"
                                                },
                                                amount: {
                                                    bsonType: "int",
                                                    description: "must be an int and is required"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        reservations: {
                            bsonType: "array",
                            description: "must be an array and is required",
                            items: {
                                bsonType: "object",
                                required: ["date","time","people","isCanceled"],
                                properties: {
                                    date: {
                                        bsonType: "date",
                                        description: "must be a date and is required"
                                    },
                                    time: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                    },
                                    people: {
                                        bsonType: "int",
                                        description: "must be an int and is required"
                                    },
                                    isCanceled: {
                                        bsonType: "bool",
                                    }
                                }
                            }
                        }
                    }
                },
                date: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                time: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                people: {
                    bsonType: "int",
                    description: "must be an int and is required"
                },
                isCanceled: {
                    bsonType: "bool",
                    description: "must be a bool and is required"
                }
            }
        }
    }
};

const jsonFiles = [
    {collectionName: 'Products', filePath: 'JSONY/Products.json' },
    {collectionName: 'Dishes', filePath: 'JSONY/Dishes.json' },
    {collectionName: 'Suppliers', filePath: 'JSONY/Suppliers.json' },
    {collectionName: 'Admins', filePath: 'JSONY/Admins.json' },
];


const collections = [
    {collectionName: 'Products'},
    {collectionName: 'Clients'},
    {collectionName: 'Dishes'},
    {collectionName: 'Suppliers'},
    {collectionName: 'Carts'},
    {collectionName: 'Orders'},
    {collectionName: 'Deliveries'},
    {collectionName: 'Admins'},
    {collectionName: 'Sessions'},
    {collectionName: 'Reservations'}
];
async function removeCollection(database, collections) {
    for (const {collectionName } of collections) {
        try {
            const collection = database.collection(collectionName);
            await collection.drop();
            console.log(`Removed ${collectionName} collection.`);
        } catch (err) {
            console.error('Error removing collection:', err);
        }
    }
}

async function createCollectionsWithSchemas(db, schemas) {
    for (const [collectionName, schema] of Object.entries(schemas)) {
        try {
            console.log(`Creating collection ${collectionName} with schema validation...`);
            if (collectionName === 'Clients') {
                await db.createCollection(collectionName, {
                    validator: { $jsonSchema: schema.$jsonSchema },
                    validationLevel: "strict",
                    validationAction: "error",
                });
                console.log(`Collection ${collectionName} created with schema validation.`);
                continue;
            }
            else{
                await db.createCollection(collectionName, {
                    validator: { $jsonSchema: schema.$jsonSchema },
                    validationLevel: "strict",
                    validationAction: "warn",
                });
            }
            console.log(`Collection ${collectionName} created with schema validation.`);
        } catch (err) {
            console.error(`Error creating collection ${collectionName}:`, err);
        }
    }
}

async function clearCollections(database, collections) {
    for (const { dbName, collectionName } of collections) {
        try {
            const collection = database.collection(collectionName);
            const result = await collection.deleteMany({});
            console.log(`Cleared ${result.deletedCount} documents from the ${collectionName} collection.`);
        } catch (err) {
            console.error('Error clearing collection:', err);
        } 
    }
}

async function uploadData(database, jsonFiles) {
    for (const { collectionName, filePath } of jsonFiles) {
        try {
            const collection = database.collection(collectionName);
            console.log(`Importing data to ${collectionName} collection...`);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
            if (Array.isArray(data)) {
                await collection.insertMany(data);
            } else {
                await collection.insertOne(data);
            }
    
            console.log(`Data successfully imported to ${collectionName} collection.`);
        } catch (err) {
            console.error('Error importing data:', err);
        }
    }
}

async function main() {
    const uri = "mongodb://localhost:27017/"; // replace with your MongoDB connection string (propably same but with 27017)
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('RestaurantDataBaseProject');
        await removeCollection(database, collections);
        await createCollectionsWithSchemas(database, schemas);
        await clearCollections(database, collections);
        await uploadData(database, jsonFiles);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}




main().catch(console.error);
