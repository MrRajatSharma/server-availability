const Server = require('./server');

const server = new Server();
server
	.findServer(['https://www.google.com', 'https://www.abc.com', 'https://www.google2.com'])
	.then(res => {
		console.log(res);
	})
	.catch((ex) => {
		console.error(ex);
	});