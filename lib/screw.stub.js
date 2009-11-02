Screw.Matchers.argWhichWill = function(matcher, expected) {
  return new Screw.Stub.ArgumentMatcher(matcher, expected);
};

Screw.Stub = (function() {
    var self = {};
    var stubbedObjects = [];

    var base = function(obj, name, priv) {
        priv = priv || {};
        var self = {};

        priv.returnVal = null;
        priv.functionWasCalled = function() {};

        self = function(receiver, args) {
            priv.functionWasCalled();
            
            if (priv.implementation)
              return priv.implementation.apply(receiver, args);
            else
              return priv.returnVal;
        };

        self.andReturn = function(val) {
            priv.returnVal = val;
            return self;
        };
        
        self.as = function(implementation) {
            priv.implementation = implementation;
            return self;
        };

        self.validate = function() {
            return true;
        };

        self.accepts = function() { 
            return true;
        };

        obj[name].stubs.push(self);
        return self;
    };

    var shouldReceive = function(obj, name) {
        var priv = {};
        var self = base(obj, name, priv);

        priv.expectedCallCount = 1;
        priv.actualCallCount = 0;
        priv.validated = false;
        priv.expectedArguments;

        priv.functionWasCalled = function() {
            priv.actualCallCount += 1;
        };

        self.numberOfTimes = function(count) {
            priv.expectedCallCount = count;
            return self;
        };

        self.withArguments = function() {
            priv.expectedArguments = arguments;
            return self;
        };

        self.accepts = function(args) {
            if (!priv.expectedArguments) {
                return true;
            } else if (args.length !== priv.expectedArguments.length) {
                return false;
            } else {
                for (var i=0; i < args.length; i++) {
                    var expected = priv.expectedArguments[i];
                    var actual = args[i];
                    if (expected instanceof Screw.Stub.ArgumentMatcher) {
                        if (!expected.matcher.match(expected.expected, actual))
                            return false;
                    } else if (actual !== expected) {
                        return false;
                    }
                };
                return true;
            }
        };

        self.validate = function() {
            if (!priv.validated && priv.expectedCallCount !== priv.actualCallCount) {
                priv.validated = true;
                throw('expected ' + jQuery.print(name) + ' to be called ' + 
                      priv.expectedCallCount.toString() + 
                      ' times, but it was called ' + 
                      priv.actualCallCount.toString() + ' times.');
            }
        };

        return self;
    };

    var stub = function(obj, name) {
        var self = base(obj, name);
        return self;
    };

    var stubReceiver = function(obj, name) {
        var priv = {};
        priv.oldVal = obj[name];

        var self = function() {
            for(var i=0; i < self.stubs.length; i++) {
                var stub = self.stubs[i];
                if (stub && stub.accepts(arguments)) {
                    return stub(this, arguments);
                }
            }

            if (priv.oldVal.constructor === Function) {
                return priv.oldVal.apply(obj, arguments);
            } else {
                return priv.oldVal;
            }
        };

        self.validate = function() {
            for(var i=0; i < self.stubs.length; i++) {
                var stub = self.stubs[i];
                if (stub) {
                  stub.validate();
                }
            }
        };

        self.reset = function() {
            obj[name] = priv.oldVal;
        };

        self.stubs = [];

        stubbedObjects.push(self);
        obj[name] = self;
    };

    self.shouldReceive = function(obj, name) {
        stubReceiver(obj, name);
        return shouldReceive(obj, name);
    };

    self.stub = function(obj, name) {
        stubReceiver(obj, name);
        return stub(obj, name);
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

    self.ArgumentMatcher = function(matcher, expected) {
      this.matcher = matcher;
      this.expected = expected;
    };

    return self;
}());

Screw.Unit(function() {
    after(function() {
        Screw.Stub.validate();
        Screw.Stub.reset();
    });
});
