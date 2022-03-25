import React, { FC, useEffect, useState } from 'react';
import moment, { Moment } from 'moment-timezone';
import 'react-loading-icons';
import { FcCheckmark } from 'react-icons/fc';
import { BsQuestion } from 'react-icons/bs';
import { Circles } from 'react-loading-icons';
import tippy, { Instance, Props } from 'tippy.js';

interface MagicDateTimeInputProps {
	setMenuMoment: React.Dispatch<React.SetStateAction<Moment>>;
	setIsRealtimeUpdateOn: React.Dispatch<React.SetStateAction<boolean>>;
	selectedTimezone: React.MutableRefObject<string>;
}

const MagicDateTimeInput: FC<MagicDateTimeInputProps> = ({
	setMenuMoment,
	setIsRealtimeUpdateOn,
	selectedTimezone,
}) => {
	const [dateString, setDateString] = useState<any>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [waitBeforeProcessing, setWaitBeforeProcessing] = useState(750);
	const [isGood, setIsGood] = useState<any>(null);

	function handleEnteredDate(e: React.ChangeEvent<HTMLInputElement>) {
		setIsRealtimeUpdateOn(false);
		setIsProcessing(true);

		// the rest will be handled in a useEffect
		setDateString(e.target.value);
	}

	function guessDateFromDateString(): boolean {
		const unixSecondsRegex = new RegExp(/^\d{10}$/);
		const unixMillisRegex = new RegExp(/^\d{13}$/);
		const isUnixSeconds = unixSecondsRegex.test(dateString);
		const isUnixMillis = unixMillisRegex.test(dateString);
		const momentFromString = isUnixSeconds
			? moment.unix(parseInt(dateString)).tz(selectedTimezone.current)
			: isUnixMillis
			? moment(parseInt(dateString)).tz(selectedTimezone.current)
			: moment(dateString).tz(selectedTimezone.current);
		const isValid = momentFromString.isValid();
		if (isValid) setMenuMoment(momentFromString);

		console.log(
			`${dateString} is a ${
				isValid ? 'valid date' : 'nope'
			} --- ${momentFromString}`,
		);
		return isValid;
	}

	useEffect(() => {
		if (!dateString) setIsProcessing(false);
		const timeoutToken = setTimeout(() => {
			setIsGood(dateString && guessDateFromDateString());
			setIsProcessing(false);
		}, waitBeforeProcessing);
		return () => {
			clearTimeout(timeoutToken);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dateString]);

	useEffect(() => {
		let incorrectInstance: Instance<Props>[];
		setTimeout(() => {
			incorrectInstance = tippy('#incorrect-date-hint', {
				content: "couldn't recognize a date",
				delay: 1000,
				theme: 'te',
				onUntrigger(instance, event) {
					instance.hide();
				},
			});
		}, 100);

		// console.log(`isGood= ${isGood}`);
		return () => {
			incorrectInstance.forEach((v) => {
				if (v.hasOwnProperty('destroy')) v.destroy();
			});
		};
	}, [isGood]);

	return (
		<div className="relative">
			<input
				className="bg-indigo-100 py-1 px-3 pr-8 font-mono rounded-md focus:outline-indigo-300 h-9 w-80 peer"
				type="text"
				placeholder="Enter any date string.."
				onChange={handleEnteredDate}
			/>
			{isProcessing ? (
				<Circles
					speed={2}
					className="absolute top-1/2 right-2 transform -translate-y-1/2 children:fill-indigo-500 w-5 h-5"
				/>
			) : isGood ? (
				dateString && (
					<FcCheckmark
						id="correct-date-hint"
						className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xl text-green-800"
					/>
				)
			) : (
				dateString && (
					<BsQuestion
						id="incorrect-date-hint"
						className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xl text-red-800 outline-none border-none w-6 h-6"
					/>
				)
			)}
			{/*
            <BallTriangle />
			<Bars />
			<Circles />
			<Grid />
			<Hearts />
			<Oval />
			<Puff />
			<Rings />
			<SpinningCircles />
			<TailSpin />
			<ThreeDots /> 
            */}
		</div>
	);
};

export default MagicDateTimeInput;
