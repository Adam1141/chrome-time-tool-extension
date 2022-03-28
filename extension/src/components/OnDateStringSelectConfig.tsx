import React, { FC, useEffect, useState } from 'react';
import moment, { Moment } from 'moment-timezone';
import { MdArrowForwardIos } from 'react-icons/md';

interface OnDateStringSelectConfigProps {}

const OnDateStringSelectConfig: FC<OnDateStringSelectConfigProps> = ({}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isMagicPopupOn, setisMagicPopupOn] = useState(
		Boolean(localStorage.getItem('isMagicPopupOn')),
	);
	const [minDateStrLength, setMinDateStrLength] = useState(
		localStorage.getItem('minDateStrLength')
			? parseInt('' + localStorage.getItem('minDateStrLength'))
			: 8,
	);
	const [maxDateStrLength, setMaxDateStrLength] = useState(
		localStorage.getItem('maxDateStrLength')
			? parseInt('' + localStorage.getItem('maxDateStrLength'))
			: 50,
	);

	function handleMagicPopupChangeEvent(e) {
		const chkBox = e.target;
		setisMagicPopupOn(chkBox.checked);
		localStorage.setItem('isMagicPopupOn', chkBox.checked);
	}

	function handleMinStrLenChangeEvent(e) {
		let minLen = parseInt(e.target.value);
		if (minLen < 1) {
			setMinDateStrLength(1);
			return;
		}
		if (minLen > maxDateStrLength) {
			setMinDateStrLength(maxDateStrLength);
			return;
		}
		setMinDateStrLength(minLen);
	}

	function handleMaxStrLenChangeEvent(e) {
		let maxLen = parseInt(e.target.value);
		if (maxLen < minDateStrLength) {
			setMaxDateStrLength(minDateStrLength);
			maxLen = minDateStrLength;
			return;
		}
		setMaxDateStrLength(maxLen);
	}

	useEffect(() => {
		localStorage.setItem('maxDateStrLength', '' + maxDateStrLength);
		localStorage.setItem('minDateStrLength', '' + minDateStrLength);
		localStorage.setItem('isMagicPopupOn', '' + isMagicPopupOn);
	}, [minDateStrLength, maxDateStrLength, isMagicPopupOn]);

	return (
		<div>
			<p
				className="flex items-center ml-2 hover:cursor-pointer w-fit text-sm"
				onClick={() => setIsOpen((cur) => !cur)}
			>
				<MdArrowForwardIos
					className={`${
						isOpen ? 'rotate-90' : ''
					} mr-2 transition-all duration-300`}
				/>{' '}
				more
			</p>
			<div
				className={`${
					isOpen ? 'py-4' : 'h-0'
				} transition-all duration-300 overflow-hidden bg-indigo-100 rounded-md form-check flex flex-col gap-y-2 `}
			>
				<div className="flex items-center px-2 rounded-md form-check">
					<input
						className="form-check-input appearance-none w-6 h-5 mr-2 border-2 rounded-md cursor-pointer border-gray-800 checked:bg-indigo-500"
						id="isMagicPopupOn"
						type="checkbox"
						name="isMagicPopupOn"
						onChange={handleMagicPopupChangeEvent}
						checked={isMagicPopupOn}
					/>
					<label
						className="form-check-label"
						htmlFor="date-select-feature"
					>
						<p className="text-md font-bold text-gray-800">
							Magic Popup
						</p>
						<p className="text-xs text-gray-600 leading-4 pl-2">
							when selecting any date string in the browser window
							a menu with multiple formats of that date will popup
							next to it
						</p>
					</label>
				</div>
				<div className="flex items-center px-2 rounded-md form-check ml-8">
					<label
						className="text-sm mr-3 font-semibold text-gray-700"
						htmlFor="minDateStrLength"
					>
						minimum date string length:
					</label>
					<input
						className="bg-gray-50 rounded-sm w-20 px-2 py-0.5 focus:border-indigo-300 focus:outline-indigo-300"
						type="number"
						id="minDateStrLength"
						name="minDateStrLength"
						value={minDateStrLength}
						onChange={handleMinStrLenChangeEvent}
					/>
				</div>
				<div className="flex items-center px-2 rounded-md form-check ml-8">
					<label
						className="text-sm mr-2 font-semibold text-gray-700"
						htmlFor="maxDateStrLength"
					>
						maximum date string length:
					</label>
					<input
						className="bg-gray-50 rounded-sm w-20 px-2 py-0.5 focus:border-indigo-300 focus:outline-indigo-300"
						type="number"
						id="maxDateStrLength"
						name="maxDateStrLength"
						value={maxDateStrLength}
						onChange={handleMaxStrLenChangeEvent}
					/>
				</div>
			</div>
		</div>
	);
};

export default OnDateStringSelectConfig;
