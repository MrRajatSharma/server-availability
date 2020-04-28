const request = require('request');

class Server {
  createRequest(uri) {
    return new Promise((resolve, reject) => {
      request.get({
        uri,
        time: true,              // using for setting priority. lesser the elapsed time more the priority
        timeout: 5000             // connection timeout
      }, (err, response) => {
        if (err) {
          return reject(err);
        }
        // console.log(response);
        resolve({ elapsedTime: response.elapsedTime, statusCode: response.statusCode, url: uri });
      });
    })
  }

  /**
   * returns true if when all servers are offline
   * @param  {} responses
   */
  allServersOffline(responses) {
    const onlineServers = responses.filter((response => (response.statusCode >= 200 && response.statusCode <= 299)));
    return onlineServers.length == 0;
  }

  async requestServers(uris) {
    const requestPromises = uris.map(uri => this.createRequest(uri))
    const promiseResponses = await Promise.all(requestPromises.map(p => p.catch(e => e)));
    return promiseResponses.filter(p => p && !(p instanceof Error));
  }

  // returns a promise
  // a. Resolves with the online server that has the lowest priority number.
  // b. Rejects with an error, if no Servers are online.
  findServer(urls) {
    return new Promise(async (resolve, reject) => {
      // make HTTP GET request to determine servers are online

      const responses = await this.requestServers(urls);

      if (this.allServersOffline(responses)) {
        // is none of the server are online
        reject(new Error("No server online"));
      } else {
        // resolve with lowest priority server
        const result = this.setPriority(responses);
        resolve(result[0]);
      }
    });
  }
  /**
   * sets priority based on time elapsed for an request. more the time less the priority
   * @param  {} responses
   */
  setPriority(responses) {
    const sortedByElapsedTime = this.sortByElapsedTime(responses);
    return sortedByElapsedTime.map((resp, idx) => {
      return {
        priority: idx + 1,
        url: resp.url
      }
    })
  }

  /**
   * sorts responses by descending 
   * @param  {} responses
   */
  sortByElapsedTime(responses) {
    return responses.sort((a, b) => b.elapsedTime - a.elapsedTime);
  }
}

module.exports = Server;
