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

```js
--  ...
```

---

Punktacja:

|         |     |
| ------- | --- |
| zadanie | pkt |
| 1       | 0,6 |
| 2       | 1,4 |
| razem   | 2   |



