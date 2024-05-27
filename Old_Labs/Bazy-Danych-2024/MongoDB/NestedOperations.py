from pymongo import MongoClient

# Połączenie z bazą danych MongoDB

port = "mongodb://localhost:27018/"
db_name = "OwnMongoBase3"
collection_name = "NestedVariant"
client = MongoClient(port)
db = client[db_name]
collection = db[collection_name]

# Wszystkie firmy
# W tym wariancie jest to bardzo proste (jak w każdym)
companies = collection.find({},{"company.name": 1, "_id": 0})
for comp in companies:
    print(comp["company"]["name"])

# Klienci, którzy uczestniczyli w wycieczkach zorganizowanych przez "Northern Lights Expeditions"
# W tym wariancie jest wymaga do użycia agregacji i wielu operacji unwinding
northern_lights_attendees = collection.aggregate([
    {"$match": {"company.name": "Northern Lights Expeditions"}},
    {"$unwind": "$Trips"},
    {"$unwind": "$Trips.attentants"},
    {"$project": {"_id": 0, "client": "$Trips.attentants.client"}}
])
for attendee in northern_lights_attendees:
    print(attendee)

# Wycieczki z Johnem Doe jako uczestnikiem
# W tym wariancie wymaga to zagnieżdżonych pętli przy printowaniu (a uczono nas ze zagnieżdżanie pętli to ZŁO!)
john_doe_trips = collection.find({"Trips.attentants.client.name": "John Doe"})
for doc in john_doe_trips:
    for trip in doc["Trips"]:
        print(trip["details"]["name"])

# Średnia ocena wszystkich wycieczek
# W tym wariancie wymaga to kolejny raz użycia agregacji
average_rating = collection.aggregate([
    {"$unwind": "$Trips"},
    {"$unwind": "$Trips.attentants"},
    {"$match": {"Trips.attentants.review.rating": {"$ne": -1}}},
    {"$group": {"_id": None, "avgRating": {"$avg": "$Trips.attentants.review.rating"}}}
])
for result in average_rating:
    print("\nAverage rating of all trips:", result["avgRating"])

client.close()
