Screw.Stub = (function() {
    var self = {};
    var stubbedObjects = [];

    self.stub = function(obj, name) {
        var returnVal = null;
        var oldVal = obj[name];

        var self = function() {
            return returnVal;
        };

        self.andReturn = function(val) {
            returnVal = val;
            return self;
        };

        self.reset = function() {
            obj[name] = oldVal;
        };

        stubbedObjects.push(self);
        obj[name] = self;
        return self;
    };

    self.reset = function() {
        while ((stub = stubbedObjects.pop()) !== undefined) {
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
    });
});
