console.log('### content-script start ###');
let momentObj; // will hold moment object for valid dates only
let timezone = 'Israel';
const timeOptions = [
	{
		label: 'Local',
		valueCb: (momentObj) =>
			'' + momentObj.toString(),
	},
	{
		label: 'ISO',
		valueCb: (momentObj) =>
			momentObj.toISOString(),
	},
	{
		label: 'UTC',
		valueCb: (momentObj) =>
			momentObj.utc().toString(),
	},
	{
		label: 'Epoch Seconds',
		valueCb: (momentObj) =>
			momentObj.unix().toString(),
	},
	{
		label: 'Epoch Milliseconds',
		valueCb: (momentObj) => '' + momentObj,
	},
	...Object.keys(moment.HTML5_FMT).map((objKey) => {
		return {
			label: objKey
				.split('_')
				.map(
					(word) =>
						word[0].toUpperCase() + word.substring(1).toLowerCase(),
				)
				.join(' '),
			valueCb: (momentObj) =>
				momentObj
					
					.format(moment.HTML5_FMT[objKey]),
		};
	}),
	{
		label: 'L',
		valueCb: (momentObj) =>
			momentObj.format(moment.localeData().longDateFormat('L')),
	},
	{
		label: 'l',
		valueCb: (momentObj) =>
			momentObj.format(moment.localeData().longDateFormat('l')),
	},
	{
		label: 'LL',
		valueCb: (momentObj) =>
			momentObj.format(moment.localeData().longDateFormat('LL')),
	},
	{
		label: 'll',
		valueCb: (momentObj) =>
			momentObj.format(moment.localeData().longDateFormat('ll')),
	},
	{
		label: 'LLL',
		valueCb: (momentObj) =>
			momentObj.format(moment.localeData().longDateFormat('LLL')),
	},
	{
		label: 'lll',
		valueCb: (momentObj) =>
			momentObj.format(moment.localeData().longDateFormat('lll')),
	},
	{
		label: 'LLLL',
		valueCb: (momentObj) =>
			momentObj.format(moment.localeData().longDateFormat('LLLL')),
	},
	{
		label: 'llll',
		valueCb: (momentObj) =>
			momentObj.format(moment.localeData().longDateFormat('llll')),
	},
	{
		label: 'LT',
		valueCb: (momentObj) =>
			momentObj.format(moment.localeData().longDateFormat('LT')),
	},
	{
		label: 'LTS',
		valueCb: (momentObj) =>
			momentObj.format(moment.localeData().longDateFormat('LTS')),
	},
];

document.addEventListener('mouseup', (e) => {
	// or selectionchange

	const selectedText = getSelectedText(document);
	console.log(`selected text = ${selectedText}`);
	const newMomentObj = guessDateFromDateString(selectedText);
	if (selectedText.length > 0 && newMomentObj) {
		momentObj = newMomentObj;
		localStorage.setItem('selectedTimeText', document.getSelection());
		removePopupIframe();
		timePopupIframe(momentObj);
		timeOptions.forEach((obj) => {
			console.log(obj.label + ' --> ' + obj.valueCb(momentObj));
		});
	}
});

const timePopupIframe = (momentObj, offsetX = 5, offsetY = 0) => {
	const { x: fromLeft, y: fromTop } = getSelectionMarkPosition();
	const ifm = document.createElement('iframe');
	ifm.id = 'popupTimeIframe';
	document.body.appendChild(ifm);
	ifm.style = `width: 300px; position: absolute; z-index: 9999; top: ${
		fromTop + offsetY
	}px; left: ${fromLeft + offsetX}px;`;
	ifm.contentWindow.document.write(`
				<head>
					<link rel="stylesheet" href="${chrome.runtime.getURL('popup.css')}"/>
				</head>
				<body>
					<div class="main-div">
						<script src="${chrome.runtime.getURL('/js/popup-iframe-logic.js')}"></script>
						<div>
							<p class="time-para">${momentObj}</p>
						</div>
					</div>
				</body>`);

	// add close button
	const btnCloseIfm = document.createElement('button');
	btnCloseIfm.id = 'closeIframeBtn';
	btnCloseIfm.className = 'close-ifm-btn ';
	btnCloseIfm.innerText = 'x';
	btnCloseIfm.title = 'close';
	ifm.contentWindow.document.body
		.querySelector('div')
		.appendChild(btnCloseIfm);

	// add copy button (img)
	const copyBtn = document.createElement('img');
	copyBtn.src = chrome.runtime.getURL('/images/copy.png');
	copyBtn.alt = 'copy button image';
	copyBtn.className = 'copy-btn';
	ifm.contentWindow.document.body.querySelector('div').appendChild(copyBtn);
	btnCloseIfm.addEventListener('click', removePopupIframe);

	copyBtn.addEventListener('click', (e) => handleCopyBtnClick(e, copyBtn));
};

