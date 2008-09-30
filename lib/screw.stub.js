Screw.Stub = (function() {
    var self = {};
    var stubbedObjects = [];

    var base = function(obj, name) {
        var self = {private: {}};
        self.private.returnVal = null;

        self.public = function() {
            return self.private.returnVal;
        };

        self.public.andReturn = function(val) {
            self.private.returnVal = val;
            return self.public;
        };

        obj[name] = self.public;
        return self;
    };

    self.shouldReceive = function(obj, name) {
        var self = base(obj, name);
        return self.public;
    };

    self.stub = function(obj, name) {
        var oldVal = obj[name];
        var self = base(obj, name);

        self.public.reset = function() {
            obj[name] = oldVal;
        };

        stubbedObjects.push(self.public);
        return self.public;
    };

    self.reset = function() {
        var stub;
        while ((stub = stubbedObjects.pop()) !== undefined) {
            stub.reset();
        }
    };

    return self;
}());

Screw.Unit(function() {
    after(function() {
        Screw.Stub.reset();
    });
});
