db.system.js.save({
    _id: "findProductsByName",
    value: function(name, caseInsensitive = true) {
        var query = caseInsensitive ? { name: { $regex: name, $options: 'i' } } : { name: name };
        return db.products.find(query).toArray();
    }
});

db.eval("findProductsByName('Tomato Sauce', true)");
