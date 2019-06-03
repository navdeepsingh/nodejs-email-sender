const querystring = require('querystring');
const https = require('https');
const config = require('./config');

const handlers = {};

handlers.send = (data, callback) => {
  const email = "navdeep.singh@falcon-agency.com";
  const mailgunDomainName = process.env.mailgunDomainName ? process.env.mailgunDomainName : config.mailgun.domainName;
  const mailgunApiKey = process.env.mailgunApiKey ? process.env.mailgunApiKey : config.mailgun.apiKey;
  // Create the order object and include in user's phone
  const emailPostData = {
    'from': 'Excited User <navdeep@sandboxb18d39ab865e42a0a0d81022e5de121d.mailgun.org>',
    'to': email,
    'subject': 'Transaction Email [Mailgun]',
    'html': `Hello ${email},<br><br>
              Please find this receipt link for recent transaction via stripe API.<br> 
              Receipt link: <br><br>Thanks,<br>Nodejs Developer`
  }

  // Need to serialize to send in post request
  const stringEmailPostData = querystring.stringify(emailPostData);

  // An object of options to indicate where to post to
  const postOptions = {
    "method": "POST",
    'protocol': "https:",
    "hostname": 'api.mailgun.net',
    "path": '/v3/' + mailgunDomainName + '/messages',
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(mailgunApiKey).toString('base64')
    }
  };

  // Instantiate the request object
  var req = https.request(postOptions, function (res) {
    // Grab the status of the sent request
    const status = res.statusCode;
    console.log(status);

    // Callback successfully if the request went through
    if ([200, 201].indexOf(status) == -1) {
      callback(status, { 'Error': 'Status code returned was ' + status });
    }
    // Returning 301
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log('response end: ', body.toString());
      callback(status, { 'Response': JSON.parse(body.toString()) });
    });
  });

  req.on('error', function (e) {
    callback(400, { 'Error': e });
  });

  // write data to request body
  req.write(stringEmailPostData);
  req.end();
}

handlers.notFound = (data, callback) => {
  callback(404);
}

module.exports = handlers;