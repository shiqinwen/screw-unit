Screw.Unit(function() {
    
    describe("Screw.Prototype.Ajax", function () {
        var response;
        before(function (me) {
            if (!window.Prototype) {
                skip(me).because("Prototype is not running in this test");
            }
            Screw.Prototype.Ajax.mock("/a_url", "someText", 200);
        });
        
        it("should send the response you added to the onComplete function", function () {
            var ajx = new Ajax.Request("/a_url", {
                onComplete: function (resp) { response = resp }
            });
            expect(response.responseText).to(equal, "someText");
        });
        
        it("should send the response you added to the onSuccess function when the response is a 200", function () {
            var ajx = new Ajax.Request("/a_url", {
                onSuccess: function (resp) { response = resp }
            });
            expect(response.responseText).to(equal, "someText");
        });
        
        it("should send the response to onFailure when the response is not a 200", function () {
            Screw.Prototype.Ajax.mock("/a_url", "someText", 400);
            var ajx = new Ajax.Request("/a_url", {
                onFailure: function (resp) { response = resp }
            });
            expect(response.responseText).to(equal, "someText");
        });
        
        it("should raise when you call an unmocked ajax url", function () {
            var raised = false;
            try {
                var ajx = new Ajax.Request("/a_different_url");
            } catch (e) {
                raised = true;
            }
            expect(raised).to(be_true);
        });
        
        it("should do responseJSON when the response is JSON if Prototype is included", function () {
            if (!window.Prototype){return}
            Screw.Prototype.Ajax.mock("/a_url", "{'foo': 'bar'}", 200);
            var ajx = new Ajax.Request("/a_url", {
                onComplete: function (resp) { response = resp }
            });
            expect(response.responseJSON.foo).to(equal, 'bar');
        });
        
    });

});
