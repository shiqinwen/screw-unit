Object.prototype.stub = function(name) {
    var returnVal = null;

    var self = function() {
        return returnVal;
    }

    self.and_return = function(val) {
        returnVal = val;
        return self;
    }

    this[name] = self;
    return self;
};
