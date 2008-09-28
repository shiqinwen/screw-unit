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
    });
});
