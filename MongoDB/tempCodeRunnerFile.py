average_rating = collection.aggregate([
    {"$unwind": "$Trips"},
    {"$unwind": "$Trips.attentants"},
    {"$group": {"_id": None, "avgRating": {"$avg": "$Trips.attentants.review.rating"}}}
])
for result in average_rating:
    print("\nAverage rating of all trips:", result["avgRating"])

client.close()