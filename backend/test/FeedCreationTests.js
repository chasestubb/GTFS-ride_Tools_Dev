var feed_creation = require('../js/feed_creation');
var assert = require('chai').assert;

// assert('foo' !== 'bar', 'foo is not bar');
// assert(Array.isArray([]), 'empty arrays are arrays');
// assert.equal(3, '3', '== coerces values to strings');


//Unit testing for feed creation. All files are similar so we do not need to test all
//testing populated array
describe('FEED CREATION :: Agency test', function(){
    it('Agency test should return the proper number of agencies', function(){
            var agencies = feed_creation.agencyCreate(1).length;
            assert.equal(agencies, 1, '== coerces values to strings');
    });
});
//testing empty array
describe('FEED CREATION :: Empty Agency', function(){
    it("Should be an empty array", function(){
        var agencies = feed_creation.agencyCreate(0).length;
        assert.equal(agencies, 0, '== coerces values to strings');
    });
});

//testing return type
describe("FEED CREATION :: Type test: Array", function(){
    it("Should return an array", function(){
        var agencies = feed_creation.agencyCreate(4);
        assert.typeOf(agencies, "array");
    });
});

describe("FEED CREATION :: Type test: Array", function(){
    it("Return type should be an array", function(){
        var feedInfo = feed_creation.feedInfoCreate(20200421, 20200428);
        assert.typeOf(feedInfo, "array");
    });
});