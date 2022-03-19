import React, { FC, useEffect, useRef, useState } from 'react';
import TimeMenu from './components/TimeMenu';
import { BsPauseCircleFill, BsPlayCircleFill } from 'react-icons/bs';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import './index.css';
import InputDateAndTime from './components/InputDateAndTime';

const App: FC = () => {
	const [timeOptions, setTimeOptions] = useState([
		{
			label: 'Local',
			valueCb: (dateObj: Date) => '' + dateObj.toString(),
		},
		{ label: 'ISO', valueCb: (dateObj: Date) => dateObj.toISOString() },
		{ label: 'UTC', valueCb: (dateObj: Date) => dateObj.toUTCString() },
		{
			label: 'Epoch Seconds',
			valueCb: (dateObj: Date) =>
				'' + parseInt('' + dateObj.getTime() / 1000),
		},
		{
			label: 'Epoch Milliseconds',
			valueCb: (dateObj: Date) => '' + dateObj.getTime(),
		},
		{
			label: 'Local',
			valueCb: (dateObj: Date) => '' + dateObj.toString(),
		},
		{ label: 'ISO', valueCb: (dateObj: Date) => dateObj.toISOString() },
		{ label: 'UTC', valueCb: (dateObj: Date) => dateObj.toUTCString() },
		{
			label: 'Epoch Seconds',
			valueCb: (dateObj: Date) =>
				'' + parseInt('' + dateObj.getTime() / 1000),
		},
		{
			label: 'Epoch Milliseconds',
			valueCb: (dateObj: Date) => '' + dateObj.getTime(),
		},
	]);

	const [date, setDate] = useState(new Date());
	const [isRealtimeUpdateOn, setIsRealtimeUpdateOn] = useState(true);
	const [realtimeUpdateInterval, setRealtimeUpdateInterval] = useState(1000);

	function updateTime() {
		if (!isRealtimeUpdateOn) return;
		if (!date) setDate(new Date());
		const timeoutToken = setTimeout(() => {
			let isOn;
			setIsRealtimeUpdateOn((cur) => {
				isOn = cur;
				return cur;
			});
			if (!isOn) return;
			setDate(new Date());
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

	useEffect(() => {
		tippy('#pause-time-updates', {
			content:
				'<p class="text-gray-100 text-xs rounded-lg delay-3000" >Pause Real-Time Updates</p>',
			allowHTML: true,
			placement: 'right',
			delay: 1000,
			duration: 500,
			theme: 'te',
			onUntrigger(instance, event) {
				instance.hide();
			},
		});
		tippy('#continue-time-updates', {
			content:
				'<p class="text-gray-100 text-xs rounded-lg" >Continue Real-Time Updates</p>',
			allowHTML: true,
			placement: 'right',
			delay: 1000,
			duration: 500,
			theme: 'te',
			onUntrigger(instance, event) {
				instance.hide();
			},
		});
	}, [isRealtimeUpdateOn]);

	return (
		<div className="flex flex-col bg-indigo-50 max-w-xl w-auto p-2 ">
			<h1 className="bg-indigo-200 text-center text-2xl py-4 rounded-sm">
				Time Tool
			</h1>
			<div className='flex items-center gap-x-2 my-2'>
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
				<InputDateAndTime isRealtimeUpdateOn={isRealtimeUpdateOn} setIsRealtimeUpdateOn={setIsRealtimeUpdateOn} date={date} setDate={setDate} />
			</div>

			<TimeMenu dateObj={date} timeOptions={timeOptions} />
		</div>
	);
};

export default App;
