# Dokumentowe bazy danych – MongoDB

ćwiczenie 2


---

**Imiona i nazwiska autorów:**

--- 


## Yelp Dataset

- [www.yelp.com](http://www.yelp.com) - serwis społecznościowy – informacje o miejscach/lokalach
- restauracje, kluby, hotele itd. `businesses`,
- użytkownicy odwiedzają te miejsca - "meldują się"  `check-in`
- użytkownicy piszą recenzje `reviews` o miejscach/lokalach i wystawiają oceny oceny,
- przykładowy zbiór danych zawiera dane z 5 miast: Phoenix, Las Vegas, Madison, Waterloo i Edinburgh.

# Zadanie 1 - operacje wyszukiwania danych

Dla zbioru Yelp wykonaj następujące zapytania

W niektórych przypadkach może być potrzebne wykorzystanie mechanizmu Aggregation Pipeline

[https://www.mongodb.com/docs/manual/core/aggregation-pipeline/](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)


1. Zwróć dane wszystkich restauracji (kolekcja `business`, pole `categories` musi zawierać wartość "Restaurants"), które są otwarte w poniedziałki (pole hours) i mają ocenę co najmniej 4 gwiazdki (pole `stars`).  Zapytanie powinno zwracać: nazwę firmy, adres, kategorię, godziny otwarcia i gwiazdki. Posortuj wynik wg nazwy firmy.

2. Ile każda firma otrzymała ocen/wskazówek (kolekcja `tip` ) w 2012. Wynik powinien zawierać nazwę firmy oraz liczbę ocen/wskazówek Wynik posortuj według liczby ocen (`tip`).

3. Recenzje mogą być oceniane przez innych użytkowników jako `cool`, `funny` lub `useful` (kolekcja `review`, pole `votes`, jedna recenzja może mieć kilka głosów w każdej kategorii).  Napisz zapytanie, które zwraca dla każdej z tych kategorii, ile sumarycznie recenzji zostało oznaczonych przez te kategorie (np. recenzja ma kategorię `funny` jeśli co najmniej jedna osoba zagłosowała w ten sposób na daną recenzję)

4. Zwróć dane wszystkich użytkowników (kolekcja `user`), którzy nie mają ani jednego pozytywnego głosu (pole `votes`) z kategorii (`funny` lub `useful`), wynik posortuj alfabetycznie według nazwy użytkownika.

5. Wyznacz, jaką średnia ocenę uzyskała każda firma na podstawie wszystkich recenzji (kolekcja `review`, pole `stars`). Ogranicz do firm, które uzyskały średnią powyżej 3 gwiazdek.

	a) Wynik powinien zawierać id firmy oraz średnią ocenę. Posortuj wynik wg id firmy.

	b) Wynik powinien zawierać nazwę firmy oraz średnią ocenę. Posortuj wynik wg nazwy firmy.

## Zadanie 1  - rozwiązanie

> Wyniki: 
> 
> przykłady, kod, zrzuty ekranów, komentarz ...

```python
from pymongo import MongoClient
client = MongoClient('localhost', 27018)
db = client['yelp']

# Zadanie 1

pipeline_1 = [
    {"$match": {"categories": "Restaurants", "hours.Monday": {"$ne": "closed"}, "stars": {"$gte": 4}}},
    {"$project": {"name": 1, "address": 1, "categories": 1, "hours": 1, "stars": 1}},
    {"$sort": {"name": 1}}
]
result_1 = db.business.aggregate(pipeline_1)
list_1 = list(result_1)
for doc in list_1:
    print(doc)

# Zadanie 2 

pipeline_2 = [
    {"$lookup": {"from": "business", "localField": "business_id", "foreignField": "business_id", "as": "business"}},
    {"$unwind": "$business"},
    {"$match": {"date": {"$regex": "^2012"}}},
    {"$group": {"_id": "$business_id", "count": {"$sum": 1}}},
    {"$project": {"name": "$business.name", "count": 1}},
    {"$sort": {"count": -1}}
]
result_2 = db.tip.aggregate(pipeline_2)
list_2 = list(result_2)
for doc in list_2:
    print(doc)



# Zadanie 3

pipeline_3 = [
    {"$group": {"_id": "$votes.cool", "count": {"$sum": 1}}},
    {"$project": {"category": "cool", "count": 1}},
    {"$unionWith": {"coll": "review", "pipeline": [
        {"$group": {"_id": "$votes.funny", "count": {"$sum": 1}}},
        {"$project": {"category": "funny", "count": 1}}
    ]}},
    {"$unionWith": {"coll": "review", "pipeline": [
        {"$group": {"_id": "$votes.useful", "count": {"$sum": 1}}},
        {"$project": {"category": "useful", "count": 1}}
    ]}},
    {"$group": {"_id": "$category", "count": {"$sum": 1}}},
]
result_3 = db.review.aggregate(pipeline_3)
list_3=list(result_3)
for doc in list_3:
    print(doc)

# Zadanie 4
pipeline_4 = [
    {"$match": {"votes.funny": 0, "votes.useful": 0}},
    {"$project": {"name": 1}},
    {"$sort": {"name": 1}}
]
result_4 = db.user.aggregate(pipeline_4)
list_4 = list(result_4)
for doc in list_4:
    print(doc)

# Zadanie 5a
pipeline_5a = [
    {"$group": {"_id": "$business_id", "avg_stars": {"$avg": "$stars"}}},
    {"$match": {"avg_stars": {"$gt": 3}}},
    {"$project": {"avg_stars": 1}},
    {"$sort": {"name": 1}}
]
result_5a = db.review.aggregate(pipeline_5a)
list_5a = list(result_5a)
for doc in list_5a:
    print(doc)

# Zadanie 5b
print("Zadanie 5b")
pipeline_5b = [
    {"$group": {"_id": "$business_id", "avg_stars": {"$avg": "$stars"}}},
    {"$match": {"avg_stars": {"$gt": 3}}},
    {"$lookup": {"from": "business", "localField": "_id", "foreignField": "name", "as": "business"}},
    {"$unwind": "$business"},
    {"$project": {"name": "$business.name", "avg_stars": 1}},
    {"$sort": {"name": 1}}
]
result_5b = db.review.aggregate(pipeline_5b)
list_5b = list(result_5b)
for doc in list_5b:
    print(doc)
```

