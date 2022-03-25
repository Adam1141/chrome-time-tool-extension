import _ from 'lodash';
import React, { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import TimeMenuItem from './TimeMenuItem';
import { Scrollbars } from 'react-custom-scrollbars-2';
import moment, { Moment } from 'moment-timezone';
import 'moment/min/locales';

interface TimeMenuProps {
	menuMoment: Moment;
	selectedTimezone: React.MutableRefObject<string>;
}

const TimeMenu: FC<TimeMenuProps> = ({ menuMoment, selectedTimezone }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [timeToShowListItem, setTimeToShowListItem] = useState(50);

	const [timeOptions, setTimeOptions] = useState<
		{
			label: String;
			valueCb: (momentObj: Moment) => String;
		}[]
	>([
		{
			label: 'Local',
			valueCb: (momentObj: Moment) =>
				'' + momentObj.tz(selectedTimezone.current).toString(),
		},
		{
			label: 'ISO',
			valueCb: (momentObj: Moment) =>
				momentObj.tz(selectedTimezone.current).toISOString(),
		},
		{
			label: 'UTC',
			valueCb: (momentObj: Moment) =>
				momentObj.tz(selectedTimezone.current).utc().toString(),
		},
		{
			label: 'Epoch Seconds',
			valueCb: (momentObj: Moment) =>
				momentObj.tz(selectedTimezone.current).unix().toString(),
		},
		{
			label: 'Epoch Milliseconds',
			valueCb: (momentObj: Moment) =>
				'' + momentObj.tz(selectedTimezone.current),
		},
		...Object.keys(moment.HTML5_FMT).map((objKey) => {
			return {
				label: objKey
					.split('_')
					.map((word) => _.capitalize(word))
					.join(' '),
				valueCb: (momentObj: Moment) =>
					momentObj
						.tz(selectedTimezone.current)
						.format(moment.HTML5_FMT[objKey]),
			};
		}),
		{
			label:'L',
			valueCb: (momentObj: Moment) => momentObj.format(moment.localeData().longDateFormat('L'))
		},
		{
			label:'l',
			valueCb: (momentObj: Moment) => momentObj.format(moment.localeData().longDateFormat('l'))
		},
		{
			label:'LL',
			valueCb: (momentObj: Moment) => momentObj.format(moment.localeData().longDateFormat('LL'))
		},
		{
			label:'ll',
			valueCb: (momentObj: Moment) => momentObj.format(moment.localeData().longDateFormat('ll'))
		},
		{
			label:'LLL',
			valueCb: (momentObj: Moment) => momentObj.format(moment.localeData().longDateFormat('LLL'))
		},
		{
			label:'lll',
			valueCb: (momentObj: Moment) => momentObj.format(moment.localeData().longDateFormat('lll'))
		},
		{
			label:'LLLL',
			valueCb: (momentObj: Moment) => momentObj.format(moment.localeData().longDateFormat('LLLL'))
		},
		{
			label:'llll',
			valueCb: (momentObj: Moment) => momentObj.format(moment.localeData().longDateFormat('llll'))
		},
		{
			label:'LT',
			valueCb: (momentObj: Moment) => momentObj.format(moment.localeData().longDateFormat('LT'))
		},
		{
			label:'LTS',
			valueCb: (momentObj: Moment) => momentObj.format(moment.localeData().longDateFormat('LTS'))
		},
		
	]);

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
					} flex flex-col pr-3 max-h-44 pt-1 gap-y-1 rounded-sm transition-all duration-1000`}
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
