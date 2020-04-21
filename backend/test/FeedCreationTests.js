var agencyCreate = require('../feed_creation');
var assert = require('assert');

describe('Agency test', function(){
    it('Agency test should return the proper number of agencies', function(){
            var agencies = agencyCreate(1).length;
            assert.equal(agencies, 1);
    });
});

