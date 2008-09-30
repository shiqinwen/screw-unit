Screw.Stub = (function() {
    var self = {};
    var stubbedObjects = [];

    var base = function(obj, name) {
        var self = {private: {}};

        self.private.oldVal = obj[name];
        self.private.returnVal = null;
        self.private.functionWasCalled = function() {};

        self.public = function() {
            self.private.functionWasCalled();
            return self.private.returnVal;
        };

        self.public.andReturn = function(val) {
            self.private.returnVal = val;
            return self.public;
        };

        self.public.reset = function() {
            obj[name] = self.private.oldVal;
        };

        self.public.validate = function() {
            return true;
        };

        stubbedObjects.push(self.public);

        obj[name] = self.public;
        return self;
    };

    self.shouldReceive = function(obj, name) {
        var self = base(obj, name);

        self.private.expectedCallCount = 1;
        self.private.actualCallCount = 0;

        self.private.functionWasCalled = function() {
            self.private.actualCallCount += 1;
        };

        self.public.validate = function() {
            if (self.private.expectedCallCount !== self.private.actualCallCount) {
                throw('expected ' + $.print(name) + ' to be called ' + 
                      $.print(self.private.expectedCallCount) + 
                      ' times, but it was called ' + 
                      $.print(self.private.actualCallCount) + ' times.');
            }
        };

        return self.public;
    };

    self.stub = function(obj, name) {
        var self = base(obj, name);
        return self.public;
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