# Zadanie 2 - modelowanie danych


Zaproponuj strukturę bazy danych dla wybranego/przykładowego zagadnienia/problemu

Należy wybrać jedno zagadnienie/problem (A lub B)

Przykład A
- Wykładowcy, przedmioty, studenci, oceny
	- Wykładowcy prowadzą zajęcia z poszczególnych przedmiotów
	- Studenci uczęszczają na zajęcia
	- Wykładowcy wystawiają oceny studentom
	- Studenci oceniają zajęcia

Przykład B
- Firmy, wycieczki, osoby
	- Firmy organizują wycieczki
	- Osoby rezerwują miejsca/wykupują bilety
	- Osoby oceniają wycieczki

a) Warto zaproponować/rozważyć różne warianty struktury bazy danych i dokumentów w poszczególnych kolekcjach oraz przeprowadzić dyskusję każdego wariantu (wskazać wady i zalety każdego z wariantów)

b) Kolekcje należy wypełnić przykładowymi danymi

c) W kontekście zaprezentowania wad/zalet należy zaprezentować kilka przykładów/zapytań/zadań/operacji oraz dla których dedykowany jest dany wariantów

W sprawozdaniu należy zamieścić przykładowe dokumenty w formacie JSON ( pkt a) i b)), oraz kod zapytań/operacji (pkt c)), wraz z odpowiednim komentarzem opisującym strukturę dokumentów oraz polecenia ilustrujące wykonanie przykładowych operacji na danych

Do sprawozdania należy kompletny zrzut wykonanych/przygotowanych baz danych (taki zrzut można wykonać np. za pomocą poleceń `mongoexport`, `mongdump` …) oraz plik z kodem operacji zapytań (załącznik powinien mieć format zip).


## Zadanie 2  - rozwiązanie

> Wyniki: 
> 
> przykłady, kod, zrzuty ekranów, komentarz ...

