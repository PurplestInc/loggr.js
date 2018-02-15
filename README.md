# loggr.js
A simple logging utility.

## Installing
```javascript
npm install loggr.js
```

## Usage

Used to log data to a write stream while also logging it to the console so that you can review now, and later.

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
