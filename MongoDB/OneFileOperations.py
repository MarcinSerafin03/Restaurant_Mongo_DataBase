from pymongo import MongoClient

# Połączenie z bazą danych MongoDB
port = "mongodb://localhost:27018/"
db_name = "OwnMongoBase1"
collection_name = "OneToRuleThemAll"
client = MongoClient(port)
db = client[db_name]
collection = db[collection_name]


# Wszystkie firmy
# W tym wariancie jest to bardzo proste (jak w każdym)
all_companies = collection.find({"type": "company"})
for company in all_companies:
    print(company)

# Klienci, którzy uczestniczyli w wycieczkach zorganizowanych przez "Northern Lights Expeditions"
# W tym wariancie wymaga użycia list comprehension oraz kilku zmiennych co przynajmniej naszym zdaniem nie jest zbyt czytelne
northern_lights_company = collection.find_one({"type": "company", "name": "Northern Lights Expeditions"})
northern_lights_company_id = northern_lights_company["_id"]
northern_lights_customers = collection.find({
    "type": "client",
    "details.Trips.id": {"$in": [trip["_id"] for trip in collection.find({"type": "trip", "details.organizer": northern_lights_company_id})]
}})
for customer in northern_lights_customers:
    print(customer)

# Wycieczki z Johnem Doe jako uczestnikiem
# Kolejny raz List Comprehension i zmienne
john_doe_trips = collection.find_one({"type": "client", "name": "John Doe"})['details']['Trips']
john_doe_trip_ids = [trip['id'] for trip in john_doe_trips]
john_doe_trips = collection.find({"type": "trip", "_id": {"$in": john_doe_trip_ids}})
#for trip in john_doe_trips:
#    print(trip)

#Średnia ocena wszystkich wycieczek
#To query natomiast jest juz bardziej czytelne
average_rating_cursor = collection.aggregate([
    {"$match": {"type": "rating"}},
    {"$group": {"_id": None, "avg_rating": {"$avg": "$details.rating"}}}
])
average_rating = list(average_rating_cursor)[0]['avg_rating']
print("Średnia ocena wszystkich wycieczek:", average_rating)
