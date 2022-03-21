import React, { ChangeEvent, FC } from 'react';
import moment from 'moment';

interface MagicDateTimeInputProps {
	setMenuDate: React.Dispatch<React.SetStateAction<Date>>;
	setIsRealtimeUpdateOn: React.Dispatch<React.SetStateAction<boolean>>;
}

const MagicDateTimeInput: FC<MagicDateTimeInputProps> = ({
	setMenuDate,
	setIsRealtimeUpdateOn,
}) => {
	function handleEnteredDate(e: React.ChangeEvent<HTMLInputElement>) {
		setIsRealtimeUpdateOn(false);
		const enteredDateString = e.target.value;
		const unixSecondsRegex = new RegExp(/^\d{10}$/);
		const unixMillisRegex = new RegExp(/^\d{13}$/);
		const isUnixSeconds = unixSecondsRegex.test(enteredDateString);
		const isUnixMillis = unixMillisRegex.test(enteredDateString);
		const momentFromString = isUnixSeconds
			? moment.unix(parseInt(enteredDateString))
			: isUnixMillis
			? moment(parseInt(enteredDateString))
			: moment(enteredDateString);
		const isValid = momentFromString.isValid();
		if (isValid)
			setMenuDate(
				momentFromString
					.toDate(),
			);

		console.log(
			`${enteredDateString} is a ${
				isValid ? 'valid date' : 'nope'
			} --- ${momentFromString}`,
		);
	}

	return (
		<div>
			<input
				className="bg-indigo-100 py-1 px-3 font-mono rounded-md focus:outline-indigo-300 h-9 w-80"
				type="text"
				placeholder="Enter any date/time string.."
				onChange={handleEnteredDate}
			/>
		</div>
	);
};

export default MagicDateTimeInput;