function handleCopyBtnClick(e, copyBtn) {
	navigator.clipboard.writeText(momentObj).catch(console.log);
	copyBtn.src = chrome.runtime.getURL('/images/checked.png');

	setTimeout(() => {
		copyBtn.src = chrome.runtime.getURL('/images/copy.png');
	}, 1000);
}

function addMomentJsToHead() {
	if (isMomentJsFileAlreadyAdded()) return;
	let s1 = document.createElement('script');
	s1.src = chrome.runtime.getURL('moment.js');
	s1.onload = function () {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s1);

	let s2 = document.createElement('script');
	s2.src = chrome.runtime.getURL('moment-timezone-with-data.js');
	s2.onload = function () {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s2);
}

function isMomentJsFileAlreadyAdded() {
	return document.querySelector(
		`script[src='${chrome.runtime.getURL('/moment.js')}']`,
	)
		? true
		: false;
}

function removePopupIframe() {
	if (!isPopupIframeShown()) return;
	getPopupIframe().remove();
}

function isPopupIframeShown() {
	return getPopupIframe() ? true : false;
}

function getPopupIframe() {
	return document.querySelector(`#popupTimeIframe`);
}

function isTailwindFileAlreadyAdded() {
	return document.querySelector(
		`link[href='${chrome.runtime.getURL('/tailwind.min.css')}']`,
	)
		? true
		: false;
}

function addTailwindFileToHead() {
	if (isTailwindFileAlreadyAdded()) return;
	const link = document.createElement('link');
	link.href = chrome.runtime.getURL('/tailwind.min.css');
	link.rel = 'stylesheet';
	document.head.appendChild(link);

	// document.head.insertAdjacentHTML(
	// 	'beforeend',
	// 	`<link rel="stylesheet" href="${chrome.runtime.getURL(
	// 		'/tailwind.min.css',
	// 	)}" />`,
	// );

	// let s1 = document.createElement('script');
	// s1.src = chrome.runtime.getURL('tailwindcss.js');
	// s1.onload = function () {
	// 	this.remove();
	// };
	// (document.head || document.documentElement).appendChild(s1);
}

function relativeCoordsMouseEventFromBody(event) {
	let bounds = document.body.getBoundingClientRect();
	let x = parseInt(event.clientX - bounds.left);
	let y = parseInt(event.clientY - bounds.top);
	return { x: x, y: y };
}

// atStart: if true, returns coord of the beginning of the selection,
//          if false, returns coord of the end of the selection
function getSelectionCoords(atStart) {
	const sel = document.getSelection();
	const defaultCoords = { x: 0, y: 0 };
	// check if selection exists
	if (!sel.rangeCount) return defaultCoords;

	// get range
	let range = sel.getRangeAt(0).cloneRange();
	if (!range.getClientRects) return defaultCoords;

	// get client rect
	range.collapse(atStart);
	let rects = range.getClientRects();
	if (rects.length <= 0) return defaultCoords;

	// return coord
	let rect = rects[0];

	// find scroll postitions
	let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	// console.log(`scrollTop=${scrollTop} | scrollLeft=${scrollLeft}`);

	return {
		x: parseInt(rect.x + scrollLeft),
		y: parseInt(rect.y + scrollTop),
	};
}

