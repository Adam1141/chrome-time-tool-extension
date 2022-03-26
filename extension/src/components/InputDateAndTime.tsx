import React, { FC, useEffect } from 'react';
import moment, { Moment } from 'moment-timezone';

interface InputDateAndTimeProps {
	initialMoment?: Moment;
	menuMoment: Moment;
	setGlobMoment: React.Dispatch<React.SetStateAction<Moment>>;
	isRealtimeUpdateOn?: boolean;
	setIsRealtimeUpdateOn?: React.Dispatch<React.SetStateAction<boolean>>;
	setMenuMoment: React.Dispatch<React.SetStateAction<Moment>>;
	selectedTimezone: React.MutableRefObject<string>;
}

const InputDateAndTime: FC<InputDateAndTimeProps> = ({
	initialMoment,
	menuMoment,
	setGlobMoment,
	setMenuMoment,
	isRealtimeUpdateOn,
	setIsRealtimeUpdateOn,
	selectedTimezone,
}) => {
	useEffect(() => {
		// console.log(
		// 	menuMoment.subtract(menuMoment.utcOffset()).toISOString(true)
		// );
		// console.log(
		// 	menuMoment.toISOString(true).split('').slice(0, -6).join(''),
		// );
		// console.log(
		// 	menuMoment
		// 		.format('YYYY/MM/DDTHH:mm:ss.SSS')
		// 		.split('')
		// 		.slice(0, -6)
		// 		.join(''),
		// );
	});
	return (
		<div>
			<input
				className="bg-indigo-100 py-1 px-3 rounded-md focus:outline-indigo-300 h-9 w-80"
				type="datetime-local"
				name="year"
				onClick={(e) =>
					setIsRealtimeUpdateOn && setIsRealtimeUpdateOn(false)
				}
				onChange={(e) => {
					setIsRealtimeUpdateOn && setIsRealtimeUpdateOn(false);
					setGlobMoment(
						moment.tz(e.target.value, selectedTimezone.current),
					);
					setMenuMoment(
						moment.tz(e.target.value, selectedTimezone.current),
					);
					// console.log(`e.target.value => ${e.target.value}`);
					// console.log(`date: ${new Date(e.target.value)}`);
				}}
				onInvalid={(e) => e.preventDefault()}
				value={menuMoment
					.tz(selectedTimezone.current)
					.format('YYYY-MM-DDTHH:mm:ss.SSS')}
			/>
		</div>
	);
};

export default InputDateAndTime;
// export default InputDateAndTime;
