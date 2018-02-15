# loggr.js
A simple logging utility.

#### Table of Contents

[Usage](#usage)  
[Installing](#installing)  
[Example](#example)  
[Credits](#credits)  
[License](#license)  

## Usage

Used to log data to a write stream while also logging it to the console so that you can review now, and later.

## Installing
```javascript
npm install loggr.js
```

## Example
```javascript
const fs = require('fs');
const path = require('path');
const loggr = require('loggr');
const accessLog = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Default, will log to an event.log file.
loggr.log(data);

// Normal, pass in a destination WriteStream.
loggr.log(accessLog, data);

// JSON
loggr.log(accessLog, data, 'json');

// Pretty printed JSON
loggr.log(accessLog, data, 'pretty');
```

## Credits

loggr.js was inspired by the `console.log();` functionality with the intention of adding a precise timestamp and preserving the logs for future reference. Rather than just logging to the console users should be able to log to any WriteStream they provide for enhancing their workflow such as an 'access.log', a 'transaction.log', a 'download.log', etc. Allowing users to easily log data to WriteStreams that make sense for their workflow.

## License

MIT