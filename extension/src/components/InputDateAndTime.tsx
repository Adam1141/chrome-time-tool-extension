import { FC, useEffect, useState } from 'react';
import moment from 'moment';

interface InputDateAndTimeProps {
	date: Date;
	setDate: React.Dispatch<React.SetStateAction<Date>>;
	isRealtimeUpdateOn?: boolean;
	setIsRealtimeUpdateOn?: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputDateAndTime: FC<InputDateAndTimeProps> = ({
	date = new Date(),
	setDate,
	isRealtimeUpdateOn,
	setIsRealtimeUpdateOn,
}) => {
	const [selectedDate, setSelectedDate] = useState();
	useEffect(() => {
		const dateString = moment()
			.toISOString()
			.split('')
			.slice(0, -1)
			.join('');
		// console.log(dateString);
	}, []);
	return (
		<div>
			<input
				className="bg-indigo-100 py-1 px-3 rounded-md"
				type="datetime-local"
				name="year"
				onChange={(e) => {
				 	setIsRealtimeUpdateOn && setIsRealtimeUpdateOn(false);
					setDate(new Date(e.target.value));
				}}
				defaultValue={moment(date)
					.toISOString()
					.split('')
					.slice(0, -1)
					.join('')}
			/>
		</div>
	);
};

export default InputDateAndTime;
