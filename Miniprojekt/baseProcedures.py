from pymongo import MongoClient

def get_database():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['restaurant']
    return db

def find_products_by_name(name, case_insensitive=True):
    db = get_database()
    query = {'name': {'$regex': name, '$options': 'i'}} if case_insensitive else {'name': name}
    products = db.products.find(query)
    return list(products)

def check_stock_level(product_id):
    db = get_database()
    product = db.products.find_one({'_id': product_id}, {'name': 1, 'stock.quantity': 1, 'stock.unit': 1})
    if not product:
        raise ValueError('Product not found')
    return product

def update_stock_level(product_id, amount_used):
    db = get_database()
    if amount_used < 0:
        raise ValueError('Amount used must be positive')

    product = db.products.find_one({'_id': product_id})
    if not product:
        raise ValueError('Product not found')

    if product['stock']['quantity'] < amount_used:
        raise ValueError('Not enough stock')

    result = db.products.update_one({'_id': product_id}, {'$inc': {'stock.quantity': -amount_used}})
    return result.modified_count

def add_product(product_data):
    db = get_database()
    supplier = db.suppliers.find_one({'_id': product_data['supplier_id']})
    if not supplier:
        raise ValueError('Supplier not found')

    result = db.products.insert_one(product_data)
    return result.inserted_id


def add_dish(dish_data):
    db = get_database()

    # Sprawdzenie, czy wszystkie produkty w daniu istnieją w bazie danych
    for product in dish_data['products']:
        if not db.products.find_one({'_id': product['product_id']}):
            raise ValueError(f"Product with ID {product['product_id']} not found")

    result = db.dishes.insert_one(dish_data)
    return result.inserted_id

def add_supplier(supplier_data):
    db = get_database()
    result = db.suppliers.insert_one(supplier_data)
    return result.inserted_id

def add_client(client_data):
    db = get_database()
    result = db.clients.insert_one(client_data)
    return result.inserted_id