/** @fileOverview
      A mocking framework for screw-unit.  Allows you to temporarily mock out
      functions with objects you are not testing.

      @author <a href="mailto:topper@toppingdesign.com">Topper Bowers</a>
*/

/** Test helper main namespace
    @namespace
*/
Screw.Mock = (function () {
    /** @namespace */
    var publicObj = {};
    
    /** used to insert a dom mock for the test being run
        assumes a <div> with an id of "dom_test" and directory
        of dom_mocks at the same level as suite.html called "dom_mocks"
        
        @param {String} mock the name of the mock to put into the div (you can skip the html)
        @param {Object} opts takes an optional insert or a specific element (instead of #dom_test)
        
        @throws mock must be specified if no mock is specified
        
        @example
          Screw.Mock.insertDom("some_mock"); // will insert dom_mocks/some_mock.html into <div id='#dom_test'><div>
          
        @name Screw.Mock.insertDom
        @function
    */
    publicObj.insertDom = function(mock, opts) {
        if (!mock) {
            throw new Error("mock must be specified");
        }
        opts = opts || {};
        
        var element = opts.element || jQuery("#dom_test");
        
        element = jQuery(element);
        if (!/\.html$/.test(mock)) {
            mock += ".html";
        }
        
        var url = "dom_mocks/" + mock;

        var handleResponse = function (html) {
            if (opts.insert) {
                element.append(html);
            } else {
                element.html(html);
            }
        };
        
        // use jQuery here so we can mock out Ajax.Request for the tests
        var ajx = jQuery.ajax({
            url: url,
            async: false,
            type: 'GET',
            success: handleResponse
        });
    };

    /** simulate a browser click on an element passed to the function
        @param {DomElement} el The element to receive the click
        
        @name Screw.Mock.click
        @function
    */
    publicObj.click = function(el) {
        if(jQuery.browser.msie) {
          el.click();
        } else {
          var evt = document.createEvent("MouseEvents");
          evt.initEvent("click", true, true);
          el.dispatchEvent(evt);
        }
    };
    
    /** pause the operation of a page for X miliseconds
        @param {Number} millis the number of miliseconds to pause
        @name Screw.Mock.pause
        @function
    */
    publicObj.pause = function (millis) {
        var date = new Date();
        var curDate = null;

        do { curDate = new Date(); }
        while(curDate-date < millis);
    };

    return publicObj;    
})();

Screw.Unit(function() {
    before(function() {
        if (jQuery("#dom_test")) {
            jQuery('#dom_test').empty();
        }
        Screw.Prototype.Ajax.reset();
    });
});
