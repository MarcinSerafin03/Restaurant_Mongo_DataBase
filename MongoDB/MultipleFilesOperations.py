from pymongo import MongoClient

# Połączenie z bazą danych MongoDB

port = "mongodb://localhost:27018/"
db_name = "OwnMongoBase2"
client = MongoClient(port)
db = client[db_name]
# Wczytanie Kolekcji
companies_collection = db['companies']
clients_collection = db['clients']
trips_collection = db['trips']
reviews_collection = db['reviews']


# Wszystkie firmy
# Super proste Query
companies=companies_collection.find({})
for company in companies:
        print(company)

# Klienci, którzy uczestniczyli w wycieczkach zorganizowanych przez "Northern Lights Expeditions"
# Wymaga użycia zmiennych ale dalej jest czytelne
clients=clients_collection.find({"Trips.organizer": "Northern Lights Expeditions"})
for client in clients:
    print(client)
# Wycieczki z Johnem Doe jako uczestnikiem
# Wymaga użycia zmiennych ale ponownie jest czytelne
customer = clients_collection.find_one({"name": "John Doe"})
trips=trips_collection.find({"_id": {"$in": [trip['id'] for trip in customer['Trips']]}})
for trip in trips:
    print(trip)
# Średnia ocena wszystkich wycieczek
reviews_collection = db['reviews']
all_ratings = [review['rating'] for review in reviews_collection.find({})]
rating= sum(all_ratings) / len(all_ratings)
print(rating)