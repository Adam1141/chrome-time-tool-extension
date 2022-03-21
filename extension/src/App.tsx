import { FC, useEffect, useRef, useState } from 'react';
import TimeMenu from './components/TimeMenu';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import './index.css';
import TimeMenuWithOptions from './components/TimeMenuWithOptions';

const App: FC = () => {
	const [date, setDate] = useState(new Date());
	const [isRealtimeUpdateOn, setIsRealtimeUpdateOn] = useState(true);

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

	// delete later
	const counter = useRef(0);
	useEffect(() => {
		counter.current++;
		console.log(`rendered ${counter.current} times`);
	});

	return (
		<div className="flex flex-col bg-indigo-50 max-w-xl w-auto p-2 ">
			<h1 className="bg-indigo-200 text-center text-2xl py-4 rounded-sm">
				Time Tool
			</h1>

			<TimeMenuWithOptions
				isRealtimeUpdateOn={isRealtimeUpdateOn}
				setIsRealtimeUpdateOn={setIsRealtimeUpdateOn}
				initialDate={new Date(date)}
				setDate={setDate}
			/>
		</div>
	);
};

export default App;
