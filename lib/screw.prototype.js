Screw.Prototype = {};

/** This mocks out Prototype's ajax calls so that you don't need a server in your tests
    @example
      Screw.Prototype.Ajax.mock("/a_url", "someText", 200);
      var ajx = new Ajax.Request("/a_url", {
          onComplete: function (resp) { response = resp }
      });
      expect(response.responseText).to(equal, "someText");
      
    @namespace
*/
Screw.Prototype.Ajax = (function () {
    /** @namespace */
    var publicObj = {};
    
    var mockAjaxHash = {};
    
    /** Lets you count the number of requests on a certain URL
        @example
          Screw.Prototype.Ajax.mock("/a_url", "someText", 200);
           var ajx = new Ajax.Request("/a_url", {
               onComplete: function (resp) { response = resp }
           });
           expect(Screw.Prototype.Ajax.requestCont["/a_url"]).to(equal, 1);
    
        @name Screw.Prototype.Ajax.requestCount
    */
    publicObj.requestCount = {};
    
    /** Reset the request count - used in a before()
        @name Screw.Prototype.Ajax.reset
        @function
    */
    publicObj.reset = function () {
        publicObj.requestCount = {};
    };
    
    /** this is the main mocking interface
        @param {String} urlToMock the url that you want to respond with your response
        @param {String} response the text you want the server to send back. Text will try to be
          evaled into JSON so that responseJSON can be set.
        @param {Number} status (optional) the response code you want the server to send
        
        @example
          Screw.Prototype.Ajax.mock("/a_url", "someText", 200);
          var ajx = new Ajax.Request("/a_url", {
              onComplete: function (resp) { response = resp }
          });
          expect(response.responseText).to(equal, "someText");
        
        @name Screw.Prototype.Ajax.mock
        @function
    */
    publicObj.mock = function (urlToMock, response, status) {
        status = status || 200;
        mockAjaxHash[urlToMock] = { response: response, status: status };
        
        Ajax = {};
        Ajax.Request = function(url, opts) {
            if (!mockAjaxHash.hasOwnProperty(url)) {
                throw new Error("ajax request called with: " + url + " but no mock was found");
            }
            
            if (!publicObj.requestCount[url]) {
                publicObj.requestCount[url] = 1;
            } else {
                publicObj.requestCount[url]++;
            }
            
            if(opts.onComplete || opts.onSuccess || opts.onFailure) {
                response = {};
                response.responseText = mockAjaxHash[url].response;
                response.status = mockAjaxHash[url].status;
                try {
                    response.responseJSON = response.responseText.evalJSON();
                } catch (e) {
                    response.responseJSON = null;
                }
                
                if ((response.status == 200) && opts.onSuccess) {
                    opts.onSuccess(response);
                } else {                    
                    if (opts.onFailure) {
                        opts.onFailure(response);
                    }
                }
                if (opts.onComplete) {
                    opts.onComplete(response);
                }
            }
        };
    };
    
    return publicObj;
})();

Screw.Unit(function() {
    before(function() {
        Screw.Prototype.Ajax.reset();
    });
});
