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

            it("stubs next to stubs", function() {
                Screw.Stub.stub(obj, "pizza").andReturn("cheese");
                Screw.Stub.stub(obj, "soda").andReturn("coke");
                expect(obj.pizza()).to(equal, "cheese");
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

            describe("with a stub implementation", function() {
                it("calls the stub implementation", function() {
                    var called = false;
                    Screw.Stub.stub(obj, "pizza").as(function() {
                        called = true;
                    });
                    obj.pizza();
                    expect(called).to(be_true);
                });

                it("returns the return value of the stub implementation", function() {
                    Screw.Stub.stub(obj, "pizza").as(function() {
                        return "cheese";
                    });
                    expect(obj.pizza()).to(equal, "cheese");
                });

                it("passes arguments to the stub implementation", function() {
                    var args;
                    Screw.Stub.stub(obj, "pizza").as(function() {
                        args = arguments;
                    });
                    obj.pizza("really", "really", "tasty");
                    expect(args).to(equal, ["really", "really", "tasty"]);
                });

                it("calls the stub implementation with the correct receiver", function() {
                    var receiver;
                    Screw.Stub.stub(obj, "pizza").as(function() {
                        receiver = this;
                    });
                    obj.pizza();
                    expect(receiver).to(equal, obj);
                });

                it("works on constructors", function() {
                    Screw.Stub.stub(window, "Pizza").as(function(topping) {
                        this.topping = topping;
                    });
                    
                    expect(new Pizza("pepperoni").topping).to(equal, "pepperoni");
                });
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

            it("expects to be called once", function() {
                Screw.Stub.shouldReceive(obj, "pizza");
                expect(obj.pizza.validate).to(raise);
            });

            it("should be told to expect N calls", function() {
                Screw.Stub.shouldReceive(obj, "pizza").numberOfTimes(0);
                obj.pizza();
                expect(obj.pizza.validate).to(raise, 'expected "pizza" to be called 0 times, but it was called 1 times.');
            });

            it("should only match specified arguments if requested", function() {
                obj.pizza = function() { return "gross" };
                Screw.Stub.shouldReceive(obj, "pizza").withArguments("cheese").andReturn("yummy");
                expect(obj.pizza()).to(equal, "gross");
                expect(obj.pizza("cheese")).to(equal, "yummy");
                expect(obj.pizza.validate).to_not(raise);
            });

            it("should correctly match null values in specified argument list", function() {
                obj.pizza = function() { return "gross" };
                Screw.Stub.shouldReceive(obj, "pizza").withArguments(null, "cheese").andReturn("null yummy");
                expect(obj.pizza()).to(equal, "gross");
                expect(obj.pizza(null, "cheese")).to(equal, "null yummy");
                expect(obj.pizza.validate).to_not(raise);
            });

            it("should match arguments using matchers", function() {
                Screw.Stub.shouldReceive(obj, "pizza").withArguments(argWhichWill(match, /sausage/));
                obj.pizza("turkey sausage");
                expect(obj.pizza.validate).to_not(raise);
            });

            it("should only validate once", function() {
                Screw.Stub.shouldReceive(obj, "pizza");
                expect(obj.pizza.validate).to(raise);
                expect(obj.pizza.validate).to_not(raise);
            });

            it("resets", function() {
                obj = (function() {
                  self = {};
                  var private = 'hello';
                  self.pizza = function() { return private; };
                  return self;
                })();
                var expected = obj.pizza();

                Screw.Stub.shouldReceive(obj, "pizza");
                Screw.Stub.reset();
                expect(obj.pizza()).to(equal, expected);
            });

            it("should call original method with arguments if stub is not matched", function() {
              var originalMethodCalled = false;
              obj = { methodToStub: function(a) {
                        originalMethodCalled = true;
                        expect(a).to(equal, 'foo'); } };
              Screw.Stub.shouldReceive(obj, 'methodToStub').withArguments('bar');
              obj.methodToStub('foo');
              obj.methodToStub('bar');
              expect(originalMethodCalled).to(be_true);
            });
        });
    });
});
