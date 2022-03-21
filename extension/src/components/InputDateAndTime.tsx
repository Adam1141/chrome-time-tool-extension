import React, { FC, useEffect, useRef, useState, memo } from 'react';
import moment from 'moment';

interface InputDateAndTimeProps {
	initialDate?: Date;
	setDate: React.Dispatch<React.SetStateAction<Date>>;
	isRealtimeUpdateOn?: boolean;
	setIsRealtimeUpdateOn?: React.Dispatch<React.SetStateAction<boolean>>;
	setMenuDate: React.Dispatch<React.SetStateAction<Date>>;
}

const InputDateAndTime: FC<InputDateAndTimeProps> = ({
	initialDate = new Date(),
	setDate,
	setMenuDate,
	isRealtimeUpdateOn,
	setIsRealtimeUpdateOn,
}) => {
	const [selectedDate, setSelectedDate] = useState();
	const counter = useRef(0);
	useEffect(() => {
		const dateString = moment()
			.toISOString()
			.split('')
			.slice(0, -1)
			.join('');
		// console.log(dateString);
		// counter.current ++;
		// console.log(`rendered ${counter.current} times`)
	});
	return (
		<div>
			<input
				className="bg-indigo-100 py-1 px-3 rounded-md"
				type="datetime-local"
				name="year"
				onChange={(e) => {
					setIsRealtimeUpdateOn && setIsRealtimeUpdateOn(false);
					setDate(new Date(e.target.value));
					setMenuDate(new Date(e.target.value));
					console.log(`date: ${new Date(e.target.value)}`);
				}}
			 	onInvalid={(e) => e.preventDefault()}
				defaultValue={moment(initialDate)
					.toISOString()
					.split('')
					.slice(0, -1)
					.join('')}
			/>
		</div>
	);
};

export default memo(InputDateAndTime);
// export default InputDateAndTime;
