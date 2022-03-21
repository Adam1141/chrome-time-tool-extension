import React, { FC, useEffect, useState } from 'react';
import { BsPauseCircleFill, BsPlayCircleFill } from 'react-icons/bs';
import InputDateAndTime from './InputDateAndTime';
import TimeMenu from './TimeMenu';

interface TimeMenuWithOptionsProps {
	isRealtimeUpdateOn: boolean;
	setIsRealtimeUpdateOn: React.Dispatch<React.SetStateAction<boolean>>;
	setDate: React.Dispatch<React.SetStateAction<Date>>;
	initialDate: Date;
}

const TimeMenuWithOptions: FC<TimeMenuWithOptionsProps> = ({
	isRealtimeUpdateOn,
	setIsRealtimeUpdateOn,
	setDate,
	initialDate,
}) => {
	const [menuDate, setMenuDate] = useState(initialDate);
	const [realtimeUpdateInterval, setRealtimeUpdateInterval] = useState(1000);

	function updateTime() {
		if (!isRealtimeUpdateOn) return;
		if (!menuDate) setMenuDate(new Date());
		const timeoutToken = setTimeout(() => {
			let isOn;
			setIsRealtimeUpdateOn((cur) => {
				isOn = cur;
				return cur;
			});
			if (!isOn) return;
			setMenuDate(new Date());
			updateTime();
		}, realtimeUpdateInterval);
		return timeoutToken;
	}

	function handlePlayPauseRealtimeClick(e: React.MouseEvent) {
		setIsRealtimeUpdateOn((cur) => !cur);
	}

	useEffect(() => {
		const timeoutToken: any = updateTime();
		return () => {
			clearTimeout(timeoutToken);
		};
	}, [realtimeUpdateInterval, isRealtimeUpdateOn]);

	return (
		<>
			<div className="flex items-center gap-x-2 my-2">
				<div className="pl-1 hover:cursor-pointer">
					{isRealtimeUpdateOn ? (
						<BsPauseCircleFill
							id="pause-time-updates"
							onClick={handlePlayPauseRealtimeClick}
							className="text-3xl text-indigo-500 hover:text-indigo-400 transition-all duration-300 border-none outline-none"
						/>
					) : (
						<BsPlayCircleFill
							id="continue-time-updates"
							onClick={handlePlayPauseRealtimeClick}
							className="text-3xl text-indigo-500 hover:text-indigo-400 transition-all duration-300 border-none outline-none"
						/>
					)}
				</div>
				<InputDateAndTime
					isRealtimeUpdateOn={isRealtimeUpdateOn}
					setIsRealtimeUpdateOn={setIsRealtimeUpdateOn}
					setDate={setDate}
					setMenuDate={setMenuDate}
				/>
			</div>
			<TimeMenu menuDate={menuDate} />
		</>
	);
};

export default TimeMenuWithOptions;
