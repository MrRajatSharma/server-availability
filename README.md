# server-availability

Requirements:
1. Node Module with a `findServer()` function which should return a Promise that either:
  * Resolves with the online server that has the lowest priority number.
  * Rejects with an error, if no Servers are online.
2. HTTP GET requests should be used to determine if a server is online or offline additionally the
following is required:
  * All GET requests should be done simultaneously.
  * A GET request should timeout after 5 seconds.
  * A server should be considered online if it’s response status code is between 200
and 299.

3. Unit Tests are required to sufficiently test all components of your module. Additionally,
the following is required for unit tests:
  * All server interaction should be mocked.
  
## setup
1. run `yarn install` 
2. run `npm start` 
3. run test `npm run test` and check console for output
4. run test coverage `npm run test:coverage`

Server handling code is inside [Code](https://github.com/MrRajatSharma/server-availability/blob/master/src/server/index.js)
