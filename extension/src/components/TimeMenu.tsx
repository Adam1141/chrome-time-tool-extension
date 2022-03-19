import React, { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import TimeMenuItem from './TimeMenuItem';
import { Scrollbars } from 'react-custom-scrollbars-2';


interface TimeMenuProps {
	dateObj: Date;
	timeOptions: {
		label: String;
		valueCb: (dateObj: Date) => String;
	}[];
}

const TimeMenu: FC<TimeMenuProps> = ({ dateObj, timeOptions }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [timeToShowListItem, setTimeToShowListItem] = useState(50);

	function handleMenuToggle(e: React.MouseEvent): void {
		setIsMenuOpen((cur) => !cur);
	}

	return (
		<div>
			<TimeMenuItem
				label={timeOptions[0].label}
				value={timeOptions[0].valueCb(dateObj)}
				isMenuOpen={isMenuOpen}
				setIsMenuOpen={setIsMenuOpen}
				isFirstInList={true}
			/>
			<Scrollbars autoHeight style={{}}>
				<div
					className={`${
						isMenuOpen ? '' : 'hidden'
					} flex flex-col max-h-80 gap-y-1 bg-indigo-100 rounded-sm transition-all duration-1000`}
				>
					{isMenuOpen &&
						timeOptions.map((timeOption, idx) => {
							return (
								idx != 0 && (
									<TimeMenuItem
										key={idx}
										label={timeOption.label}
										value={timeOption.valueCb(dateObj)}
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
