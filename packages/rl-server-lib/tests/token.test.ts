// Requiring module 
import assert from 'assert'; 
import jwt from "jsonwebtoken";
import {describe, before, after, beforeEach, it} from 'mocha';
import {getRedirectToken, validateTokenWithToolConsumer} from '../src/util/externalRedirect';
const toolConsumers = require("./.tool_consumers.test.json");

// We can group similar tests inside a describe block 
describe("Simple Calculations", () => { 
before(() => { 
	console.log( "This part executes once before all tests" ); 
}); 

after(() => { 
	console.log( "This part executes once after all tests" ); 
}); 
	
// We can add nested blocks for different tests 
describe( "Simple token test", () => { 
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

// We can add nested blocks for different tests 
describe( "Test token validation", () => { 
    let key = "thisisakey";
    let keyFinal = 'aa';
   	beforeEach(() => { 
        const jwtToken = getRedirectToken(toolConsumers[0], key);
        keyFinal = validateTokenWithToolConsumer(jwtToken, toolConsumers[0]);
    });
    it("Jwks are equal", () => { 
        assert.equal(key, keyFinal); 
      }); 
    


}); 
});
