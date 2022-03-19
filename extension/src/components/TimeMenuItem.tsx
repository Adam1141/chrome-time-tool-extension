import React, { FC, useEffect, useRef, useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import { AiOutlineDown } from 'react-icons/ai';
import { BsFillCheckCircleFill } from 'react-icons/bs';

interface TimeMenuItemProps {
	label: String;
	value: String;
	showAfterMs?: number;
	isMenuOpen?: boolean;
	setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	isFirstInList?: boolean;
}

const TimeMenuItem: FC<TimeMenuItemProps> = ({
	label,
	value,
	isMenuOpen,
	setIsMenuOpen,
	isFirstInList,
	showAfterMs = 0,
}) => {
	const item = useRef<null | HTMLDivElement>(null);
	const copyHint = useRef<null | HTMLParagraphElement>(null);
	const [isCopiedRightNow, setIsCopiedRightNow] = useState(false);

	function handleCopyClick(e: React.MouseEvent): void {
		navigator.clipboard.writeText('' + value).catch(console.log);
		setIsCopiedRightNow(true);
		setTimeout(() => {
			setIsCopiedRightNow(false);
		}, 1000);
	}

	function handleMenuToggle(e: React.MouseEvent): void {
		setIsMenuOpen && setIsMenuOpen((cur) => !cur);
	}

	useEffect(() => {
		setTimeout(() => {
			item.current && (item.current.style.opacity = '1');
		}, showAfterMs);
	}, []);

	return (
		<div
			ref={item}
			className={`${
				isFirstInList ? 'mb-1' : ''
			} opacity-0 bg-indigo-200 flex justify-between font-mono rounded-md transition-all`}
		>
			<div className="flex overflow-hidden">
				<p className="bg-indigo-500 text-gray-200 text-xs font-bold rounded-l-md px-2 mr-4 whitespace-nowrap flex items-center ">
					{label}
				</p>
				<p className="my-2 text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis leading-6">
					{value}
				</p>
			</div>
			<div className="m-2 flex flex-row-reverse gap-x-1">
				{isFirstInList && (
					<p
						className={`${
							isMenuOpen ? '-rotate-180' : ''
						} select-none hover:scale-110 hover:cursor-pointer transition-all duration-500 flex items-center mx-2`}
						onClick={handleMenuToggle}
					>
						<AiOutlineDown className="text-gray-400 text-lg scale-x-150" />
					</p>
				)}
				{isCopiedRightNow ? (
					<BsFillCheckCircleFill className="text-indigo-700 text-xl mr-1 duration-200 peer" />
				) : (
					<FaCopy
						onClick={handleCopyClick}
						id="btn-copy"
						className="text-indigo-700 text-xl mr-1 hover:cursor-pointer hover:opacity-80 duration-200 peer"
					/>
				)}

				<p
					ref={copyHint}
					className="scale-0 bg-indigo-100 text-indigo-700 font-bold rounded-2xl py-1 px-2 text-xs w-max duration-200 peer-hover:delay-700 peer-hover:scale-100 peer-hover:rotate-6"
				>
					Copy
				</p>
			</div>
		</div>
	);
};

export default TimeMenuItem;
