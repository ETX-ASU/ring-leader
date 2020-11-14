// Requiring module 
const assert = require('assert'); 
const jwt = require("jsonwebtoken");
const mocha = require("mocha");

// We can group similar tests inside a describe block 
describe("Simple Calculations", () => { 
before(() => { 
	console.log( "This part executes once before all tests" ); 
}); 

after(() => { 
	console.log( "This part executes once after all tests" ); 
}); 
	
// We can add nested blocks for different tests 
describe( "Test1", () => { 
    let resToken = '';
    let jwtToken = 'aa';
   	beforeEach(() => { 
        jwtToken = "adsfasdfdsafsadfsdfsadfasdfsafsdfsdfsadfsadfsadfsfdsdafsdfsdafdsfasdfsdf";
        const jtsToken = jwtToken.substr(0, 40) + "cfea46eaf36c43c3b2d4c67a1546ed36" + jwtToken.substring(40);
        resToken = jtsToken.substr(0, 40) + jtsToken.substring(72);
    });
    it("Jwks are equal", () => { 
        assert.equal(jwtToken, resToken); 
      }); 
    


}); 
});