### Wariant Pierwszy. Wszystko jako oddzielny element
##### Model:
```js
{
    "id": ObjectID(),
    "type": "company" | "client" | "review" | "trip",
    "details": {...},
}
```
##### Baza: 
```js
[
    {
      "_id": "60df26e8a2c4e82f644c016a",
      "type": "company",
      "name": "Adventure Tours Inc.",
      "details": {
        "address": "Los Angeles",
        "contact": "contact@adventuretours.com"
      }
    },
    {
      "_id": "60df26e8a2c4e82f644c016b",
      "type": "trip",
      "name": "Grand Canyon Adventure",
      "details": {
        "date": "2024-07-15",
        "duration": "5 days",
        "price": 1500,
        "max_capacity": 20
      }
    },
    {
      "_id": "60df26e8a2c4e82f644c016c",
      "type": "client",
      "name": "John Doe",
      "details": {
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c016b"
            },
            {
                "id": "60df26e8a2c4e82f644c0189"
            }
        ]
      }
    },
    {
      "_id": "60df26e8a2c4e82f644c016d",
      "type": "review",
      "name": "Great trip!",
      "details": {
        "trip_id": "60df26e8a2c4e82f644c016b",
        "person_id": "60df26e8a2c4e82f644c016c",
        "rating": 5,
        "comment": "Really enjoyed the experience."
      }
    },
    {
        "_id": "60df26e8a2c4e82f644c016e",
        "type": "company",
        "name": "Wilderness Explorers",
        "details":{
            "address": "Denver",
            "contact": "info@wildernessexplorers.com"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0174",
        "type": "company",
        "name": "Tropical Adventures Ltd.",
        "details":{
            "address": "Miami",
            "contact": "hello@tropicaladventures.com"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0178",
        "type": "company",
        "name": "Alpine Adventures",
        "details":{
            "address": "Seattle",
            "contact": "info@alpineadventures.com"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0180",
        "type": "company",
        "name": "Northern Lights Expeditions",
        "details":{
            "address": "Reykjavik",
            "contact": "info@northernlights.com"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0184",
        "type": "company",
        "name": "Amazon Expeditions",
        "details":{
            "address": "Manaus",
            "contact": "contact@amazonexpeditions.com"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c016f",
        "type": "trip",
        "name": "Rocky Mountain Backpacking",
        "details":{
            "date": "2024-06-20",
            "duration": "7 days",
            "price": 2000,
            "max_capacity": 15
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0175",
        "type": "trip",
        "name": "Caribbean Cruise",
        "details":{
            "date": "2024-08-10",
            "duration": "10 days",
            "price": 3000,
            "max_capacity": 30
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0179",
        "type": "trip",
        "name": "Skiing in the Alps",
        "details":{
            "date": "2024-12-01",
            "duration": "7 days",
            "price": 2500,
            "max_capacity": 12
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c017d",
        "type": "trip",
        "name": "Maasai Mara Safari",
        "details":{
            "date": "2024-09-20",
            "duration": "4 days",
            "price": 1800,
            "max_capacity": 10
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0181",
        "type": "trip",
        "name": "Icelandic Aurora Tour",
        "details":{
            "date": "2024-11-10",
            "duration": "6 days",
            "price": 2800,
            "max_capacity": 15
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0185",
        "type": "trip",
        "name": "Jungle Adventure",
        "date": "2024-10-05",
        "details":{ 
            "duration": "8 days",
            "price": 2200,
            "max_capacity": 20
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0190",
        "type": "client",
        "name": "Olivia White",
        "details":{
            "email": "olivia.white@example.com",
            "phone": "123-456-7890",
            "Trips": [
                {
                    "id": "60df26e8a2c4e82f644c016b"
                },
                {
                    "id": "60df26e8a2c4e82f644c0179"
                },
                {
                    "id": "60df26e8a2c4e82f644c0185"
                }
            ]
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0176",
        "type": "client",
        "name": "Emily Davis",
        "details":{
            "email": "emily.davis@example.com",
            "phone": "321-654-0987",
            "Trips": [
                {
                    "id": "60df26e8a2c4e82f644c0175"
                }
            ]
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0188",
        "type": "client",
        "name": "Alicia Martinez",
        "details":{
            "email": "alicia.martinez@example.com",
            "phone": "789-012-3456"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0192",
        "type": "client",
        "name": "Ethan Harris",
        "details":{
            "email": "ethan.harris@example.com",
            "phone": "901-234-5678",
            "Trips": [
                {
                    "id": "60df26e8a2c4e82f644c016b"
                },
                {
                    "id": "60df26e8a2c4e82f644c0179"
                },
                {
                    "id": "60df26e8a2c4e82f644c0185"
                }
            ]
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0170",
        "type": "client",
        "name": "Jane Smith",
        "details":{
            "email": "jane.smith@example.com",
            "phone": "987-654-3210",
            "Trips": [
                {
                    "id": "60df26e8a2c4e82f644c016f"
                }
            ]
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0172",
        "type": "client",
        "name": "Michael Johnson",
        "details":{
            "email": "michael.johnson@example.com",
            "phone": "456-789-0123",
            "Trips": [
                {
                    "id": "60df26e8a2c4e82f644c016f"
                },
                {
                    "id": "60df26e8a2c4e82f644c0175"
                }
            ]
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0186",
        "type": "client",
        "name": "Sarah Taylor",
        "details":{
            "email": "sarah.taylor@example.com",
            "phone": "345-678-9012",
            "Trips": [
                {
                    "id": "60df26e8a2c4e82f644c016f"
                },
                {
                    "id": "60df26e8a2c4e82f644c0179"
                },
                {
                    "id": "60df26e8a2c4e82f644c0185"
                }
            ]
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c018a",
        "type": "client",
        "name": "Daniel Thompson",
        "details":{
            "email": "daniel.thompson@example.com",
            "phone": "234-567-8901"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c018c",
        "type": "client",
        "details":{
            "name": "Sophie Garcia",
            "email": "sophie.garcia@example.com",
            "phone": "567-890-1234"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c018e",
        "type": "client",
        "details":{
            "name": "Matthew Lee",
            "email": "matthew.lee@example.com",
            "phone": "345-678-9012"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c017e",
        "type": "client",
        "name": "Jessica Brown",
        "details":{
            "email": "jessica.brown@example.com",
            "phone": "234-567-8901",
            "Trips": [
                {
                    "id": "60df26e8a2c4e82f644c017d"
                }
            ]
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0188",
        "type": "client",
        "name": "Alicia Martinez",
        "details":{
            "email": "alicia.martinez@example.com",
            "phone": "789-012-3456",
            "Trips": [
                {
                    "id": "60df26e8a2c4e82f644c017d"
                },
                {
                    "id": "60df26e8a2c4e82f644c0185"
                }
            ]
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c018a",
        "type": "client",
        "name": "Daniel Thompson",
        "details":{
            "email": "daniel.thompson@example.com",
            "phone": "234-567-8901",
            "Trips": [
                {
                    "id": "60df26e8a2c4e82f644c017d"
                },
                {
                    "id": "60df26e8a2c4e82f644c0185"
                }
            ]
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c018c",
        "type": "client",
        "name": "Sophie Garcia",
        "details":{
            "email": "sophie.garcia@example.com",
            "phone": "567-890-1234",
            "Trips": [
                {
                    "id": "60df26e8a2c4e82f644c017d"
                },
                {
                    "id": "60df26e8a2c4e82f644c0185"
                }
            ]
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c018e",
        "type": "client",
        "name": "Matthew Lee",
        "details":{
            "email": "matthew.lee@example.com",
            "phone": "345-678-9012",
            "Trips": [
                {
                    "id": "60df26e8a2c4e82f644c017d"
                },
                {
                    "id": "60df26e8a2c4e82f644c0185"
                }
            ]
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0190",
        "type": "client",
        "name": "Olivia White",
        "details":{
            "email": "olivia.white@example.com",
            "phone": "123-456-7890"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0192",
        "type": "client",
        "name": "Ethan Harris",
        "details":{
            "email": "ethan.harris@example.com",
            "phone": "901-234-5678"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c016f",
        "type": "rating",
        "name": "Rocky Mountain Backpacking Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c016f",
            "person_id": "60df26e8a2c4e82f644c0170",
            "rating": 4,
            "comment": "Beautiful scenery, knowledgeable guides."
        }   
    },
    {
        "_id": "60df26e8a2c4e82f644c0171",
        "type": "rating",
        "name": "Rocky Mountain Backpacking Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c016f",
            "person_id": "60df26e8a2c4e82f644c0172",
            "rating": 5,
            "comment": "An unforgettable experience!"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0193",
        "type": "rating",
        "name": "Grand Canyon Adventure Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c016b",
            "person_id": "60df26e8a2c4e82f644c0190",
            "rating": 5,
            "comment": "An amazing journey, will cherish the memories forever!"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0191",
        "type": "rating",
        "name": "Grand Canyon Adventure Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c016b",
            "person_id": "60df26e8a2c4e82f644c0192",
            "rating": 4,
            "comment": "Great trip, would recommend to others."
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0177",
        "type": "rating",
        "name": "Caribbean Cruise Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c0175",
            "person_id": "60df26e8a2c4e82f644c0176",
            "rating": 5,
            "comment": "Absolutely amazing trip!"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0173",
        "type": "rating",
        "name": "Caribbean Cruise Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c0175",
            "person_id": "60df26e8a2c4e82f644c0172",
            "rating": 5,
            "comment": "An unforgettable experience!"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c017f",
        "type": "rating",
        "name": "Maasai Mara Safari Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c017d",
            "person_id": "60df26e8a2c4e82f644c017e",
            "rating": 5,
            "comment": "Witnessed incredible wildlife!"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0189",
        "type": "rating",
        "name": "Maasai Mara Safari Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c017d",
            "person_id": "60df26e8a2c4e82f644c0188",
            "rating": 5,
            "comment": "Unforgettable experience, highly recommended!"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c018b",
        "type": "rating",
        "name": "Maasai Mara Safari Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c017d",
            "person_id": "60df26e8a2c4e82f644c018a",
            "rating": 4,
            "comment": "Amazing trip, great guides!"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c018d",
        "type": "rating",
        "name": "Maasai Mara Safari Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c017d",
            "person_id": "60df26e8a2c4e82f644c018c",
            "rating": 5,
            "comment": "Incredible adventure, exceeded expectations!"
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c018f",
        "type": "rating",
        "name": "Maasai Mara Safari Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c017d",
            "person_id": "60df26e8a2c4e82f644c018e",
            "rating": 4,
            "comment": "Beautiful landscapes, friendly staff."
        }
    },
    {
        "_id": "60df26e8a2c4e82f644c0183",
        "type": "rating",
        "name": "Icelandic Aurora Tour Review",
        "details":{
            "trip_id": "60df26e8a2c4e82f644c0181",
            "person_id": "60df26e8a2c4e82f644c0182",
            "rating": 5,
            "comment": "Breathtaking views of the aurora borealis!"
        }
    },    
    {
        "id": "60df26e8a2c4e82f644c0189",
        "type": "trip",
        "name": "Szkolna 17 Trip",
        "details": {
            "date": "2025-12-05",
            "duration": "10 days",
            "price": 3500,
            "max_capacity": 20
        }
    },{
        "_id": "60df26e8a2c4e82f644c017a",
        "type": "client",
        "name": "Chris Williams",
        "email": "chris.williams@example.com",
        "phone": "789-012-3456",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c0179"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c0182",
        "type": "client",
        "name": "David Wilson",
        "email": "david.wilson@example.com",
        "phone": "567-890-1234",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c0181"
            }
        ]
    }

]

```
### Wariant Drugi. Wszystko podzielone na 5 plików

