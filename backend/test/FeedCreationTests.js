var feed_creation = require('../js/feed_creation');
var assert = require('assert');

//Unit testing for feed creation. All files are similar so we do not need to test all
//testing populated array
describe('Agency test', function(){
    it('Agency test should return the proper number of agencies', function(){
            var agencies = feed_creation.agencyCreate(1).length;
            assert.equal(agencies, 1);
    });
});
//testing empty array
describe('Empty Agency', function(){
    it("Should be an empty array", function(){
        var agencies = feed_creation.agencyCreate(0).length;
        assert.equal(agencies, 0);
    });
});

//testing return type
describe("Type test: Array", function(){
    it("Should return an array", function(){
        var agencies = feed_creation.agencyCreate(4);
        assert.typeOf(agencies, "array");
    });
});

describe("Type test: Object", function(){
    it("Return type should be an object", function(){
        var object = feed_creation.feedInfoCreate(20200421, 20200428);
        assert.typeOf(object, "object");
    });
});

