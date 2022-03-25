import { FC, useEffect, useRef, useState } from 'react';
import TimeMenu from './components/TimeMenu';
import 'tippy.js/dist/tippy.css';
import './index.css';
import TimeMenuWithOptions from './components/TimeMenuWithOptions';
import moment from 'moment-timezone';

const App: FC = () => {
	const selectedTimezone = useRef(moment.tz.guess());
	const [isRealtimeUpdateOn, setIsRealtimeUpdateOn] = useState(true);
	const [globMoment, setGlobMoment] = useState(
		moment().tz(selectedTimezone.current),
	);
	// moment.locale('fr');
	return (
		<div className="flex flex-col bg-indigo-50 max-w-xl p-2 h-full">
			<h1 className="bg-indigo-200 text-center text-2xl py-4 rounded-sm">
				Time Tool
			</h1>

			<TimeMenuWithOptions
				isRealtimeUpdateOn={isRealtimeUpdateOn}
				setIsRealtimeUpdateOn={setIsRealtimeUpdateOn}
				initialMoment={globMoment}
				setGlobMoment={setGlobMoment}
				selectedTimezone={selectedTimezone}
			/>
		</div>
	);
};

export default App;