#### clients.json
##### Model:
```js 
{
    "_id": ObjectID(),
    "name": "...",
    "email": "...",
    "phone": "...",
    "Trips": [
        {
            "id": "..."
        }
    ]
}
```
##### Baza:
```js
[
    {
        "_id": "60df26e8a2c4e82f644c016c",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c016b"
            },
            {
                "id": "60df26e8a2c4e82f644c0189"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c0190",
        "name": "Olivia White",
        "email": "olivia.white@example.com",
        "phone": "123-456-7890",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c016b"
            },
            {
                "id": "60df26e8a2c4e82f644c0179"
            },
            {
                "id": "60df26e8a2c4e82f644c0185"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c0192",
        "name": "Ethan Harris",
        "email": "ethan.harris@example.com",
        "phone": "901-234-5678",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c016b"
            },
            {
                "id": "60df26e8a2c4e82f644c0179"
            },
            {
                "id": "60df26e8a2c4e82f644c0185"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c0170",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "phone": "987-654-3210",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c016f"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c0172",
        "name": "Michael Johnson",
        "email": "michael.johnson@example.com",
        "phone": "456-789-0123",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c016f"
            },
            {
                "id": "60df26e8a2c4e82f644c0175"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c0186",
        "name": "Sarah Taylor",
        "email": "sarah.taylor@example.com",
        "phone": "345-678-9012",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c016f"
            },
            {
                "id": "60df26e8a2c4e82f644c0179"
            },
            {
                "id": "60df26e8a2c4e82f644c0185"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c017e",
        "name": "Jessica Brown",
        "email": "jessica.brown@example.com",
        "phone": "234-567-8901",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c017d"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c0188",
        "name": "Alicia Martinez",
        "email": "alicia.martinez@example.com",
        "phone": "789-012-3456",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c017d"
            },
            {
                "id": "60df26e8a2c4e82f644c0185"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c018a",
        "name": "Daniel Thompson",
        "email": "daniel.thompson@example.com",
        "phone": "234-567-8901",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c017d"
            },
            {
                "id": "60df26e8a2c4e82f644c0185"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c018c",
        "name": "Sophie Garcia",
        "email": "sophie.garcia@example.com",
        "phone": "567-890-1234",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c017d"
            },
            {
                "id": "60df26e8a2c4e82f644c0185"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c018e",
        "name": "Matthew Lee",
        "email": "matthew.lee@example.com",
        "phone": "345-678-9012",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c017d"
            },
            {
                "id": "60df26e8a2c4e82f644c0185"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c0176",
        "name": "Emily Davis",
        "email": "emily.davis@example.com",
        "phone": "321-654-0987",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c0175"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c017a",
        "name": "Chris Williams",
        "email": "chris.williams@example.com",
        "phone": "789-012-3456",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c0179"
            }
        ]
    },
    {
        "_id": "60df26e8a2c4e82f644c0182",
        "name": "David Wilson",
        "email": "david.wilson@example.com",
        "phone": "567-890-1234",
        "Trips": [
            {
                "id": "60df26e8a2c4e82f644c0181"
            }
        ]
    }
]
```

