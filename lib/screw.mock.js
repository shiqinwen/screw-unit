var TH = (function () {
    var publicObj = {};
    
    publicObj.insertDomMock = function(mock, opts) {
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

    publicObj.click = function(el) {
        if(jQuery.browser.msie) {
          el.click();
        } else {
          var evt = document.createEvent("MouseEvents");
          evt.initEvent("click", true, true);
          el.dispatchEvent(evt);
        }
    };
    
    publicObj.pause = function (millis) {
        var date = new Date();
        var curDate = null;

        do { curDate = new Date(); }
        while(curDate-date < millis);
    };

    return publicObj;    
})();

TH.Mock = (function () {
    var publicObj = {};    
    publicObj.mockedObjects = {};
    
    var extendObject = function(destination, source) {
      for (var property in source)
        destination[property] = source[property];
      return destination;
    };
    
    var MockedObject = function (props) {
        extendObject(this, props);
        this.countCallsCache = {};
    };
    
    MockedObject.prototype = {
        countCallsOf: function (propString) {
            this.countCallsCache[propString] = {};
            var prop = this.countCallsCache[propString];
            prop.count = 0;
            this[propString] = function () {
                this.countCallsCache[propString].count++;
            }.bind(this);         
        },
        numberOfCallsTo: function(propString) {
            return this.countCallsCache[propString].count;
        }
        
    };
    
    publicObj.obj = function (mockString, newObj) {
        var oldObj = eval(mockString);
        var obj;
        if (!(typeof oldObj == "object")) {
            throw new Error("TH.Mock.obj called on a string that doesn't evaluate into an object");
        }
        obj = new MockedObject(oldObj);
        extendObject(obj, newObj);
        
        publicObj.mockedObjects[mockString] = {};
        publicObj.mockedObjects[mockString].newObj = obj;
        publicObj.mockedObjects[mockString].oldObj = oldObj;
        
        eval(mockString + " = TH.Mock.mockedObjects['" + mockString + "'].newObj");
        
        return obj;
    };
    
    publicObj.reset = function () {
        var m;
        var obj;
        for (mockString in publicObj.mockedObjects) {
            if (publicObj.mockedObjects.hasOwnProperty(mockString)) {
                eval(mockString + " = TH.Mock.mockedObjects['" + mockString + "'].oldObj");
            }
        }
        publicObj.mockedObjects = {};
    };
    
    publicObj.numberOfCallsTo = function (mockString, propString) {
        var obj = eval(mockString);
        return obj.numberOfCallsTo(propString);
    };

    // for dev
    publicObj.dirMocks = function () {
        console.dir(mockCache);
    };
    
    publicObj.dirCountCalls = function () {
        console.dir(countCallsCache);
    };
    
    return publicObj;
})();

TH.Ajax = (function () {
    var publicObj = {};
    
    var mockAjaxHash = {};
    
    publicObj.requestCount = {};
    
    publicObj.reset = function () {
        publicObj.requestCount = {};
    };
    
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
