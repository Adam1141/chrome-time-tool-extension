import React, { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import TimeMenuItem from './TimeMenuItem';
import { Scrollbars } from 'react-custom-scrollbars-2';

const timeOptions: {
	label: String;
	valueCb: (dateObj: Date) => String;
}[] = [
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
];
interface TimeMenuProps {
	menuDate: Date;
}

const TimeMenu: FC<TimeMenuProps> = ({ menuDate = new Date() }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [timeToShowListItem, setTimeToShowListItem] = useState(50);

	return (
		<div className="pb-2">
			<TimeMenuItem
				label={timeOptions[0].label}
				value={timeOptions[0].valueCb(menuDate)}
				isMenuOpen={isMenuOpen}
				setIsMenuOpen={setIsMenuOpen}
				isFirstInList={true}
			/>
			<Scrollbars autoHeight>
				<div
					className={`${
						isMenuOpen ? '' : 'hidden'
					} flex flex-col pr-3 max-h-44 gap-y-1 bg-indigo-100 rounded-sm transition-all duration-1000`}
				>
					{isMenuOpen &&
						timeOptions.map((timeOption, idx) => {
							return (
								idx != 0 && (
									<TimeMenuItem
										key={idx}
										label={timeOption.label}
										value={timeOption.valueCb(menuDate)}
										isMenuOpen={isMenuOpen}
										showAfterMs={idx * timeToShowListItem}
									/>
								)
							);
						})}
				</div>
			</Scrollbars>
		</div>
	);
};
export default TimeMenu;
