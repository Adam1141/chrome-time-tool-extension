
// function isValidDateString(dateString) {}

// function guessDateFromDateString(dateString) {
// 	const unixSecondsRegex = new RegExp(/^\d{10}$/);
// 	const unixMillisRegex = new RegExp(/^\d{13}$/);
// 	const isUnixSeconds = unixSecondsRegex.test(dateString);
// 	const isUnixMillis = unixMillisRegex.test(dateString);
// 	const momentFromString = isUnixSeconds
// 		? moment.unix(parseInt(dateString)).tz(selectedTimezone.current)
// 		: isUnixMillis
// 		? moment(parseInt(dateString)).tz(selectedTimezone.current)
// 		: moment.tz(dateString, selectedTimezone.current);
// 	const isValid = momentFromString.isValid();
// 	console.log('magic.tz(): ' + momentFromString.tz());

// 	// console.log(
// 	// 	`${dateString} is a ${
// 	// 		isValid ? 'valid date' : 'nope'
// 	// 	} --- ${momentFromString}`,
// 	// );
// 	return isValid ? momentFromString : false;
// }

// console.log(
// 	`guessDateFromDateString(...) => ${guessDateFromDateString('2009')}`,
// );
