Screw.Unit(function() {
    describe("Screw.Stub", function() {
        var obj;

        before(function() {
            obj = {};
        });

        describe(".stub", function() {
            it("returns null for stubbed methods", function() {
                Screw.Stub.stub(obj, "pizza");
                expect(obj.pizza()).to(equal, null);
            });
            
            it("accepts a return value", function() {
                var ret = "hello";
                Screw.Stub.stub(obj, "pizza").andReturn(ret);
                expect(obj.pizza()).to(equal, ret);
            });

            it("stubs over stubs", function() {
                Screw.Stub.stub(obj, "pizza").andReturn("cheese");
                Screw.Stub.stub(obj, "pizza").andReturn("sausage");
                expect(obj.pizza()).to(equal, "sausage");
            });

            it("resets stubs", function() {
                obj = (function() {
                  self = {};
                  var private = 'hello';
                  self.pizza = function() { return private; };
                  return self;
                })();
                var expected = obj.pizza();

                Screw.Stub.stub(obj, "pizza");
                Screw.Stub.reset();
                expect(obj.pizza()).to(equal, expected);
            });
        });

        describe(".shouldReceive", function() {
            it("returns null if given no return value", function() {
                Screw.Stub.shouldReceive(obj, "pizza");
                expect(obj.pizza()).to(equal, null);
            });

            it("accepts a return value", function() {
                Screw.Stub.shouldReceive(obj, "pizza").andReturn("hey");
                expect(obj.pizza()).to(equal, "hey");
            });
        });
    });
});