#### companies.json
##### Model:
```js
{
        "_id": ObjectID(),
        "name": "...",
        "address": "...",
        "contact": "..."
}
```
##### Baza:
```js
[
    {
        "_id": "60df26e8a2c4e82f644c016a",
        "name": "Adventure Tours Inc.",
        "address": "Los Angeles",
        "contact": "contact@adventuretours.com"
    },
    {
        "_id": "60df26e8a2c4e82f644c016e",
        "name": "Wilderness Explorers",
        "address": "Denver",
        "contact": "info@wildernessexplorers.com"
    },
    {
        "_id": "60df26e8a2c4e82f644c0174",
        "name": "Tropical Adventures Ltd.",
        "address": "Miami",
        "contact": "hello@tropicaladventures.com"
    },
    {
        "_id": "60df26e8a2c4e82f644c0178",
        "name": "Alpine Adventures",
        "address": "Seattle",
        "contact": "info@alpineadventures.com"
    },
    {
        "_id": "60df26e8a2c4e82f644c0180",
        "name": "Northern Lights Expeditions",
        "address": "Reykjavik",
        "contact": "info@northernlights.com"
    },
    {
        "_id": "60df26e8a2c4e82f644c0184",
        "name": "Amazon Expeditions",
        "address": "Manaus",
        "contact": "contact@amazonexpeditions.com"
    }
]
```

#### reviews.json
##### Model:
```js
{
      "_id": ObjectID(),
      "name": "...",
      "trip_id": "...",
      "person_id": "...",
      "rating": ,
      "comment": "..."
  },
```
##### Baza:
```js
[
  {
      "_id": "60df26e8a2c4e82f644c016d",
      "name": "Great trip!",
      "trip_id": "60df26e8a2c4e82f644c016b",
      "person_id": "60df26e8a2c4e82f644c016c",
      "rating": 5,
      "comment": "Really enjoyed the experience."
  },
  {
      "_id": "60df26e8a2c4e82f644c016f",
      "name": "Rocky Mountain Backpacking Review",
      "trip_id": "60df26e8a2c4e82f644c016f",
      "person_id": "60df26e8a2c4e82f644c0170",
      "rating": 4,
      "comment": "Beautiful scenery, knowledgeable guides."
  },
  {
      "_id": "60df26e8a2c4e82f644c0171",
      "name": "Rocky Mountain Backpacking Review",
      "trip_id": "60df26e8a2c4e82f644c016f",
      "person_id": "60df26e8a2c4e82f644c0172",
      "rating": 5,
      "comment": "An unforgettable experience!"
  },
  {
      "_id": "60df26e8a2c4e82f644c0193",
      "name": "Grand Canyon Adventure Review",
      "trip_id": "60df26e8a2c4e82f644c016b",
      "person_id": "60df26e8a2c4e82f644c0192",
      "rating": 4,
      "comment": "Great experience, would love to do it again!"
  },
  {
      "_id": "60df26e8a2c4e82f644c0191",
      "name": "Grand Canyon Adventure Review",
      "trip_id": "60df26e8a2c4e82f644c016b",
      "person_id": "60df26e8a2c4e82f644c0190",
      "rating": 5,
      "comment": "An amazing journey, will cherish the memories forever!"
  },
  {
      "_id": "60df26e8a2c4e82f644c0177",
      "name": "Caribbean Cruise Review",
      "trip_id": "60df26e8a2c4e82f644c0175",
      "person_id": "60df26e8a2c4e82f644c0176",
      "rating": 5,
      "comment": "Absolutely amazing trip!"
  },
  {
      "_id": "60df26e8a2c4e82f644c0173",
      "name": "Caribbean Cruise Review",
      "trip_id": "60df26e8a2c4e82f644c0175",
      "person_id": "60df26e8a2c4e82f644c0172",
      "rating": 5,
      "comment": "An unforgettable experience!"
  },
  {
      "_id": "60df26e8a2c4e82f644c017f",
      "name": "Maasai Mara Safari Review",
      "trip_id": "60df26e8a2c4e82f644c017d",
      "person_id": "60df26e8a2c4e82f644c017e",
      "rating": 5,
      "comment": "Witnessed incredible wildlife!"
  },
  {
      "_id": "60df26e8a2c4e82f644c0189",
      "name": "Maasai Mara Safari Review",
      "trip_id": "60df26e8a2c4e82f644c017d",
      "person_id": "60df26e8a2c4e82f644c0188",
      "rating": 5,
      "comment": "Unforgettable experience, highly recommended!"
  },
  {
      "_id": "60df26e8a2c4e82f644c018b",
      "name": "Maasai Mara Safari Review",
      "trip_id": "60df26e8a2c4e82f644c017d",
      "person_id": "60df26e8a2c4e82f644c018a",
      "rating": 4,
      "comment": "Amazing trip, great guides!"
  },
  {
      "_id": "60df26e8a2c4e82f644c018d",
      "name": "Maasai Mara Safari Review",
      "trip_id": "60df26e8a2c4e82f644c017d",
      "person_id": "60df26e8a2c4e82f644c018c",
      "rating": 5,
      "comment": "Incredible adventure, exceeded expectations!"
  },
  {
      "_id": "60df26e8a2c4e82f644c018f",
      "name": "Maasai Mara Safari Review",
      "trip_id": "60df26e8a2c4e82f644c017d",
      "person_id": "60df26e8a2c4e82f644c018e",
      "rating": 4,
      "comment": "Beautiful landscapes, friendly staff."
  },
  {
      "_id": "60df26e8a2c4e82f644c0183",
      "name": "Icelandic Aurora Tour Review",
      "trip_id": "60df26e8a2c4e82f644c0181",
      "person_id": "60df26e8a2c4e82f644c0182",
      "rating": 5,
      "comment": "Breathtaking views of the aurora borealis!"
  }
]
```

