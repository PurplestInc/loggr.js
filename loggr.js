/**
 * @fileoverview loggr.js a simple logging utility.
 * @author Rob Dukarski <rob@purplest.com>
 * @copyright 2018 Purplest, Inc.
 * @version 1.0.0
 * @exports loggr
 */

module.exports = function() {
  'use strict';

  const fs = require('fs');
  const path = require('path');
  const eventLog = fs.createWriteStream(path.join(__dirname, 'event.log'), { flags: 'a' });
  const now = () => process.hrtime(startTime)[1]/1000000;
  const startDate = new Date();
	const startTime = process.hrtime();

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
	 * @param {String} type     - Type of log.
   */

  const loggr = function (log = eventLog, data, type) {
		let tempDate = startDate;

		tempDate.setMilliseconds(tempDate.getMilliseconds() + now());

		let tempMilliseconds = tempDate.getMilliseconds();
		let tempDay = tempDate.getDate();
		let tempHours = tempDate.getHours();
		let tempMinutes = tempDate.getMinutes();
		let tempMonth = tempDate.getMonth();
		let tempPeriod = ' AM';
		let tempSeconds = tempDate.getSeconds();
		let tempYear = tempDate.getFullYear();

		tempDay = zeroify(tempDay);
		tempMinutes = zeroify(tempMinutes);
		tempMonth = zeroify(tempMonth);
		tempSeconds = zeroify(tempSeconds);
		tempMilliseconds = zeroify(tempMilliseconds);

		if (tempHours >= 12) {
			tempPeriod = ' PM';
		}

		if (tempHours > 12) {
			tempHours -= 12;
		}

		tempHours = zeroify(tempHours);

		let tempTimestamp = tempMonth + '/' + tempDay + '/' + tempYear + ' @ ' + tempHours + ':' + tempMinutes + ':' + tempSeconds + ':' + tempMilliseconds + ' ' + tempPeriod;

		if (log === undefined) {
			log = eventLog;
		}

		if (data === undefined) {
			console.log('[' + tempTimestamp + '] - Error: Nothing to log.');
		} else {
			if (type && type === 'json') {
				console.log('[' + tempTimestamp + '] - ' + JSON.stringify(data));
				log.write('[' + tempTimestamp + '] - ' + JSON.stringify(data) + '\n');
			} else if (type && type === 'pretty') {
				console.log('[' + tempTimestamp + '] - ' + JSON.stringify(data, undefined, 2));
				log.write('[' + tempTimestamp + '] - ' + JSON.stringify(data, undefined, 2) + '\n');
			} else {
				console.log('[' + tempTimestamp + '] - ' + data);
				log.write('[' + tempTimestamp + '] -' + data + '\n');
			}
		}
	};

	return {
		log: function(log, data, type) {
				return loggr(log, data, type);
		}
	};
}();