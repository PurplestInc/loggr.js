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
const accessLog = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Normal
log(accessLog, data);

// JSON
log(accessLog, data, 'json');

// Pretty printed JSON
log(accessLog, data, 'pretty');
```
