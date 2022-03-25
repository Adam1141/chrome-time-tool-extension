import React, { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import TimeMenuItem from './TimeMenuItem';
import { Scrollbars } from 'react-custom-scrollbars-2';
import moment from 'moment';
import { Moment } from 'moment';
const _ = require('lodash');


const timeOptions: {
	label: String;
	valueCb: (momentObj: Moment) => String;
}[] = [
	{
		label: 'Local',
		valueCb: (momentObj: Moment) => '' + momentObj.local().toString(),
	},
	{ label: 'ISO', valueCb: (momentObj: Moment) => momentObj.toISOString() },
	{
		label: 'UTC',
		valueCb: (momentObj: Moment) => momentObj.utc().toString(),
	},
	{
		label: 'Epoch Seconds',
		valueCb: (momentObj: Moment) => momentObj.unix().toString(),
	},
	{
		label: 'Epoch Milliseconds',
		valueCb: (momentObj: Moment) => '' + momentObj,
	},
	...Object.keys(moment.HTML5_FMT).map(objKey => {
		return {
			label: objKey.split('_').map(word => _.capitalize(word) ).join(' '),
			valueCb: (momentObj: Moment) => moment().format(moment.HTML5_FMT[objKey])
		};
	})
];
interface TimeMenuProps {
	menuMoment: Moment;
}

const TimeMenu: FC<TimeMenuProps> = ({ menuMoment = moment() }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [timeToShowListItem, setTimeToShowListItem] = useState(50);

	return (
		<div className="pb-2">
			<TimeMenuItem
				label={timeOptions[0].label}
				value={timeOptions[0].valueCb(menuMoment)}
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
										value={timeOption.valueCb(menuMoment)}
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
