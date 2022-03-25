import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { BsPauseCircleFill, BsPlayCircleFill } from 'react-icons/bs';
import InputDateAndTime from './InputDateAndTime';
import MagicDateTimeInput from './MagicDateTimeInput';
import TimeMenu from './TimeMenu';
import { ImMagicWand } from 'react-icons/im';
import { AiFillCalendar } from 'react-icons/ai';
import tippy from 'tippy.js';
import moment, { Moment } from 'moment-timezone';
import AsyncSelect from 'react-select/async';
import makeAnimatied from 'react-select/animated';

interface TimeMenuWithOptionsProps {
	isRealtimeUpdateOn: boolean;
	setIsRealtimeUpdateOn: React.Dispatch<React.SetStateAction<boolean>>;
	setGlobMoment: React.Dispatch<React.SetStateAction<Moment>>;
	initialMoment: Moment;
	selectedTimezone: React.MutableRefObject<string>;
}

const timezoneOptions = moment.tz.names().map((loc) => {
	return { label: loc, value: loc };
});

// console.log(timezoneOptions);
// console.log(moment.tz.names());

const TimeMenuWithOptions: FC<TimeMenuWithOptionsProps> = ({
	isRealtimeUpdateOn,
	setIsRealtimeUpdateOn,
	setGlobMoment,
	initialMoment,
	selectedTimezone,
}) => {
	const [menuMoment, setMenuMoment] = useState(initialMoment);
	const [realtimeUpdateInterval, setRealtimeUpdateInterval] = useState(1000);
	const [isMagicInputOn, setIsMagicInputOn] = useState(false);
	const tippyMagicInputInstance = useRef<any>(null);
	const timezoneSelectMenu = useRef<any>(null);
	const maxTimezoneItemsAtOnce = useRef(20);

	function updateTime() {
		if (!isRealtimeUpdateOn) return;
		if (!menuMoment) setMenuMoment(moment().tz(selectedTimezone.current));
		const milliseconds = moment()
			.tz(selectedTimezone.current)
			.milliseconds();
		const waitForMs = 1000 - milliseconds;
		const timeoutToken = setTimeout(() => {
			let isOn;
			setIsRealtimeUpdateOn((cur) => {
				isOn = cur;
				return cur;
			});
			if (!isOn) return;
			setMenuMoment(moment().tz(selectedTimezone.current));
			updateTime();
		}, waitForMs);
		return timeoutToken;
	}

	function handlePlayPauseRealtimeClick(e: React.MouseEvent) {
		setIsRealtimeUpdateOn((cur) => !cur);
	}

	function filterTimezonesOptions(inputValue: string) {
		return timezoneOptions
			.filter((tz) =>
				tz.label.toLowerCase().includes(inputValue.toLowerCase()),
			)
			.slice(0, maxTimezoneItemsAtOnce.current);
	}

	function searchTimezoneOptions(inputValue: string) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(filterTimezonesOptions(inputValue));
			}, 100);
		});
	}

	useEffect(() => {
		const timeoutToken: any = isRealtimeUpdateOn ? updateTime() : null;
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
		const tippyInstance = (tippyMagicInputInstance.current = tippy(
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

		// tippyMagicInputInstance.current[0].reference._tippy.setContent(
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
						selectedTimezone={selectedTimezone}
					/>
				)) || (
					<InputDateAndTime
						menuMoment={menuMoment}
						isRealtimeUpdateOn={isRealtimeUpdateOn}
						setIsRealtimeUpdateOn={setIsRealtimeUpdateOn}
						setGlobMoment={setGlobMoment}
						setMenuMoment={setMenuMoment}
						selectedTimezone={selectedTimezone}
					/>
				)}

				<div
					id="magic-input-switch"
					className="w-7.5 h-7.5 bg-indigo-500 rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-indigo-400 transition-all duration-300 group"
					onClick={() => setIsMagicInputOn((cur) => !cur)}
				>
					{(isMagicInputOn && (
						<AiFillCalendar className="w-7.5 text-md text-gray-200 transition-all duration-300 border-none outline-none group-hover:text-gray-700" />
					)) || (
						<ImMagicWand className="w-7.5 text-md text-gray-200 transition-all duration-300 border-none outline-none group-hover:text-gray-700" />
					)}
				</div>

				<AsyncSelect
					ref={timezoneSelectMenu}
					className="text-xs w-full text-indigo-900"
					defaultValue={{
						label: moment.tz.guess(),
						value: moment.tz.guess(),
					}}
					defaultOptions={timezoneOptions.slice(0, maxTimezoneItemsAtOnce.current)}
					onChange={(e: any) => {
						selectedTimezone.current = e.value;
						setMenuMoment(moment(menuMoment).tz(selectedTimezone.current));
					}}
					placeholder="Search.."
					cacheOptions
					components={makeAnimatied()}
					loadOptions={searchTimezoneOptions}
					maxMenuHeight={200}
					styles={{
						menu: (provided, state) => ({
							...provided,
							background: 'rgb(224 231 255)',
						}),
						control: (provided, state) => ({
							...provided,
							background: 'rgb(224 231 255)',
						}),
					}}
					theme={(theme) => ({
						...theme,
						borderRadius: 5,
						colors: {
						  ...theme.colors,
						  primary25: 'rgb(199 210 254)',
						},
					  })}
				/>
			</div>
			<TimeMenu
				menuMoment={menuMoment}
				selectedTimezone={selectedTimezone}
			/>
		</div>
	);
};

export default TimeMenuWithOptions;
