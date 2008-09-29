Screw.Stub = (function() {
    var self = {};
    var stubbedObjects = [];

    self.stub = function(obj, name) {
        var returnVal = null;
        var old_val = obj[name];

        var self = function() {
            return returnVal;
        };

        self.and_return = function(val) {
            returnVal = val;
            return self;
        };

        self.reset = function() {
            obj[name] = old_val;
        };

        stubbedObjects.push(self);
        obj[name] = self;
        return self;
    };

    self.reset = function() {
        while (stub = stubbedObjects.pop()) {
            stub.reset();
        }
    };

    return self;
}());

Object.prototype.stub = function(name) {
    return Screw.Stub.stub(this, name);
};

Screw.Unit(function() {
    after(function() {
        Screw.Stub.reset();
    })
});
