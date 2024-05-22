# MiniProject - Restauracja

---

### Imiona i nazwiska autorów : Antoni Dulewicz, Marcin Serafin, Wojciech Wietrzny

---

## Technologie 
### MongoDB, Express, Node.js2

## Schemat
```js
const UserSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["name", "last_name", "email", "password_hash", "phone", "address"],
        properties: {
            name: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            last_name: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            email: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            password_hash: {
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
                    required: ["order_id", "date", "products"],
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
                                required: ["product_id", "amount"],
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
            }
        }
    }
}
```
```js
const DishSchema = {
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
                    required: ["product_id", "quantity", "unit"],
                    properties: {
                        product_id: {
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
}
```
```js
const ProductSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["name", "supplier_id", "stock"],
        properties: {
            name: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            supplier_id: {
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
}
```
```js
const SupplierSchema = {
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
                    bsonType: "object",
                    required: ["product_id", "name"],
                    properties: {
                        product_id: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        name: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        }
                    }
                }
            }
        }
    }
}
```
```js
const CartSchema = {
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
}
```
## Tabele 

### Clients
```json
[
    {
    "_id": "client_id",
    "name": "Imie",
    "last_name": "Nazwisko",
    "email": "Imie.Nazwisko@example.com",
    "password_hash": "hashed_password",
    "phone": "123-456-7890",
    "address": "Ulica 1 00-000 Miasto",
    "history": [
        {
            "order_id": "order_id",
            "date": "YYYY-MM-DD",
            "products": [
                {
                    "product_id": "product_id",
                    "amount": 1
                }
            ]
        }
    ]
    }
]
```

### Dishes

``` json
[
{
    "_id": "dish_id",
    "name": "dish name",
    "description": "dish description",
    "price": 12.99,
    "products": [
        {"product_id": "product_id_1", "quantity": 200, "unit": "grams"},
        {"product_id": "product_id_2", "quantity": 100, "unit": "ml"},
    ]
}
]
```

### Products

```json
[
{
    "_id": "product_id",
    "name": "product name",
    "supplier_id": "supplier_id_1",
    "stock": {
        "quantity": 5000,
        "unit": "grams"
    }
}
]
```

### Suppliers

```json
[
{
    "_id": "supplier_id",
    "name": "supplier name",
    "contact": {
        "phone": "987-654-3210",
        "email": "supplier@exaple.com",
        "address": "Ulica 2 00-000 Miasto"
    },
    "products_supplied": [
        {"product_id": "product_id_1", "name": "product name 1"},
        {"product_id": "product_id_2", "name": "product name 2"},
    ]
}
]
```

### Cart
    
```json
[
{
    "_id": "cart_id",
    "client_id": "client_id",
    "dishes": [
        {"dish_id": "dish_id_1", "quantity": 2},
        {"dish_id": "dish_id_2", "quantity": 1},
    ]
}
]
```

1

## Operacje

Szukanie produktu po id
```js
db.system.js.save({
    _id: "findProductsByName",
    value: function(name, caseInsensitive = true) {
        if(!name) throw new Error('Name cannot be empty');
        var query = caseInsensitive ? { name: { $regex: name, $options: 'i' } } : { name: name };
        return db.products.find(query).toArray();
    }
});

db.eval("findProductsByName('Tomato Sauce', true)");

```

Wyświetlanie ilości produktów w magazynie
```js
db.system.js.save({
    _id: "checkStockLevel",
    value: function(productId) {
        if(!db.products.findOne({ "_id": productId })) throw new Error('Product not found');
        return db.products.findOne(
            { "_id": productId },
            { "name": 1, "stock.quantity": 1, "stock.unit": 1 }
        );
    }
});

db.eval("checkStockLevel('10',)");
```

Zmiana ilości produktów po zakupie
```js
db.system.js.save({
    _id: "updateStockLevel",
    value: function(productId, amountUsed) {
        if(amountUsed < 0) throw new Error('Amount used must be positive');
        if(!db.products.findOne({ "_id": productId })) throw new Error('Product not found');
        var product = db.products.findOne({ "_id": productId });
        if(product.stock.quantity < amountUsed) throw new Error('Not enough stock');
        return db.products.updateOne(
            { "_id": productId },
            { $inc: { "stock.quantity": -amountUsed } }
        );
    }
});

db.eval("updateStockLevel('10', 100)");
```

Dodawanie nowego produktu
```js
db.system.js.save({
    _id: "addProduct",
    value: function(productData) {
        var supplier = db.suppliers.findOne({ _id: productData.supplier_id });
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return db.products.insertOne(productData);
    }
});

db.eval("addProduct({ name: 'Tomato Sauce', supplier_id: '1', stock: { quantity: 1000, unit: 'ml' } })");
```