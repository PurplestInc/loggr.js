# loggr.js
A simple logging utility.

#### Table of Contents

[Usage](#usage)  
[Installing](#installing)  
[Example](#example)  
[loggr.js API](#loggrjs-api)  
[Roadmap](#roadmap)  
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
const loggr = require('loggr.js');
const accessLog = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

... // Your code with an variable "data" that has some value.

// Default, will log to an event.log file.
loggr.log(data);

// Normal, pass in a destination WriteStream.
loggr.log(accessLog, data);

// JSON
loggr.log(accessLog, data, 'json');

// Pretty printed JSON
loggr.log(accessLog, data, 'pretty');
```

## loggr.js API

Styling the console messages, potentially based on message severity, is possible using different logging helper functions.

| Function                                        | Severity          | Style (BG/FG or FG) | Description                                    |
| ----------------------------------------------- | ----------------- | ------------------- | ---------------------------------------------- |
| `loggr.emerg(data);`                            | Emergency (0)     | Red/White           | Process is unstable.                           |
| `loggr.alert(data);`                            | Alert (1)         | Blue/White          | Must take action immediately.                  |
| `loggr.crit(data);`                             | Critical (2)      | Yellow              | Process is in critical condition.              |
| `loggr.err(data);`                              | Error (3)         | Red                 | An error has occurred with process.            |
| `loggr.warning(data);`                          | Warning (4)       | Yellow/Black        | An unexpected condition occurred with process. |
| `loggr.notice(data);`                           | Notice (5)        | White               | Other normal condition occurred with process.  |
| `loggr.info(data);`                             | Informational (6) | Cyan                | An informational message.                      |
| `loggr.debug(data);`                            | Debug (7)         | Green/Black         | Messages used for debugging.                   |
| `loggr.log(data);`                              | Default (8)       | Default             | Just a normal message.                         |


> **Note:** Next minor revision will allow for choosing your own color combination for the styled console messages.

## Roadmap

These are future capabilites that we intend to add.

**In Progress**

- Allow users to choose color combination for the styled console messages.

**Untouched**

- **Logging**
  - Add separate logs for severity of messages by default and have the logger log messages to them as well as any specified log by default.
- **Timing**
  - Speed up logging.
  - Allow for different timestamp formats.

## Credits

loggr.js was inspired by the `console.log();` functionality with the intention of adding a precise timestamp and preserving the logs for future reference. Rather than just logging to the console users should be able to log to any WriteStream they provide for enhancing their workflow such as an `access.log`, a `transaction.log`, a `download.log`, etc. Allowing users to easily log data to WriteStreams that make sense for their workflow.

## License

MIT