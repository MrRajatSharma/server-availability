const { expect, use, assert } = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const nock = require("nock");

use(sinonChai);
use(require("chai-sorted"));

const ServerController = require('../../src/server/');

describe('Server', () => {
	const sandbox = sinon.createSandbox();
	let props;
	let serverController;

	// runs before every runnable instance
	beforeEach(() => {
		// initialize
		serverController = new ServerController(props);
	});

	afterEach(() => {
		// restores all stub created through sandbox
		sandbox.restore();                  
	});

	describe('#findServer', () => {
		beforeEach(() => {
			nock('https://www.abc.com')
			.get('/')
			.reply(200);

			nock('https://www.google.com')
			.get('/')
			.reply(200);

			nock('https://www.google2.com')
			.get('/')
			.replyWithError('something awful happened');
		});
		

    it('should return 2 results in an object', async () => {
      const expectedParam = ['https://www.google.com', 'https://www.abc.com', 'https://www.google2.com'];

			serverController.findServer(expectedParam)
				.then(res => {
					console.log(res)
					expect(typeof res).to.equal('object');
					// expect(responses.length).to.equal(2);
				}).catch(ex => {

				})
		});


    it('should reject when no server is available', async () => {
      const expectedParam = ['https://www.google2.com'];

			serverController.findServer(expectedParam)
				.then(res => {
					
				}).catch(ex => {
					assert.instanceOf(ex, Error)
				})
		});
	});


	describe('#requestServers', () => {

		beforeEach(() => {
			nock('https://www.abc.com')
			.get('/')
			.reply(200);

			nock('https://www.google.com')
			.get('/')
			.reply(200);

			nock('https://www.google2.com')
			.get('/')
			.replyWithError('something awful happened');
		});
		
    it('should return 2 results in an object', async () => {
      const expectedParam = ['https://www.google.com', 'https://www.abc.com', 'https://www.google2.com'];

			const responses = await serverController.requestServers(expectedParam);

			expect(typeof responses).to.equal('object');
			expect(responses.length).to.equal(2);
		});

		it('should return 0 response', async () => {
			const expectedParam = ['https://www.google2.com'];
			const responses = await serverController.requestServers(expectedParam);
			expect(responses.length).to.equal(0);
		});
	});
	
	describe('#createRequest', () => {
		beforeEach(() => {
			nock('https://www.google.com')
			.get('/')
			.reply(200);

			nock('https://www.google2.com')
			.get('/')
			.replyWithError('something awful happened');
		});
		

    it('should return statusCode, elapsedTime, and url when request is resolved', async () => {
      const expectedParam = 'https://www.google.com';

			const response = await serverController.createRequest(expectedParam);
			
			expect(typeof response).to.equal('object');
			expect(typeof response.elapsedTime).to.equal('number');
			expect(typeof response.statusCode).to.equal('number');
			expect(typeof response.url).to.equal('string');
			expect(response.url).to.equal(expectedParam);
		});

		it('should reject when request fails', async () => {
			const expectedParam = 'https://www.google2.com';
			try {
				const response = await serverController.createRequest(expectedParam);
			} catch (ex) {
				expect(ex.message).to.equal('something awful happened');
			}
		});
	});

	describe('#allServersOffline', () => {
    it('should return false when even one server is online', async () => {
      const expectedParam = [{ 
				elapsedTime: 59,
				statusCode: 200,
				url: 'http://boldtech.co/' 
			}, { 
				elapsedTime: 460,
				statusCode: 400,
				url: 'https://www.google.com' 
			}];

			const result = serverController.allServersOffline(expectedParam);

			expect(result).to.be.equal(false);
		});
		
		it('should return true when none of the server is online', async () => {
      const expectedParam = [{ 
				elapsedTime: 59,
				statusCode: 300,
				url: 'http://boldtech.co/' 
			}, { 
				elapsedTime: 460,
				statusCode: 400,
				url: 'https://www.google.com' 
			}];

			const result = serverController.allServersOffline(expectedParam);

			expect(result).to.be.equal(true);
    });
	});


	describe('#setPriority', () => {
    it('should return result in descending order', async () => {
      const expectedParam = [{ 
				elapsedTime: 59,
				statusCode: 200,
				url: 'http://boldtech.co/' 
			}, { 
				elapsedTime: 460,
				statusCode: 200,
				url: 'https://www.google.com' 
			}];

			const expectedResult = [{ 
				priority: 1,
				url: 'https://www.google.com' 
			}, { 
				priority: 2,
				url: 'http://boldtech.co/' 
			}];

			const result = serverController.setPriority(expectedParam);

			expect(result).to.deep.equal(expectedResult);
    });
	});

	describe('#sortByElapsedTime', () => {
    it('should return result in descending order', async () => {
      const expectedParam = [{ 
				elapsedTime: 59,
				statusCode: 200,
				url: 'http://boldtech.co/' 
			}, { 
				elapsedTime: 460,
				statusCode: 200,
				url: 'https://www.google.com' 
			}];

			const result = serverController.sortByElapsedTime(expectedParam);
			
			expect(result).to.be.sortedBy("elapsedTime", {descending: true});
    });
  });
});
