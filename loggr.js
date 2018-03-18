/**
 * @fileoverview loggr.js a simple logging utility.
 * @author Rob Dukarski <rob@purplest.com>
 * @copyright 2018 Purplest, Inc.
 * @version 1.1.2
 * @exports loggr
 */

module.exports = function () {
  'use strict';

  const fs = require('fs');
  const path = require('path');
  const eventLog = fs.createWriteStream(path.join(__dirname + '/../../logs/', 'event.log'), { flags: 'a' });
  const now = () => process.hrtime(startTime)[1]/1000000;
  const startDate = new Date();
	const startTime = process.hrtime();

	/**
	 * Colors for the console.
	 */

	const alertBG = '\x1b[44m';
	const critFG = '\x1b[33m';
	const darkFG = '\x1b[30m';
	const debugBG = '\x1b[42m';
	const emergBG = '\x1b[41m';
	const errorFG = '\x1b[31m';
	const infoFG = '\x1b[36m';
	const lightFG = '\x1b[37m';
	const noticeFG = lightFG;
	const reset = '\x1b[0m';
	const warningBG = '\x1b[43m';

	/**
	 * Adds a zero if necessary.
	 * @param  {Integer} int - Number to check.
	 * @return {Any}        - String or Number.
	 */

	const zeroify = function (int) {
		if (int < 10) {
			int = '0' + int;
		}

		return int;
	}

  /**
   * Logs data.
   * @param {WrtieStream} log - Log to use.
   * @param {Any} data        - Data to log.
	 * @param {String} format   - Format of the log.
	 * @param {String} type     - Type of log.
   */

  const loggr = function (log = eventLog, data, format, type) {
		let tempDate = startDate;
		let tempMessage = '';
		let tempConsoleMessage = '';
		let tempTimestamp = '';

		tempDate.setMilliseconds(tempDate.getMilliseconds() + now());

		let tempMilliseconds = tempDate.getMilliseconds();
		let tempDay = tempDate.getDate();
		let tempHours = tempDate.getHours();
		let tempMinutes = tempDate.getMinutes();
		let tempMonth = tempDate.getMonth() + 1;
		let tempPeriod = 'AM';
		let tempSeconds = tempDate.getSeconds();
		let tempYear = tempDate.getFullYear();

		tempDay = zeroify(tempDay);
		tempMinutes = zeroify(tempMinutes);
		tempMonth = zeroify(tempMonth);
		tempSeconds = zeroify(tempSeconds);


		if (tempMilliseconds < 100) {
			if (tempMilliseconds < 10) {
				tempMilliseconds = '00' + tempMilliseconds;
			} else {
				tempMilliseconds = '0' + tempMilliseconds;
			}
		}

		if (tempHours >= 12) {
			tempPeriod = 'PM';
		}

		if (tempHours > 12) {
			tempHours -= 12;
		}

		tempHours = zeroify(tempHours);

		tempTimestamp = tempMonth + '/' + tempDay + '/' + tempYear + ' @ ' + tempHours + ':' + tempMinutes + ':' + tempSeconds + ':' + tempMilliseconds + ' ' + tempPeriod;

		if (typeof log === 'string') {
			data = log;
			log = eventLog;
		}

		if (log === undefined) {
			log = eventLog;
		}

		tempMessage = '[' + tempTimestamp + '] -';

		if (format !== undefined && !(format === 'json' || format === 'pretty')) {
			format = undefined;

			console.log(tempMessage + errorFG + ' Error:' + reset + ' Unrecognized format specified.');

			return false;
		}

		if (data === undefined) {
			console.log(tempMessage + errorFG + ' Error:' + reset + ' Nothing to log.');

			return false;
		}

		if (type !== undefined) {
			switch (type) {
				case 'Alert:':
					tempConsoleMessage = ' ' + alertBG + lightFG;
					break;
				case 'Critical:':
					tempConsoleMessage = ' ' + critFG;
					break;
				case 'Debug:':
					tempConsoleMessage = ' ' + debugBG + darkFG;
					break;
				case 'Emergency:':
					tempConsoleMessage = ' ' + emergBG + lightFG;
					break;
				case 'Error:':
					tempConsoleMessage = ' ' + errorFG;
					break;
				case 'Info:':
					tempConsoleMessage = ' ' + infoFG;
					break;
				case 'Notice:':
					tempConsoleMessage = ' ' + noticeFG;
					break;
				case 'Warning:':
					tempConsoleMessage = ' ' + warningBG + darkFG;
					break;
				default:
					// Do nothing..
					break;
			}
		} else {
			type = '';
		}

		if (format && format === 'json') {
			console.log(tempMessage + tempConsoleMessage + type + reset + ' ' + JSON.stringify(data));
			log.write(tempMessage + type + JSON.stringify(data) + '\n');
		} else if (format && format === 'pretty') {
			console.log(tempMessage + tempConsoleMessage + type + reset + ' ' + JSON.stringify(data, undefined, 2));
			log.write(tempMessage + type + JSON.stringify(data, undefined, 2) + '\n');
		} else {
			console.log(tempMessage + tempConsoleMessage + type + reset + ' ' + data);
			log.write(tempMessage + type + data + '\n');
		}
	};

	return {
		alert: function(log = eventLog, data, format) {
			return loggr(log, data, format, 'Alert:');
		},
		crit: function(log = eventLog, data, format) {
			return loggr(log, data, format, 'Critical:');
		},
		debug: function(log = eventLog, data, format) {
			return loggr(log, data, format, 'Debug:');
		},
		emerg: function(log = eventLog, data, format) {
			return loggr(log, data, format, 'Emergency:');
		},
		err: function(log = eventLog, data, format) {
			return loggr(log, data, format, 'Error:');
		},
		info: function(log = eventLog, data, format) {
			return loggr(log, data, format, 'Info:');
		},
		log: function (log = eventLog, data, format) {
			return loggr(log, data, format);
		},
		notice: function(log = eventLog, data, format) {
			return loggr(log, data, format, 'Notice:');
		},
		warning: function(log = eventLog, data, format) {
			return loggr(log, data, format, 'Warning:');
		}
	};
}();