#### trips.json
##### Model:
```js
{
        "_id": ObjectID(),
        "organizer": ObjectID(),
        "name": "...",
        "date": "...",
        "duration": "...",
        "price": ,
        "max_capacity": 
    },
```
##### Baza:
```js
[
    {
        "_id": "60df26e8a2c4e82f644c016b",
        "organizer": "60df26e8a2c4e82f644c016a",
        "name": "Grand Canyon Adventure",
        "date": "2024-07-15",
        "duration": "5 days",
        "price": 1500,
        "max_capacity": 20
    },
    {
        "_id": "60df26e8a2c4e82f644c016f",
        "organizer": "60df26e8a2c4e82f644c016e",
        "name": "Rocky Mountain Backpacking",
        "date": "2024-06-20",
        "duration": "7 days",
        "price": 2000,
        "max_capacity": 15
    },
    {
        "_id": "60df26e8a2c4e82f644c017d",
        "organizer": "60df26e8a2c4e82f644c016e",
        "name": "Maasai Mara Safari",
        "date": "2024-09-20",
        "duration": "4 days",
        "price": 1800,
        "max_capacity": 10
    },
    {
        "_id": "60df26e8a2c4e82f644c0175",
        "organizer": "60df26e8a2c4e82f644c0174",
        "name": "Caribbean Cruise",
        "date": "2024-08-10",
        "duration": "10 days",
        "price": 3000,
        "max_capacity": 30
    },
    {
        "_id": "60df26e8a2c4e82f644c0179",
        "organizer": "60df26e8a2c4e82f644c0178",
        "name": "Skiing in the Alps",
        "date": "2024-12-01",
        "duration": "7 days",
        "price": 2500,
        "max_capacity": 12
    },
    {
        "_id": "60df26e8a2c4e82f644c0181",
        "organizer": "60df26e8a2c4e82f644c0180",
        "name": "Icelandic Aurora Tour",
        "date": "2024-11-10",
        "duration": "6 days",
        "price": 2800,
        "max_capacity": 15
    },
    {
        "_id": "60df26e8a2c4e82f644c0189",
        "organizer": "60df26e8a2c4e82f644c0180",
        "name": "Szkolna 17 Trip",
        "date": "2025-12-05",
        "duration": "10 days",
        "price": 3500,
        "max_capacity": 20
    },
    {
        "_id": "60df26e8a2c4e82f644c0185",
        "organizer": "60df26e8a2c4e82f644c0184",
        "name": "Jungle Adventure",
        "date": "2024-10-05",
        "duration": "8 days",
        "price": 2200,
        "max_capacity": 20
    }
]


```

