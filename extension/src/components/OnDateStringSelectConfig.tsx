import React, { FC, useEffect, useState } from 'react';
import { MdArrowForwardIos } from 'react-icons/md';

interface OnDateStringSelectConfigProps {}

const OnDateStringSelectConfig: FC<OnDateStringSelectConfigProps> = ({}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isMagicPopupOn, setIsMagicPopupOn] = useState(false);
	const [minDateStrLength, setMinDateStrLength] = useState(4);
	const [maxDateStrLength, setMaxDateStrLength] = useState(50);

	function loadSettingsFromStorage() {
		chrome.storage.sync.get(
			['isMagicPopupOn', 'minDateStrLength', 'maxDateStrLength'],
			function (items) {
				setIsMagicPopupOn(Boolean(items.isMagicPopupOn));
				setMinDateStrLength(parseInt(items.minDateStrLength));
				setMaxDateStrLength(parseInt(items.maxDateStrLength));
				// console.log(items);
			},
		);
	}

	function handleIsMagicPopupChangeEvent(e) {
		const chkBox = e.target;
		setIsMagicPopupOn(chkBox.checked);
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
		loadSettingsFromStorage();
	}, []);

	useEffect(() => {
		chrome.storage.sync.set(
			{
				isMagicPopupOn: isMagicPopupOn,
				maxDateStrLength: maxDateStrLength,
				minDateStrLength: minDateStrLength,
			},
			function () {
				// console.log('settings changed.');
			},
		);
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
						onChange={handleIsMagicPopupChangeEvent}
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
