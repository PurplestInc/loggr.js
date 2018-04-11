/**
 * @fileoverview loggr.js a simple logging utility.
 * @author Rob Dukarski <rob@purplest.com>
 * @copyright 2018 Purplest, Inc.
 * @version 1.2.5
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
	const updateDate = () => new Date(new Date().setHours(24, 0, 0, 0));

	let isLogging = false;
	let logs = {};
	let logNames = ['alert', 'critical', 'debug', 'emergency', 'error', 'event', 'info', 'notice', 'warning'];
	let updateTime = updateDate().getTime();

	/**
	 * Adds a zero if necessary.
	 *
	 * @param   {Integer} int - Number to check
	 * @returns {Any}         - String or Number
	 */

	const zeroify = function (int) {
		if (int < 10) {
			int = '0' + int;
		}

		return int;
	};

	/**
	 * Creates a log directory if it does not already exsist.
	 *
	 * @returns {String} - Directory
	 */

	const createLogDir = function () {
		return new Promise(function (resolve, reject) {
			let error = true;
			let dirCount = 0;
			let dirIterator = 0;
			let dirs = [];
			let tempDate = startDate;
			let tempDay = zeroify(tempDate.getDate());
			let tempDir = dir;
			let tempDirectories = '';
			let tempMonth = zeroify(tempDate.getMonth() + 1);
			let tempYear = tempDate.getFullYear();

			if (!fs.existsSync(tempDir)) {
				fs.mkdirSync(tempDir);

				error = false;
			} else {
				error = false;
			}

			tempDirectories = tempYear + '/' + tempMonth + '/' + tempDay;

			dirs = tempDirectories.split('/');

			dirCount = dirs.length;

			dirs.forEach(function (directory) {
				if (!fs.existsSync(tempDir + directory + '/')) {
					fs.mkdirSync(tempDir + directory + '/');

					error = false;
				} else {
					error = false;
				}

				tempDir += directory + '/';

				dirIterator++;

				if (dirIterator === dirCount) {

					if (error) {
						reject('Error: Did not create directories, they may have already been created.');
					} else {
						resolve(tempDir);
					}
				}
			});
		});
	};

	/**
	 * Initializes new files for logging.
	 */

	const initLoggr = function () {
		return new Promise(function (resolve, reject) {
			let logNamesCount = logNames.length;
			let logNamesIterator = 0;
			let tempDir = dir;

			createLogDir()
			.then(function (response) {
				tempDir = response;

				logNames.forEach(function (log) {
					logs[log + 'Log'] = fs.createWriteStream(path.join(tempDir, log + '.log'), { flags: 'a' });
					logNamesIterator++;

					if (logNamesIterator === logNamesCount) {
						let tempUpdateTime = updateDate().getTime();

						if (tempUpdateTime === updateTime) {
							reject('Error: Update time has not changed.');
						} else {
							resolve(tempUpdateTime);
						}
					}
				});
			})
			.catch(function (error) {
				console.log(error);
			});
		});
	};

	initLoggr()
	.then(function (response) {
		updateTime = response;
	})
	.catch(function (error) {
		console.log(error);
	});

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
	 * Creates a new log.
	 *
	 * @param {String} log - Name of log to create
	 */

	const createLog = function (log) {
		let tempDir = dir;

		createLogDir()
		.then(function (response) {
			tempDir = response;

			if (logNames.indexOf(log) === -1) {
				logNames.push(log);
			}

			logs[log + 'Log'] = fs.createWriteStream(path.join(tempDir, log + '.log'), { flags: 'a' });
		})
		.catch(function (error) {
			console.log(error);
		});
	};

	/**
	 * Changes the console coloring for specific severity types.
	 *
	 * @param {String} type  - Type of severity
	 * @param {String} color - Color to be used
	 */

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
	 * Returns the current timestamp.
	 *
	 * @returns {String} - Current timestamp
	 */

	const getTimestamp = function () {
		let tempDate = startDate;

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

		return tempMonth + '/' + tempDay + '/' + tempYear + ' @ ' + tempHours + ':' + tempMinutes + ':' + tempSeconds + ':' + tempMilliseconds + ' ' + tempPeriod;
	};

  /**
   * Logs data.
	 *
   * @param {WrtieStream} log - Log to use
   * @param {Any} data        - Data to log
	 * @param {String} format   - Format of the log
	 * @param {String} type     - Type of log
   */

  const loggr = function (log = logs.eventLog, data, format, type) {
		let tempMessage = '';
		let tempConsoleMessage = '';
		let tempTime = startDate.getTime() + now();
		let tempTimestamp = '';
		let tempType;

		if (tempTime >= updateTime) {
			initLoggr()
			.then(function (response) {
				updateTime = response;

				if (!isLogging) {
					isLogging = true;
					loggr(log, data, format, type);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		} else {
			tempTimestamp = getTimestamp();

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

			isLogging = false;
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