### Wariant Trzeci. Zagnieżdżone elementy
##### Model:
```js
{
        "_id": ObjectID(),
        "company": {
            "_id": "...",
            "name": "...",
            "location": "...",
            "contact": "..."
        },
        "Trips":[ 
            {
            "details": {
                "_id": ObjectID(),
                "name": "...",
                "date": "...",
                "duration": "...",
                "price": ,
                "max_capacity": 
            },
            "attentants": [
                {
                    "client": {
                    "_id": ObjectID(),
                    "name": "...",
                    "email": "...",
                    "phone": "..."
                    },
                    "review": {
                    "_id": ObjectID(),
                    "rating": ,
                    "comment": "..."
                    }
                }
            ]
        }
    ]
},
```
##### Baza:
```js
[
    {
        "_id": "5f8f4b3b9b1f3b0017f3b3b1",
        "company": {
            "_id": "60df26e8a2c4e82f644c016a",
            "name": "Adventure Tours Inc.",
            "location": "Los Angeles",
            "contact": "contact@adventuretours.com"
        },
        "Trips":[ 
            {
                "details": {
                    "_id": "60df26e8a2c4e82f644c016b",
                    "name": "Grand Canyon Adventure",
                    "date": "2024-07-15",
                    "duration": "5 days",
                    "price": 1500,
                    "max_capacity": 20
                },
                "attentants": [
                    {
                        "client": {
                        "_id": "60df26e8a2c4e82f644c016c",
                        "name": "John Doe",
                        "email": "john.doe@example.com",
                        "phone": "123-456-7890"
                        },
                        "review": {
                        "_id": "60df26e8a2c4e82f644c016d",
                        "rating": 5,
                        "comment": "Really enjoyed the experience."
                        }
                    },
                        {
                            "client": {
                                "_id": "60df26e8a2c4e82f644c0190",
                                "name": "Olivia White",
                                "email": "olivia.white@example.com",
                                "phone": "123-456-7890"
                            },
                            "review": {
                                "_id": "60df26e8a2c4e82f644c0191",
                                "rating": 5,
                                "comment": "An amazing journey, will cherish the memories forever!"
                            }
                        },
                        {
                            "client": {
                                "_id": "60df26e8a2c4e82f644c0192",
                                "name": "Ethan Harris",
                                "email": "ethan.harris@example.com",
                                "phone": "901-234-5678"
                            },
                            "review": {
                                "_id": "60df26e8a2c4e82f644c0193",
                                "rating": 4,
                                "comment": "Great experience, would love to do it again!"
                            }
                        }
                ]
            }
        ]
    },
    {
        "_id": "5f8f4b3b9b1f3b0017f3b3b2",
        "company": {
            "_id": "60df26e8a2c4e82f644c016e",
            "name": "Wilderness Explorers",
            "location": "Denver",
            "contact": "info@wildernessexplorers.com"
        },
        "Trips" : [
            {
                "details": {
                "_id": "60df26e8a2c4e82f644c016f",
                "name": "Rocky Mountain Backpacking",
                "date": "2024-06-20",
                "duration": "7 days",
                "price": 2000,
                "max_capacity": 15
                },
                "attentants": [
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0170",
                            "name": "Jane Smith",
                            "email": "jane.smith@example.com",
                            "phone": "987-654-3210"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0171",
                            "rating": 4,
                            "comment": "Beautiful scenery, knowledgeable guides."
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0172",
                            "name": "Michael Johnson",
                            "email": "michael.johnson@example.com",
                            "phone": "456-789-0123"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0173",
                            "rating": 5,
                            "comment": "An unforgettable experience!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0186",
                            "name": "Sarah Taylor",
                            "email": "sarah.taylor@example.com",
                            "phone": "345-678-9012"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0187",
                            "rating": 4,
                            "comment": "Loved the diversity of wildlife!"
                        }
                    }
                ]
            },
            {
                "details": {
                    "_id": "60df26e8a2c4e82f644c017d",
                    "name": "Maasai Mara Safari",
                    "date": "2024-09-20",
                    "duration": "4 days",
                    "price": 1800,
                    "max_capacity": 10
                },
                "attentants": [
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c017e",
                            "name": "Jessica Brown",
                            "email": "jessica.brown@example.com",
                            "phone": "234-567-8901"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c017f",
                            "rating": 5,
                            "comment": "Witnessed incredible wildlife!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0188",
                            "name": "Alicia Martinez",
                            "email": "alicia.martinez@example.com",
                            "phone": "789-012-3456"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0189",
                            "rating": 5,
                            "comment": "Unforgettable experience, highly recommended!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c018a",
                            "name": "Daniel Thompson",
                            "email": "daniel.thompson@example.com",
                            "phone": "234-567-8901"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c018b",
                            "rating": 4,
                            "comment": "Amazing trip, great guides!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c018c",
                            "name": "Sophie Garcia",
                            "email": "sophie.garcia@example.com",
                            "phone": "567-890-1234"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c018d",
                            "rating": 5,
                            "comment": "Incredible adventure, exceeded expectations!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c018e",
                            "name": "Matthew Lee",
                            "email": "matthew.lee@example.com",
                            "phone": "345-678-9012"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c018f",
                            "rating": 4,
                            "comment": "Beautiful landscapes, friendly staff."
                        }
                    }
                ]
            }
        ]
    },
    {
        "_id": "5f8f4b3b9b1f3b0017f3b3b3",
        "company": {
            "_id": "60df26e8a2c4e82f644c0174",
            "name": "Tropical Adventures Ltd.",
            "location": "Miami",
            "contact": "hello@tropicaladventures.com"
        },
        "Trips": [
            {
                "details": {
                    "_id": "60df26e8a2c4e82f644c0175",
                    "name": "Caribbean Cruise",
                    "date": "2024-08-10",
                    "duration": "10 days",
                    "price": 3000,
                    "max_capacity": 30
                },
                "attentants": [
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0176",
                            "name": "Emily Davis",
                            "email": "emily.davis@example.com",
                            "phone": "321-654-0987"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0177",
                            "rating": 5,
                            "comment": "Absolutely amazing trip!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0172",
                            "name": "Michael Johnson",
                            "email": "michael.johnson@example.com",
                            "phone": "456-789-0123"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0173",
                            "rating": 5,
                            "comment": "An unforgettable experience!"
                        }
                    }
                ]
            }
        ]
    },
    {
        "_id": "5f8f4b3b9b1f3b0017f3b3b4",
        "company": {
            "_id": "60df26e8a2c4e82f644c0178",
            "name": "Alpine Adventures",
            "location": "Seattle",
            "contact": "info@alpineadventures.com"
        },
        "Trips": [
            {
                "details": {
                    "_id": "60df26e8a2c4e82f644c0179",
                    "name": "Skiing in the Alps",
                    "date": "2024-12-01",
                    "duration": "7 days",
                    "price": 2500,
                    "max_capacity": 12
                },
                "attentants": [
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c017a",
                            "name": "Chris Williams",
                            "email": "chris.williams@example.com",
                            "phone": "789-012-3456"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c017b",
                            "rating": 4,
                            "comment": "Great slopes and cozy accommodations!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0186",
                            "name": "Sarah Taylor",
                            "email": "sarah.taylor@example.com",
                            "phone": "345-678-9012"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0187",
                            "rating": 4,
                            "comment": "Loved the diversity of wildlife!"
                        }
                    },{
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0190",
                            "name": "Olivia White",
                            "email": "olivia.white@example.com",
                            "phone": "123-456-7890"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0191",
                            "rating": 5,
                            "comment": "An amazing journey, will cherish the memories forever!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0192",
                            "name": "Ethan Harris",
                            "email": "ethan.harris@example.com",
                            "phone": "901-234-5678"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0193",
                            "rating": 4,
                            "comment": "Great experience, would love to do it again!"
                        }
                    }
                ]
            }
        ]
    },
    {
        "_id": "5f8f4b3b9b1f3b0017f3b3b6",
        "company": {
            "_id": "60df26e8a2c4e82f644c0180",
            "name": "Northern Lights Expeditions",
            "location": "Reykjavik",
            "contact": "info@northernlights.com"
        },
        "Trips":[
            {
                "details": {
                    "_id": "60df26e8a2c4e82f644c0181",
                    "name": "Icelandic Aurora Tour",
                    "date": "2024-11-10",
                    "duration": "6 days",
                    "price": 2800,
                    "max_capacity": 15
                },
                "attentants": [
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0182",
                            "name": "David Wilson",
                            "email": "david.wilson@example.com",
                            "phone": "567-890-1234"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0183",
                            "rating": 5,
                            "comment": "Breathtaking views of the aurora borealis!"
                        }
                    }
                ]
            }
        ]
    },
    {
        "_id": "5f8f4b3b9b1f3b0017f3b3b7",
        "company": {
            "_id": "60df26e8a2c4e82f644c0184",
            "name": "Amazon Expeditions",
            "location": "Manaus",
            "contact": "contact@amazonexpeditions.com"
        },
        "Trips": [
            {
                "details": {
                    "_id": "60df26e8a2c4e82f644c0185",
                    "name": "Jungle Adventure",
                    "date": "2024-10-05",
                    "duration": "8 days",
                    "price": 2200,
                    "max_capacity": 20
                },
                "attentants": [
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0186",
                            "name": "Sarah Taylor",
                            "email": "sarah.taylor@example.com",
                            "phone": "345-678-9012"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0187",
                            "rating": 4,
                            "comment": "Loved the diversity of wildlife!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0188",
                            "name": "Alicia Martinez",
                            "email": "alicia.martinez@example.com",
                            "phone": "789-012-3456"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0189",
                            "rating": 5,
                            "comment": "Unforgettable experience, highly recommended!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c018a",
                            "name": "Daniel Thompson",
                            "email": "daniel.thompson@example.com",
                            "phone": "234-567-8901"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c018b",
                            "rating": 4,
                            "comment": "Amazing trip, great guides!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c018c",
                            "name": "Sophie Garcia",
                            "email": "sophie.garcia@example.com",
                            "phone": "567-890-1234"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c018d",
                            "rating": 5,
                            "comment": "Incredible adventure, exceeded expectations!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c018e",
                            "name": "Matthew Lee",
                            "email": "matthew.lee@example.com",
                            "phone": "345-678-9012"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c018f",
                            "rating": 4,
                            "comment": "Beautiful landscapes, friendly staff."
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0190",
                            "name": "Olivia White",
                            "email": "olivia.white@example.com",
                            "phone": "123-456-7890"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0191",
                            "rating": 5,
                            "comment": "An amazing journey, will cherish the memories forever!"
                        }
                    },
                    {
                        "client": {
                            "_id": "60df26e8a2c4e82f644c0192",
                            "name": "Ethan Harris",
                            "email": "ethan.harris@example.com",
                            "phone": "901-234-5678"
                        },
                        "review": {
                            "_id": "60df26e8a2c4e82f644c0193",
                            "rating": 4,
                            "comment": "Great experience, would love to do it again!"
                        }
                    }
                ]
            }
        ]
    }
]
```
---

Punktacja:

|         |     |
| ------- | --- |
| zadanie | pkt |
| 1       | 0,6 |
| 2       | 1,4 |
| razem   | 2   |