function guessDateFromDateString(dateString) {
	const tz = moment.tz.guess();
	const unixSecondsRegex = new RegExp(/^\d{10}$/);
	const unixMillisRegex = new RegExp(/^\d{13}$/);
	const isUnixSeconds = unixSecondsRegex.test(dateString);
	const isUnixMillis = unixMillisRegex.test(dateString);
	const momentFromString = isUnixSeconds
		? moment.unix(parseInt(dateString)).tz(tz)
		: isUnixMillis
		? moment(parseInt(dateString)).tz(tz)
		: moment.tz(dateString, tz);
	const isValid = momentFromString.isValid();
	console.log('magic moment: ' + momentFromString);

	// console.log(
	// 	`${dateString} is a ${
	// 		isValid ? 'valid date' : 'nope'
	// 	} --- ${momentFromString}`,
	// );
	return isValid ? momentFromString : false;
}

function getSelectedText() {
	let elem = document.activeElement;
	let elemType = elem ? elem.tagName.toLowerCase() : 'none';
	if (elemType === 'input' || elemType === 'textarea') {
		return elem.value.substr(
			elem.selectionStart,
			elem.selectionEnd - elem.selectionStart,
		);
	}

	if (window && window.getSelection) {
		return window.getSelection().toString();
	}

	if (document.selection && document.selection.type !== 'Control') {
		return document.selection.createRange().text;
	}
	return '';
}

const getSelectionMarkPosition = (function () {
	let markerTextChar = '\ufeff';
	let markerTextCharEntity = '&#xfeff;';

	let markerEl,
		markerId =
			'sel_' +
			new Date().getTime() +
			'_' +
			Math.random().toString().substr(2);

	// let selectionEl;

	return function (win) {
		win = win || window;
		let doc = win.document;
		let sel, range;
		// Branch for IE <= 8
		if (doc.selection && doc.selection.createRange) {
			// Clone the TextRange and collapse
			range = doc.selection.createRange().duplicate();
			range.collapse(false);

			// Create the marker element containing a single invisible character by creating literal HTML and insert it
			range.pasteHTML(
				'<span id="' +
					markerId +
					'" style="position: relative;">' +
					markerTextCharEntity +
					'</span>',
			);
			markerEl = doc.getElementById(markerId);
		} else if (win.getSelection) {
			sel = win.getSelection();
			range = sel.getRangeAt(0).cloneRange();
			range.collapse(false);

			// Create the marker element containing a single invisible character using DOM methods and insert it
			markerEl = doc.createElement('span');
			markerEl.id = markerId;
			markerEl.appendChild(doc.createTextNode(markerTextChar));
			range.insertNode(markerEl);
		}

		if (markerEl) {
			// Lazily create element to be placed next to the selection

			// *****************************

			// Find markerEl position http://www.quirksmode.org/js/findpos.html
			let obj = markerEl;
			let left = 0,
				top = 0;
			do {
				left += obj.offsetLeft;
				top += obj.offsetTop;
			} while ((obj = obj.offsetParent));
			markerEl.parentNode.removeChild(markerEl);
			return { x: left, y: top };

			// if (!selectionEl) {
			// 	// selectionEl = doc.createElement('div');
			// 	// selectionEl.style.border = 'solid darkblue 1px';
			// 	// selectionEl.style.backgroundColor = 'lightgoldenrodyellow';
			// 	// selectionEl.innerHTML = '&lt;- selection';
			// 	// selectionEl.style.position = 'absolute';
			// 	removePopupIframe()
			// 	selectionEl = doc.createElement('iframe');
			// 	selectionEl.id = 'popupTimeIframe';
			// 	selectionEl.style = `position: absolute; z-index: 9999; left: ${left}px; top: ${top}px;`;
			// 	doc.body.appendChild(selectionEl);
			// 	selectionEl.contentWindow.document
			// 		.write(`<body class="bg-indigo-300 bg-opa p-4 rounded-lg">
			// 					<script src="${chrome.runtime.getURL('tailwind.js')}"></script>
			// 					<p class="text-xs font-mono">${momentObj}</p>
			// 				</body>`);
			// }

			// Move the button into place.
			// Substitute your jQuery stuff in here
			// selectionEl.style.left = left + 'px';
			// selectionEl.style.top = top + 'px';
		}
	};
})();

console.log('### content-script end ###');
