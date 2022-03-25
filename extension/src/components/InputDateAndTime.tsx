import React, { FC, useEffect, useRef, useState, memo } from 'react';
import moment, { Moment } from 'moment';

interface InputDateAndTimeProps {
	initialMoment?: Moment;
	menuMoment: Moment;
	setGlobMoment: React.Dispatch<React.SetStateAction<Moment>>;
	isRealtimeUpdateOn?: boolean;
	setIsRealtimeUpdateOn?: React.Dispatch<React.SetStateAction<boolean>>;
	setMenuMoment: React.Dispatch<React.SetStateAction<Moment>>;
}

const InputDateAndTime: FC<InputDateAndTimeProps> = ({
	initialMoment = moment(),
	menuMoment,
	setGlobMoment,
	setMenuMoment,
	isRealtimeUpdateOn,
	setIsRealtimeUpdateOn,
}) => {
	useEffect(() => {
		// console.log(
		// 	menuMoment.subtract(menuMoment.utcOffset()).toISOString(true)
		// );
		console.log(
			menuMoment.toISOString(true).split('').slice(0, -6).join(''),
		);
	});
	return (
		<div>
			<input
				className="bg-indigo-100 py-1 px-3 rounded-md focus:outline-indigo-300 h-9 w-80"
				type="datetime-local"
				name="year"
				onChange={(e) => {
					setIsRealtimeUpdateOn && setIsRealtimeUpdateOn(false);
					setGlobMoment(moment(e.target.value));
					setMenuMoment(moment(e.target.value));
					// console.log(`date: ${new Date(e.target.value)}`);
				}}
				onInvalid={(e) => e.preventDefault()}
				value={menuMoment
					.toISOString(true)
					.split('')
					.slice(0, -6)
					.join('')}
			/>
		</div>
	);
};

export default memo(InputDateAndTime);
// export default InputDateAndTime;
