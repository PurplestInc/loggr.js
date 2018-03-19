/**
 * @fileoverview loggr.js a simple logging utility.
 * @author Rob Dukarski <rob@purplest.com>
 * @copyright 2018 Purplest, Inc.
 * @version 1.2.1
 * @exports loggr
 */

module.exports = function () {
  'use strict';

	const dir = __dirname + '/../../logs/';
  const fs = require('fs');
  const path = require('path');
  const now = () => process.hrtime(startTime)[1]/1000000;
  const startDate = new Date();
	const startTime = process.hrtime();

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	let logs = {};

	logs.alertLog = fs.createWriteStream(path.join(dir, 'alert.log'), { flags: 'a' });
	logs.criticalLog = fs.createWriteStream(path.join(dir, 'critical.log'), { flags: 'a' });
	logs.debugLog = fs.createWriteStream(path.join(dir, 'debug.log'), { flags: 'a' });
	logs.emergencyLog = fs.createWriteStream(path.join(dir, 'emergency.log'), { flags: 'a' });
	logs.errorLog = fs.createWriteStream(path.join(dir, 'error.log'), { flags: 'a' });
	logs.eventLog = fs.createWriteStream(path.join(dir, 'event.log'), { flags: 'a' });
	logs.infoLog = fs.createWriteStream(path.join(dir, 'info.log'), { flags: 'a' });
	logs.noticeLog = fs.createWriteStream(path.join(dir, 'notice.log'), { flags: 'a' });
	logs.warningLog = fs.createWriteStream(path.join(dir, 'warning.log'), { flags: 'a' });

	/**
	 * Colors for the console.
	 */

	let darkFG = '\x1b[30m';
	let lightFG = '\x1b[37m';
	let alertBG = '\x1b[44m' + lightFG;
	let critFG = '\x1b[33m';
	let debugBG = '\x1b[42m' + darkFG;
	let emergBG = '\x1b[41m' + lightFG;
	let errorFG = '\x1b[31m';
	let infoFG = '\x1b[36m';
	let noticeFG = lightFG;
	let reset = '\x1b[0m';
	let warningBG = '\x1b[43m' + darkFG;

	/**
	 * Adds a zero if necessary.
	 * @param  {Integer} int - Number to check.
	 * @return {Any}         - String or Number.
	 */

	const zeroify = function (int) {
		if (int < 10) {
			int = '0' + int;
		}

		return int;
	}

	const createLog = function (log) {
		logs[log + 'Log'] = fs.createWriteStream(path.join('../../logs/', log + '.log'), { flags: 'a' });
	};

	const recolorLog = function (type, color) {
		if (type !== undefined) {
			switch (type) {
				case 'alert':
					alertBG = color;
					break;
				case 'crit':
					critFG = color;
					break;
				case 'debug':
					debugBG = color;
					break;
				case 'emerg':
					emergBG = color;
					break;
				case 'err':
					errorFG = color;
					break;
				case 'info':
					infoFG = color;
					break;
				case 'notice':
					noticeFG = color;
					break;
				case 'warn':
					warningBG = color;
					break;
				default:
					// Do nothing..
					break;
			}
		}
	};

  /**
   * Logs data.
   * @param {WrtieStream} log - Log to use.
   * @param {Any} data        - Data to log.
	 * @param {String} format   - Format of the log.
	 * @param {String} type     - Type of log.
   */

  const loggr = function (log = logs.eventLog, data, format, type) {
		let tempDate = startDate;
		let tempMessage = '';
		let tempConsoleMessage = '';
		let tempTimestamp = '';
		let tempType;

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
			if (!logs[log + 'Log']) {
				data = log;
				log = logs.eventLog;
			} else {
				log = logs[log + 'Log'];
			}
		}

		if (log === undefined) {
			log = logs.eventLog;
		}

		tempMessage = '[' + tempTimestamp + '] - ';

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
					tempConsoleMessage = alertBG;
					tempType = 'alert';
					break;
				case 'Critical:':
					tempConsoleMessage = critFG;
					tempType = 'critical';
					break;
				case 'Debug:':
					tempConsoleMessage = debugBG;
					tempType = 'debug';
					break;
				case 'Emergency:':
					tempConsoleMessage = emergBG;
					tempType = 'emergency';
					break;
				case 'Error:':
					tempConsoleMessage = errorFG;
					tempType = 'error';
					break;
				case 'Info:':
					tempConsoleMessage = infoFG;
					tempType = 'info';
					break;
				case 'Notice:':
					tempConsoleMessage = noticeFG;
					tempType = 'notice';
					break;
				case 'Warning:':
					tempConsoleMessage = warningBG;
					tempType = 'warning';
					break;
				default:
					// Do nothing..
					break;
			}

			type += reset + ' ';
		} else {
			type = '';
		}


		if (format && format === 'json') {
			console.log(tempMessage + tempConsoleMessage + type + JSON.stringify(data));
			log.write(tempMessage + type + JSON.stringify(data) + '\n');

			if (tempType) {
				let tempLog = logs[tempType + 'Log'];
				tempLog.write(tempMessage + type + JSON.stringify(data) + '\n');
			}
		} else if (format && format === 'pretty') {
			console.log(tempMessage + tempConsoleMessage + type + JSON.stringify(data, undefined, 2));
			log.write(tempMessage + type + JSON.stringify(data, undefined, 2) + '\n');

			if (tempType) {
				let tempLog = logs[tempType + 'Log'];
				tempLog.write(tempMessage + type + JSON.stringify(data, undefined, 2) + '\n');
			}
		} else {
			console.log(tempMessage + tempConsoleMessage + type + data);
			log.write(tempMessage + type + data + '\n');

			if (tempType) {
				let tempLog = logs[tempType + 'Log'];
				tempLog.write(tempMessage + type + data + '\n');
			}
		}
	};

	return {
		alert: function (log = eventLog, data, format) {
			return loggr(log, data, format, 'Alert:');
		},
		create: function (log) {
			return createLog(log);
		},
		crit: function (log = eventLog, data, format) {
			return loggr(log, data, format, 'Critical:');
		},
		debug: function (log = eventLog, data, format) {
			return loggr(log, data, format, 'Debug:');
		},
		emerg: function (log = eventLog, data, format) {
			return loggr(log, data, format, 'Emergency:');
		},
		err: function (log = eventLog, data, format) {
			return loggr(log, data, format, 'Error:');
		},
		info: function (log = eventLog, data, format) {
			return loggr(log, data, format, 'Info:');
		},
		log: function (log = eventLog, data, format) {
			return loggr(log, data, format);
		},
		notice: function (log = eventLog, data, format) {
			return loggr(log, data, format, 'Notice:');
		},
		recolor: {
			alert: function (color) {
				return recolorLog('alert', color);
			},
			crit: function (color) {
				return recolorLog('crit', color);
			},
			debug: function (color) {
				return recolorLog('debug', color);
			},
			emerg: function (color) {
				return recolorLog('emerg', color);
			},
			err: function (color) {
				return recolorLog('err', color);
			},
			info: function (color) {
				return recolorLog('info', color);
			},
			notice: function (color) {
				return recolorLog('notice', color);
			},
			warning: function (color) {
				return recolorLog('warning', color);
			}
		},
		warning: function (log = eventLog, data, format) {
			return loggr(log, data, format, 'Warning:');
		}
	};
}();