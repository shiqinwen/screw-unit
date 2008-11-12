Screw.Unit(function() {
    
    describe("Screw.Mock.insertDom", function () {
        before(function () {
            Screw.Mock.insertDom("dom_mock_test")
        });
        
        it("should add the file to the DOM", function () {
            expect(jQuery("#dom_test")).to(contain_selector, ".dom_mock");
        });
    });
    
    describe("Screw.Mock.click", function () {
        var clickReceived;
        before(function () {
            clickReceived = false;
            Screw.Mock.insertDom("click_test");
            jQuery("#click_tester").bind("click", function () {
                clickReceived = true;
            });
        });
        
        it("should fire the browser click event", function () {
            Screw.Mock.click(jQuery("#click_tester")[0]);
            expect(clickReceived).to(be_true);
        });        
    });

});
