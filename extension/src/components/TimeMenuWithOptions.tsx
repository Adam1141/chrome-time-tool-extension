import React, { FC, useEffect, useRef, useState } from 'react';
import { BsPauseCircleFill, BsPlayCircleFill } from 'react-icons/bs';
import InputDateAndTime from './InputDateAndTime';
import MagicDateTimeInput from './MagicDateTimeInput';
import TimeMenu from './TimeMenu';
import { ImMagicWand } from 'react-icons/im';
import { AiFillCalendar } from 'react-icons/ai';
import tippy from 'tippy.js';
import moment, { Moment } from 'moment';

interface TimeMenuWithOptionsProps {
	isRealtimeUpdateOn: boolean;
	setIsRealtimeUpdateOn: React.Dispatch<React.SetStateAction<boolean>>;
	setGlobMoment: React.Dispatch<React.SetStateAction<Moment>>;
	initialMoment: Moment;
}

const TimeMenuWithOptions: FC<TimeMenuWithOptionsProps> = ({
	isRealtimeUpdateOn,
	setIsRealtimeUpdateOn,
	setGlobMoment,
	initialMoment,
}) => {
	const [menuMoment, setMenuMoment] = useState(initialMoment);
	const [realtimeUpdateInterval, setRealtimeUpdateInterval] = useState(1000);
	const [isMagicInputOn, setIsMagicInputOn] = useState(false);
	const tippyMagincInputInstance = useRef<any>(null);

	function updateTime() {
		if (!isRealtimeUpdateOn) return;
		if (!menuMoment) setMenuMoment(moment());
		const milliseconds = moment().milliseconds();
		const wiatForMs = 1000 - milliseconds;
		const timeoutToken = setTimeout(() => {
			let isOn;
			setIsRealtimeUpdateOn((cur) => {
				isOn = cur;
				return cur;
			});
			if (!isOn) return;
			setMenuMoment(moment());
			updateTime();
		}, wiatForMs);
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
	}, [isRealtimeUpdateOn]);

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

	useEffect(() => {
		const tippyInstance = (tippyMagincInputInstance.current = tippy(
			'#magic-input-switch',
			{
				content: isMagicInputOn
					? 'Normal Date Input'
					: 'Magic Date Input',
				placement: 'right',
				delay: 1000,
				duration: 500,
				theme: 'te',
				onUntrigger(instance, event) {
					instance.hide();
				},
				onTrigger(instance, event) {
					instance.setProps({
						content: isMagicInputOn
							? 'Normal Date Input'
							: 'Magic Date Input',
					});
				},
			},
		));
		return () => {
			tippyInstance[0].destroy();
		};
		console.log(tippyMagincInputInstance.current);

		// tippyMagincInputInstance.current[0].reference._tippy.setContent(
		// 	isMagicInputOn ? 'Normal Date Input' : 'Magic Date Input',
		// );
	}, [isMagicInputOn]);

	return (
		<div>
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
				{(isMagicInputOn && (
					<MagicDateTimeInput
						setIsRealtimeUpdateOn={setIsRealtimeUpdateOn}
						setMenuMoment={setMenuMoment}
					/>
				)) || (
					<InputDateAndTime
						menuMoment={menuMoment}
						isRealtimeUpdateOn={isRealtimeUpdateOn}
						setIsRealtimeUpdateOn={setIsRealtimeUpdateOn}
						setGlobMoment={setGlobMoment}
						setMenuMoment={setMenuMoment}
					/>
				)}
				<div
					id="magic-input-switch"
					className="w-7.5 h-7.5 bg-indigo-500 rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-indigo-400 transition-all duration-300 group"
					onClick={() => setIsMagicInputOn((cur) => !cur)}
				>
					{(isMagicInputOn && (
						<AiFillCalendar className="text-md text-gray-200 transition-all duration-300 border-none outline-none group-hover:text-gray-700" />
					)) || (
						<ImMagicWand className="text-md text-gray-200 transition-all duration-300 border-none outline-none group-hover:text-gray-700" />
					)}
				</div>
			</div>
			<TimeMenu menuMoment={menuMoment} />
		</div>
	);
};

export default TimeMenuWithOptions;
