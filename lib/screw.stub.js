Screw.Stub = (function() {
    var self = {};
    var stubbedObjects = [];

    var base = function(obj, name, private) {
        private = private || {};
        var self = {};

        private.oldVal = obj[name];
        private.returnVal = null;
        private.functionWasCalled = function() {};

        self = function() {
            private.functionWasCalled();
            return private.returnVal;
        };

        self.andReturn = function(val) {
            private.returnVal = val;
            return self.public;
        };

        self.reset = function() {
            obj[name] = private.oldVal;
        };

        self.validate = function() {
            return true;
        };

        stubbedObjects.push(self);

        obj[name] = self;
        return self;
    };

    self.shouldReceive = function(obj, name) {
        var private = {};
        var self = base(obj, name, private);

        private.expectedCallCount = 1;
        private.actualCallCount = 0;
        private.validated = false

        private.functionWasCalled = function() {
            private.actualCallCount += 1;
        };

        self.validate = function() {
            if (!private.validated && private.expectedCallCount !== private.actualCallCount) {
                private.validated = true;
                throw('expected ' + $.print(name) + ' to be called ' + 
                      $.print(private.expectedCallCount) + 
                      ' times, but it was called ' + 
                      $.print(private.actualCallCount) + ' times.');
            }
        };

        return self;
    };

    self.stub = function(obj, name) {
        var self = base(obj, name);
        return self;
    };

    self.validate = function() {
        for (i=0; i < stubbedObjects.length; i++) {
            var stub = stubbedObjects[i];
            if (stub) {
              stub.validate();
            }
        }
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
        Screw.Stub.validate();
        Screw.Stub.reset();
    });
});
