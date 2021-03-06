var feed_creation = require('../js/feed_creation');
var assert = require('chai').assert;

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

describe("Type test: Object", function(){
    it("Return type should be an object", function(){
        var object = feed_creation.feedInfoCreate(20200421, 20200428);
        assert.typeOf(object, "object");
    });
});

describe("FEED CREATION :: Calendar test", function(){
    it("testing argument values for weekend calendar", function(){
    var calendar = feed_creation.calendarCreate(0, 20200421, 20200428, 0);
    assert.equal(calendar.service_id, 'WEEKEND_CALENDAR', "service_id == WEEKEND_CALENDAR");
    assert.equal(calendar.monday, 0, 'monday == 0');
    assert.equal(calendar.tuesday, 0, " tuesday == 0");
    assert.equal(calendar.saturday, 1, "saturday == 0");
    assert.equal(calendar.sunday, 1, "sunday == 1");
    });
});

describe("FEED CREATION :: Calendar test - bad operation days", function(){
    it("testing unhandled operation days", function(){
        var calendar = feed_creation.calendarCreate(9, 20200421, 20200428, 0);
        assert.equal(calendar, undefined, "calendar should be undefined");
    });
});
