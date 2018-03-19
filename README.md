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
npm install --save loggr.js
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

// Exprected result example:
// [mm/dd/yyyy @ hh:mm:ss:fff a] - value of data variable

// Normal, pass in a destination WriteStream.
loggr.log(accessLog, data);

// JSON
loggr.log(accessLog, data, 'json');

// Pretty printed JSON
loggr.log(accessLog, data, 'pretty');

// Have loggr.js create the log.
loggr.create('error');

loggr.err('error', data);

// Have loggr.js recolor a log.
loggr.recolor.alert('\x1b[42m');

loggr.alert(data); // Should output a message with the severity notice using a
                   // green background to the console.
```

## loggr.js API

Styling the console messages, potentially based on message severity, is possible using different logging helper functions.

| Function                                        | Severity          | Style (BG/FG or FG) | Description                                                             |
| ----------------------------------------------- | ----------------- | ------------------- | ----------------------------------------------------------------------- |
| `loggr.emerg(data);`                            | Emergency (0)     | Red/White           | Process is unstable.                                                    |
| `loggr.alert(data);`                            | Alert (1)         | Blue/White          | Must take action immediately.                                           |
| `loggr.crit(data);`                             | Critical (2)      | Yellow              | Process is in critical condition.                                       |
| `loggr.err(data);`                              | Error (3)         | Red                 | An error has occurred with process.                                     |
| `loggr.warning(data);`                          | Warning (4)       | Yellow/Black        | An unexpected condition occurred with process.                          |
| `loggr.notice(data);`                           | Notice (5)        | White               | Other normal condition occurred with process.                           |
| `loggr.info(data);`                             | Informational (6) | Cyan                | An informational message.                                               |
| `loggr.debug(data);`                            | Debug (7)         | Green/Black         | Messages used for debugging.                                            |
| `loggr.log(data);`                              | Default (8)       | Default             | Just a normal message.                                                  |
| `loggr.create(data);`                           | N/A               | N/A                 | Creates 'data' log for future use.                                      |
| `loggr.recolor.severity(data);`                 | N/A               | N/A                 | Changes the color for the 'severity' notice for a non-default log type. |


> **Note:** With `loggr.recolor.severity` you need to change "severity" to the function name for the serverity type of log. For example, "Error" would be `loggr.recolor.err()`.

## Roadmap

These are future capabilites that we intend to add.

**In Progress**

- Allow for different timestamp formats.

**Untouched**

- **Timing**
  - Speed up logging.

## Credits

loggr.js was inspired by the `console.log();` functionality with the intention of adding a precise timestamp and preserving the logs for future reference. Rather than just logging to the console users should be able to log to any WriteStream they provide for enhancing their workflow such as an `access.log`, a `transaction.log`, a `download.log`, etc. Allowing users to easily log data to WriteStreams that make sense for their workflow. Another goal of the project is to help provide a mostly standardized approach to logging so that the logs can be easily consumed and parsed to find specific details. As with all things the final goal of the project is to help users save time so that they will "have more time" to allocate toward whatever they want.

## License

MIT