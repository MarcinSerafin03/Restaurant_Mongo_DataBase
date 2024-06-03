# MiniProject - Restauracja

---

### Imiona i nazwiska autorów : Antoni Dulewicz, Marcin Serafin, Wojciech Wietrzny

---

## Technologie 
### MongoDB, Express, Node.js2

Wiele elementów znajduję sie w odpowiednik plikach podanych przy nagłówkach dla czytelności sprawozdania
## Tabele 

### Clients
```json
[
    {
    "_id": "client_id",
    "name": "Imie",
    "surname": "Nazwisko",
    "email": "Imie.Nazwisko@example.com",
    "password": "hashed_password",
    "phone": "123-456-7890",
    "address": "Ulica 1 00-000 Miasto",
    "history": [
        {
            "order_id": "order_id",
            "date": "YYYY-MM-DD",
            "price": 37.50,
            "address": "Ulica 1 00-000 Miasto",
            "status": "status",
            "dishes": [
                {
                    "dish_id": "dish_id",
                    "name": "name1",
                    "quantity": 2,
                    "price": 25.00
                },
                {
                    "dish_id": "dish_id",
                    "name": "name2",
                    "quantity": 1,
                    "price": 12.50
                }
            ]
        }
    ],
    "reservations": [
        {
            "date": "YYYY-MM-DD",
            "time": "HH:MM",
            "people": 4,
            "isCanceled": false
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
        {"name": "product name 1", "supplier_name": "supplier_name_1", "quantity": 100, "unit": "grams"},
        {"name": "product name 2", "supplier_name": "supplier_name_2", "quantity": 200, "unit": "ml"}
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
    "supplier_name": "supplier_name_1",
    "price": 12.99,
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
        "product_id_1",
        "product_id_2"
    ]
}
]
```

### Carts
    
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
### Orders

```json
[
{
    "_id": "order_id",
    "client": {
        "client_id": "client_id",
        "name": "name",
        "surname": "surname"
    },
    "date": "YYYY-MM-DD",
    "cart": "cart_id",
    "dishes": [
        {"dish_id": "dish_id_1","dish_name":"name1", "quantity": 2,"price": 25.00},
        {"dish_id": "dish_id_2","dish_name":"name1",  "quantity": 1,"price": 12.50},
    ],
    "price": 37.50,
    "address": "Ulica 1 00-000 Miasto",
    "status": "status"
}
]
```

### SupplierOrders

```json
[
{
    "_id": "SupplierOrders_id",
    "supplier_id": "supplier_id",
    "date": "YYYY-MM-DD",
    "product": {
        "product_id": "product_id",
        "price": 75.00
    },
    "Price": 75.00,
    "status": "status"
}
]
```




## Schemat - Scheme.js

## Operacje

#### CRUD - CRUD.js

#### Agregacje - Aggregate.js

## Uruchomienie


#### Stworzenie bazy danych - Site/dbCreator.js

#### Uruchomienie serwera - Site/app.js

```
npm install
node app.js
```