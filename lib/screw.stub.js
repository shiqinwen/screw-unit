Screw.Stub = (function() {
    var self = {};
    var stubbedObjects = [];

    self.shouldReceive = function(obj, name) {
        var private = {};
        private.returnVal = null;

        public = function() {
            return private.returnVal;
        };

        public.andReturn = function(val) {
            private.returnVal = val;
            return public;
        };

        obj[name] = public;
        return public;
    };

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
