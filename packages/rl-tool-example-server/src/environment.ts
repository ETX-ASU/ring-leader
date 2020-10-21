import path from "path";
import { ToolConsumer } from "@asu-etx/rl-server-lib";

// local dev
//import dotenv from "dotenv";
//let ENV_VARS = dotenv.config().parsed as any;
/*
const ENV_VARS = {
    TOOL_CONSUMERS: [
      {
        name: "canvas-unicon",
        client_id: "97140000000000180",
        iss: "https://canvas.instructure.com",
        platformOIDCAuthEndPoint: "https://unicon.instructure.com/api/lti/authorize_redirect",
        platformAccessTokenEndpoint: "https://unicon.instructure.com/login/oauth2/token",
        alg: "RS256",
        keyid: "ASU ETX - Ring Leader - james-stanley  - Public Key",
        public_key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv0PTzyKB/KiGfJR3oo2Z\nXnVRCBRag7PA4ARCZ5CZMSFuyMtJXZdQKiibTezlFD976lJQZsNTbmXoxEKzho7w\nS5+XEYXtUWhgDmVZ46RPpheay+HUzCikDMIKavOpp7+ri7bIOej9RNjsJ5VzrFI1\nIqLZWT4CyJ/ePzaKRUydpLcvO1mi4gGRblCpB2jm/laUUtAG5yXMpkutMowx1uJr\nLKHjZ8r8bjWw4mqyhbJcx0UKehIc/7yMoeyZpRYtoux0aOPRpL+l8b1uOuVhuLvA\nHl60wuhXrCNHzl39oAyI1+O2vS7t0PTnUZkYyLxQeh5Ca+ja/zj6kFAENgB+4+Ln\nZwIDAQAB\n-----END PUBLIC KEY-----\n",
        public_key_jwk: {
          kty: "RSA",
          n: "v0PTzyKB_KiGfJR3oo2ZXnVRCBRag7PA4ARCZ5CZMSFuyMtJXZdQKiibTezlFD976lJQZsNTbmXoxEKzho7wS5-XEYXtUWhgDmVZ46RPpheay-HUzCikDMIKavOpp7-ri7bIOej9RNjsJ5VzrFI1IqLZWT4CyJ_ePzaKRUydpLcvO1mi4gGRblCpB2jm_laUUtAG5yXMpkutMowx1uJrLKHjZ8r8bjWw4mqyhbJcx0UKehIc_7yMoeyZpRYtoux0aOPRpL-l8b1uOuVhuLvAHl60wuhXrCNHzl39oAyI1-O2vS7t0PTnUZkYyLxQeh5Ca-ja_zj6kFAENgB-4-LnZw",
          e: "AQAB",
          alg: "RS256",
          use: "sig",
          kid: "ASU ETX - Ring Leader - james-stanley  - Public Key"
        },
  
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/Q9PPIoH8qIZ8\nlHeijZledVEIFFqDs8DgBEJnkJkxIW7Iy0ldl1AqKJtN7OUUP3vqUlBmw1NuZejE\nQrOGjvBLn5cRhe1RaGAOZVnjpE+mF5rL4dTMKKQMwgpq86mnv6uLtsg56P1E2Own\nlXOsUjUiotlZPgLIn94/NopFTJ2kty87WaLiAZFuUKkHaOb+VpRS0AbnJcymS60y\njDHW4mssoeNnyvxuNbDiarKFslzHRQp6Ehz/vIyh7JmlFi2i7HRo49Gkv6XxvW46\n5WG4u8AeXrTC6FesI0fOXf2gDIjX47a9Lu3Q9OdRmRjIvFB6HkJr6Nr/OPqQUAQ2\nAH7j4udnAgMBAAECggEBAImN4V395lhsZ1Rffm7kwWGCpAVYhgRkGZnC1nMfNl10\nOvWj5h6uPRQk4hS4A8R9J8RM8NAHOBCUsEO96NkkIcNxgjczB4tdsn+H+o7SVAoS\nvdxVjTJLJDicsNtcZC5llZ1Ellm3q7aA/840GN3cvaQsVH5vL5dUCoWR1v2h7VpQ\nue8bMC1gjwa080W8op7IMC7ePHhUh2ab69vOBWv+a9e3arkA6KZKqyLsaLVT6m/n\nqYmxj2TXak27oOsK9Hxblys9481Y3l0G17CGr9thvnWQ/X2xkOSdLQ3j+Pm/s+Km\n6kwt45EfwUTHL30azvFuY2r3AXFI3awG5B7o/3L+aIkCgYEA5JIeBNRpHJ6PMek6\nSDBzmmSBgk8Jgw5YSM0k1EtEhD7qaMg1+mlQ2CYYXFkFoYNQ24u/2LfsuZIEpeL9\nDhAD5/B+VWmmOFK6n2ZEm5NElWyic+rvdDITU9W2ECF33NEskUtRAGlieRjDg26v\nscZzX53H9XqNf+4j4v0jwZ12SuUCgYEA1jelAIcHE4LlQ5dvHeGgIbtu/wE/MmD7\nm35+A2ZTTVk1ewXkAS58dR1JQHdrNp1Iv5hqzNBXyfPrEPhi1JzleiJ55t1w/tTK\nvaCQzbIX0Zhjy+w7LnkfTzrgPHVOO8+Pa8amkOsADRgYuE/2JPXTedXVWpjFGXA/\nvIkCB5fwqFsCgYEA3rfuHkCnZ2atGzIqQztK+c8jTska+KParJ2QXHg2/DGeEZm8\n1xMV3nhIVnu7++RLvpHOzypwtWWtt8KVV8WNOMzjHPEEMW+TP0zUX0/BjWQ8a30p\n9Gvy30anz9H8zKLZrX3ZIPCPLnZN1FzfP/eiZjIFLJJNHLH8L+r/k2KOaG0CgYA/\nB4JaJGC1ofb5K057eU6XfkHLcD97AEQn3VEQiQQLpyrwNqx+mIHwJ5zNBhYarK6i\nCSOrfcXG2ykYBi12J2/xvsElZ5R+tnes0dipXTRa7D642poTM3o94rHluBI70Pd/\nG6UY0LxkHenwGT7wYxBFMeCj1n1v3bIzNBDP0SnzLwKBgF5uqqawvZpvdvKszxzg\nI7lyRsctc/TWdPqh1QNBHjU3gqWqVBQP/WYPxrFj/x2Xbyw0cO8s7jtxLLx7QWnG\n2FSbrnsmLU/17YtFzDzzHQLJR2a7RfUT/5cJU3IdJ0HRqqShEYuC8pY2NLsDs/Ly\nlBKfrr464JAX9v0oj4pIWgR6\n-----END PRIVATE KEY-----\n"
      },
      {
        name: "canvas-unicon-bitnami",
        client_id: "10000000000004",
        iss: "https://canvas.instructure.com",
        platformOIDCAuthEndPoint: "https://cbb1ac38bfb4.ngrok.io/api/lti/authorize_redirect",
        platformAccessTokenEndpoint: "https://cbb1ac38bfb4.ngrok.io/login/oauth2/token",
        alg: "RS256",
        keyid: "ASU ETX - Ring Leader - james-stanley  - Public Key",
        public_key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv0PTzyKB/KiGfJR3oo2Z\nXnVRCBRag7PA4ARCZ5CZMSFuyMtJXZdQKiibTezlFD976lJQZsNTbmXoxEKzho7w\nS5+XEYXtUWhgDmVZ46RPpheay+HUzCikDMIKavOpp7+ri7bIOej9RNjsJ5VzrFI1\nIqLZWT4CyJ/ePzaKRUydpLcvO1mi4gGRblCpB2jm/laUUtAG5yXMpkutMowx1uJr\nLKHjZ8r8bjWw4mqyhbJcx0UKehIc/7yMoeyZpRYtoux0aOPRpL+l8b1uOuVhuLvA\nHl60wuhXrCNHzl39oAyI1+O2vS7t0PTnUZkYyLxQeh5Ca+ja/zj6kFAENgB+4+Ln\nZwIDAQAB\n-----END PUBLIC KEY-----\n",
        public_key_jwk: {
          kty: "RSA",
          n: "v0PTzyKB_KiGfJR3oo2ZXnVRCBRag7PA4ARCZ5CZMSFuyMtJXZdQKiibTezlFD976lJQZsNTbmXoxEKzho7wS5-XEYXtUWhgDmVZ46RPpheay-HUzCikDMIKavOpp7-ri7bIOej9RNjsJ5VzrFI1IqLZWT4CyJ_ePzaKRUydpLcvO1mi4gGRblCpB2jm_laUUtAG5yXMpkutMowx1uJrLKHjZ8r8bjWw4mqyhbJcx0UKehIc_7yMoeyZpRYtoux0aOPRpL-l8b1uOuVhuLvAHl60wuhXrCNHzl39oAyI1-O2vS7t0PTnUZkYyLxQeh5Ca-ja_zj6kFAENgB-4-LnZw",
          e: "AQAB",
          alg: "RS256",
          use: "sig",
          kid: "ASU ETX - Ring Leader - james-stanley  - Public Key"
        },
  
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/Q9PPIoH8qIZ8\nlHeijZledVEIFFqDs8DgBEJnkJkxIW7Iy0ldl1AqKJtN7OUUP3vqUlBmw1NuZejE\nQrOGjvBLn5cRhe1RaGAOZVnjpE+mF5rL4dTMKKQMwgpq86mnv6uLtsg56P1E2Own\nlXOsUjUiotlZPgLIn94/NopFTJ2kty87WaLiAZFuUKkHaOb+VpRS0AbnJcymS60y\njDHW4mssoeNnyvxuNbDiarKFslzHRQp6Ehz/vIyh7JmlFi2i7HRo49Gkv6XxvW46\n5WG4u8AeXrTC6FesI0fOXf2gDIjX47a9Lu3Q9OdRmRjIvFB6HkJr6Nr/OPqQUAQ2\nAH7j4udnAgMBAAECggEBAImN4V395lhsZ1Rffm7kwWGCpAVYhgRkGZnC1nMfNl10\nOvWj5h6uPRQk4hS4A8R9J8RM8NAHOBCUsEO96NkkIcNxgjczB4tdsn+H+o7SVAoS\nvdxVjTJLJDicsNtcZC5llZ1Ellm3q7aA/840GN3cvaQsVH5vL5dUCoWR1v2h7VpQ\nue8bMC1gjwa080W8op7IMC7ePHhUh2ab69vOBWv+a9e3arkA6KZKqyLsaLVT6m/n\nqYmxj2TXak27oOsK9Hxblys9481Y3l0G17CGr9thvnWQ/X2xkOSdLQ3j+Pm/s+Km\n6kwt45EfwUTHL30azvFuY2r3AXFI3awG5B7o/3L+aIkCgYEA5JIeBNRpHJ6PMek6\nSDBzmmSBgk8Jgw5YSM0k1EtEhD7qaMg1+mlQ2CYYXFkFoYNQ24u/2LfsuZIEpeL9\nDhAD5/B+VWmmOFK6n2ZEm5NElWyic+rvdDITU9W2ECF33NEskUtRAGlieRjDg26v\nscZzX53H9XqNf+4j4v0jwZ12SuUCgYEA1jelAIcHE4LlQ5dvHeGgIbtu/wE/MmD7\nm35+A2ZTTVk1ewXkAS58dR1JQHdrNp1Iv5hqzNBXyfPrEPhi1JzleiJ55t1w/tTK\nvaCQzbIX0Zhjy+w7LnkfTzrgPHVOO8+Pa8amkOsADRgYuE/2JPXTedXVWpjFGXA/\nvIkCB5fwqFsCgYEA3rfuHkCnZ2atGzIqQztK+c8jTska+KParJ2QXHg2/DGeEZm8\n1xMV3nhIVnu7++RLvpHOzypwtWWtt8KVV8WNOMzjHPEEMW+TP0zUX0/BjWQ8a30p\n9Gvy30anz9H8zKLZrX3ZIPCPLnZN1FzfP/eiZjIFLJJNHLH8L+r/k2KOaG0CgYA/\nB4JaJGC1ofb5K057eU6XfkHLcD97AEQn3VEQiQQLpyrwNqx+mIHwJ5zNBhYarK6i\nCSOrfcXG2ykYBi12J2/xvsElZ5R+tnes0dipXTRa7D642poTM3o94rHluBI70Pd/\nG6UY0LxkHenwGT7wYxBFMeCj1n1v3bIzNBDP0SnzLwKBgF5uqqawvZpvdvKszxzg\nI7lyRsctc/TWdPqh1QNBHjU3gqWqVBQP/WYPxrFj/x2Xbyw0cO8s7jtxLLx7QWnG\n2FSbrnsmLU/17YtFzDzzHQLJR2a7RfUT/5cJU3IdJ0HRqqShEYuC8pY2NLsDs/Ly\nlBKfrr464JAX9v0oj4pIWgR6\n-----END PRIVATE KEY-----\n"
      },
      {
        name: "canvas-local-docker",
        client_id: "10000000000034",
        iss: "https://canvas.instructure.com",
        platformOIDCAuthEndPoint: "https://localhost:3000/api/lti/authorize_redirect",
        platformAccessTokenEndpoint: "https://localhost:3000/login/oauth2/token",
        alg: "RS256",
        keyid: "ASU ETX - Ring Leader - james-stanley  - Public Key",
        public_key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv0PTzyKB/KiGfJR3oo2Z\nXnVRCBRag7PA4ARCZ5CZMSFuyMtJXZdQKiibTezlFD976lJQZsNTbmXoxEKzho7w\nS5+XEYXtUWhgDmVZ46RPpheay+HUzCikDMIKavOpp7+ri7bIOej9RNjsJ5VzrFI1\nIqLZWT4CyJ/ePzaKRUydpLcvO1mi4gGRblCpB2jm/laUUtAG5yXMpkutMowx1uJr\nLKHjZ8r8bjWw4mqyhbJcx0UKehIc/7yMoeyZpRYtoux0aOPRpL+l8b1uOuVhuLvA\nHl60wuhXrCNHzl39oAyI1+O2vS7t0PTnUZkYyLxQeh5Ca+ja/zj6kFAENgB+4+Ln\nZwIDAQAB\n-----END PUBLIC KEY-----\n",
        public_key_jwk: {
          kty: "RSA",
          n: "v0PTzyKB_KiGfJR3oo2ZXnVRCBRag7PA4ARCZ5CZMSFuyMtJXZdQKiibTezlFD976lJQZsNTbmXoxEKzho7wS5-XEYXtUWhgDmVZ46RPpheay-HUzCikDMIKavOpp7-ri7bIOej9RNjsJ5VzrFI1IqLZWT4CyJ_ePzaKRUydpLcvO1mi4gGRblCpB2jm_laUUtAG5yXMpkutMowx1uJrLKHjZ8r8bjWw4mqyhbJcx0UKehIc_7yMoeyZpRYtoux0aOPRpL-l8b1uOuVhuLvAHl60wuhXrCNHzl39oAyI1-O2vS7t0PTnUZkYyLxQeh5Ca-ja_zj6kFAENgB-4-LnZw",
          e: "AQAB",
          alg: "RS256",
          use: "sig",
          kid: "ASU ETX - Ring Leader - james-stanley  - Public Key"
        },
  
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/Q9PPIoH8qIZ8\nlHeijZledVEIFFqDs8DgBEJnkJkxIW7Iy0ldl1AqKJtN7OUUP3vqUlBmw1NuZejE\nQrOGjvBLn5cRhe1RaGAOZVnjpE+mF5rL4dTMKKQMwgpq86mnv6uLtsg56P1E2Own\nlXOsUjUiotlZPgLIn94/NopFTJ2kty87WaLiAZFuUKkHaOb+VpRS0AbnJcymS60y\njDHW4mssoeNnyvxuNbDiarKFslzHRQp6Ehz/vIyh7JmlFi2i7HRo49Gkv6XxvW46\n5WG4u8AeXrTC6FesI0fOXf2gDIjX47a9Lu3Q9OdRmRjIvFB6HkJr6Nr/OPqQUAQ2\nAH7j4udnAgMBAAECggEBAImN4V395lhsZ1Rffm7kwWGCpAVYhgRkGZnC1nMfNl10\nOvWj5h6uPRQk4hS4A8R9J8RM8NAHOBCUsEO96NkkIcNxgjczB4tdsn+H+o7SVAoS\nvdxVjTJLJDicsNtcZC5llZ1Ellm3q7aA/840GN3cvaQsVH5vL5dUCoWR1v2h7VpQ\nue8bMC1gjwa080W8op7IMC7ePHhUh2ab69vOBWv+a9e3arkA6KZKqyLsaLVT6m/n\nqYmxj2TXak27oOsK9Hxblys9481Y3l0G17CGr9thvnWQ/X2xkOSdLQ3j+Pm/s+Km\n6kwt45EfwUTHL30azvFuY2r3AXFI3awG5B7o/3L+aIkCgYEA5JIeBNRpHJ6PMek6\nSDBzmmSBgk8Jgw5YSM0k1EtEhD7qaMg1+mlQ2CYYXFkFoYNQ24u/2LfsuZIEpeL9\nDhAD5/B+VWmmOFK6n2ZEm5NElWyic+rvdDITU9W2ECF33NEskUtRAGlieRjDg26v\nscZzX53H9XqNf+4j4v0jwZ12SuUCgYEA1jelAIcHE4LlQ5dvHeGgIbtu/wE/MmD7\nm35+A2ZTTVk1ewXkAS58dR1JQHdrNp1Iv5hqzNBXyfPrEPhi1JzleiJ55t1w/tTK\nvaCQzbIX0Zhjy+w7LnkfTzrgPHVOO8+Pa8amkOsADRgYuE/2JPXTedXVWpjFGXA/\nvIkCB5fwqFsCgYEA3rfuHkCnZ2atGzIqQztK+c8jTska+KParJ2QXHg2/DGeEZm8\n1xMV3nhIVnu7++RLvpHOzypwtWWtt8KVV8WNOMzjHPEEMW+TP0zUX0/BjWQ8a30p\n9Gvy30anz9H8zKLZrX3ZIPCPLnZN1FzfP/eiZjIFLJJNHLH8L+r/k2KOaG0CgYA/\nB4JaJGC1ofb5K057eU6XfkHLcD97AEQn3VEQiQQLpyrwNqx+mIHwJ5zNBhYarK6i\nCSOrfcXG2ykYBi12J2/xvsElZ5R+tnes0dipXTRa7D642poTM3o94rHluBI70Pd/\nG6UY0LxkHenwGT7wYxBFMeCj1n1v3bIzNBDP0SnzLwKBgF5uqqawvZpvdvKszxzg\nI7lyRsctc/TWdPqh1QNBHjU3gqWqVBQP/WYPxrFj/x2Xbyw0cO8s7jtxLLx7QWnG\n2FSbrnsmLU/17YtFzDzzHQLJR2a7RfUT/5cJU3IdJ0HRqqShEYuC8pY2NLsDs/Ly\nlBKfrr464JAX9v0oj4pIWgR6\n-----END PRIVATE KEY-----\n"
      },
      {
        name: "canvas-lms-docker",
        client_id: "10000000000001",
        iss: "https://canvas.instructure.com",
        platformOIDCAuthEndPoint: "http://canvas.docker/api/lti/authorize_redirect",
        platformAccessTokenEndpoint: "http://canvas.docker/login/oauth2/token",
        alg: "RS256",
        keyid: "ASU ETX - Ring Leader - james-stanley  - Public Key",
        public_key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv0PTzyKB/KiGfJR3oo2Z\nXnVRCBRag7PA4ARCZ5CZMSFuyMtJXZdQKiibTezlFD976lJQZsNTbmXoxEKzho7w\nS5+XEYXtUWhgDmVZ46RPpheay+HUzCikDMIKavOpp7+ri7bIOej9RNjsJ5VzrFI1\nIqLZWT4CyJ/ePzaKRUydpLcvO1mi4gGRblCpB2jm/laUUtAG5yXMpkutMowx1uJr\nLKHjZ8r8bjWw4mqyhbJcx0UKehIc/7yMoeyZpRYtoux0aOPRpL+l8b1uOuVhuLvA\nHl60wuhXrCNHzl39oAyI1+O2vS7t0PTnUZkYyLxQeh5Ca+ja/zj6kFAENgB+4+Ln\nZwIDAQAB\n-----END PUBLIC KEY-----\n",
        public_key_jwk: {
          kty: "RSA",
          n: "v0PTzyKB_KiGfJR3oo2ZXnVRCBRag7PA4ARCZ5CZMSFuyMtJXZdQKiibTezlFD976lJQZsNTbmXoxEKzho7wS5-XEYXtUWhgDmVZ46RPpheay-HUzCikDMIKavOpp7-ri7bIOej9RNjsJ5VzrFI1IqLZWT4CyJ_ePzaKRUydpLcvO1mi4gGRblCpB2jm_laUUtAG5yXMpkutMowx1uJrLKHjZ8r8bjWw4mqyhbJcx0UKehIc_7yMoeyZpRYtoux0aOPRpL-l8b1uOuVhuLvAHl60wuhXrCNHzl39oAyI1-O2vS7t0PTnUZkYyLxQeh5Ca-ja_zj6kFAENgB-4-LnZw",
          e: "AQAB",
          alg: "RS256",
          use: "sig",
          kid: "ASU ETX - Ring Leader - james-stanley  - Public Key"
        },
  
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/Q9PPIoH8qIZ8\nlHeijZledVEIFFqDs8DgBEJnkJkxIW7Iy0ldl1AqKJtN7OUUP3vqUlBmw1NuZejE\nQrOGjvBLn5cRhe1RaGAOZVnjpE+mF5rL4dTMKKQMwgpq86mnv6uLtsg56P1E2Own\nlXOsUjUiotlZPgLIn94/NopFTJ2kty87WaLiAZFuUKkHaOb+VpRS0AbnJcymS60y\njDHW4mssoeNnyvxuNbDiarKFslzHRQp6Ehz/vIyh7JmlFi2i7HRo49Gkv6XxvW46\n5WG4u8AeXrTC6FesI0fOXf2gDIjX47a9Lu3Q9OdRmRjIvFB6HkJr6Nr/OPqQUAQ2\nAH7j4udnAgMBAAECggEBAImN4V395lhsZ1Rffm7kwWGCpAVYhgRkGZnC1nMfNl10\nOvWj5h6uPRQk4hS4A8R9J8RM8NAHOBCUsEO96NkkIcNxgjczB4tdsn+H+o7SVAoS\nvdxVjTJLJDicsNtcZC5llZ1Ellm3q7aA/840GN3cvaQsVH5vL5dUCoWR1v2h7VpQ\nue8bMC1gjwa080W8op7IMC7ePHhUh2ab69vOBWv+a9e3arkA6KZKqyLsaLVT6m/n\nqYmxj2TXak27oOsK9Hxblys9481Y3l0G17CGr9thvnWQ/X2xkOSdLQ3j+Pm/s+Km\n6kwt45EfwUTHL30azvFuY2r3AXFI3awG5B7o/3L+aIkCgYEA5JIeBNRpHJ6PMek6\nSDBzmmSBgk8Jgw5YSM0k1EtEhD7qaMg1+mlQ2CYYXFkFoYNQ24u/2LfsuZIEpeL9\nDhAD5/B+VWmmOFK6n2ZEm5NElWyic+rvdDITU9W2ECF33NEskUtRAGlieRjDg26v\nscZzX53H9XqNf+4j4v0jwZ12SuUCgYEA1jelAIcHE4LlQ5dvHeGgIbtu/wE/MmD7\nm35+A2ZTTVk1ewXkAS58dR1JQHdrNp1Iv5hqzNBXyfPrEPhi1JzleiJ55t1w/tTK\nvaCQzbIX0Zhjy+w7LnkfTzrgPHVOO8+Pa8amkOsADRgYuE/2JPXTedXVWpjFGXA/\nvIkCB5fwqFsCgYEA3rfuHkCnZ2atGzIqQztK+c8jTska+KParJ2QXHg2/DGeEZm8\n1xMV3nhIVnu7++RLvpHOzypwtWWtt8KVV8WNOMzjHPEEMW+TP0zUX0/BjWQ8a30p\n9Gvy30anz9H8zKLZrX3ZIPCPLnZN1FzfP/eiZjIFLJJNHLH8L+r/k2KOaG0CgYA/\nB4JaJGC1ofb5K057eU6XfkHLcD97AEQn3VEQiQQLpyrwNqx+mIHwJ5zNBhYarK6i\nCSOrfcXG2ykYBi12J2/xvsElZ5R+tnes0dipXTRa7D642poTM3o94rHluBI70Pd/\nG6UY0LxkHenwGT7wYxBFMeCj1n1v3bIzNBDP0SnzLwKBgF5uqqawvZpvdvKszxzg\nI7lyRsctc/TWdPqh1QNBHjU3gqWqVBQP/WYPxrFj/x2Xbyw0cO8s7jtxLLx7QWnG\n2FSbrnsmLU/17YtFzDzzHQLJR2a7RfUT/5cJU3IdJ0HRqqShEYuC8pY2NLsDs/Ly\nlBKfrr464JAX9v0oj4pIWgR6\n-----END PRIVATE KEY-----\n"
      }
    ],
    HEROKU_APP_NAME: "ring-leader-james-stanley",
    APPLICATION_URL: "https://localhost:3001",
    PORT: "8080"
  };

*/
console.log(`environmental variables:${JSON.stringify(ENV_VARS)}`);

// heroku
const ENV_VARS = process.env;

export const PORT: number = parseInt(ENV_VARS.PORT ? ENV_VARS.PORT : "8080");

// this is set by the yarn run heroku-update-configs script
export const APPLICATION_URL: string = ENV_VARS.APPLICATION_URL || "";

export const USER_INTERFACE_ROOT: string = path.join(
  __dirname,
  "/../../rl-tool-example-client/build"
);
console.log("ENV_VARS.TOOL_CONSUMERS-" + ENV_VARS.TOOL_CONSUMERS);
/*
export const TOOL_CONSUMERS: ToolConsumer[] = (JSON.parse(
  ENV_VARS.TOOL_CONSUMERS?.replace(/\\"/g, '"') || "[]"
) as unknown) as ToolConsumer[];
*/

export const TOOL_CONSUMERS: ToolConsumer[] = ENV_VARS.TOOL_CONSUMERS as unknown as ToolConsumer[];