Screw.Unit(function() {
    describe("Screw.Stub", function() {
        var obj;

        before(function() {
            obj = {};
        });

        it("returns null for stubbed methods", function() {
            obj.stub("pizza");
            expect(obj.pizza()).to(equal, null);
        });
        
        it("accepts a return value", function() {
            var ret = "hello";
            obj.stub("pizza").and_return(ret);
            expect(obj.pizza()).to(equal, ret);
        });

        it("stubs over stubs", function() {
            obj.stub("pizza").and_return("cheese");
            obj.stub("pizza").and_return("sausage");
            expect(obj.pizza()).to(equal, "sausage");
        });

        it("resets stubs", function() {
            obj = (function() {
              self = {};
              var private = 'hello';
              self.pizza = function() { return private };
              return self;
            })();
            var expected = obj.pizza();

            obj.stub("pizza");
            Screw.Stub.reset();
            expect(obj.pizza()).to(equal, expected);
        });
    });
});
