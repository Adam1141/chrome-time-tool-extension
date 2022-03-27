console.log('### content-script start ###');

document.addEventListener('mouseup', (e) => {
	// or selectionchange
	const selectedText = getSelectedText(document);
	console.log(`selected text = ${selectedText}`);
	localStorage.setItem('selectedTimeText', document.getSelection());
	const momentObj = guessDateFromDateString(selectedText);
	if (selectedText.length > 0 && momentObj) {
		// showPopupDivSelectionPosition(
		// 	document,
		// 	moment(guessDateFromDateString(selectedText)),
		// );
		removePopupIframe();

		timePopupIframe(momentObj);
	}
	// showPopupIframeMouseUpPosition(document, e);
});

const timePopupIframe = (momentObj) => {
	const { x: fromLeft, y: fromTop } = getSelectionCoords(false);
	const ifm = document.createElement('iframe');
	ifm.id = 'popupTimeIframe';
	document.body.appendChild(ifm);
	ifm.style = `position: absolute; z-index: 9999; top: ${fromTop}px; left: ${fromLeft}px;`;
	ifm.contentWindow.document
		.write(`<body class="bg-indigo-300 bg-opacity-40 p-4 rounded-lg">
					<script src="${chrome.runtime.getURL('tailwind.js')}"></script>
					<p class="text-xs font-mono">${momentObj}</p>
				</body>`);

	// `
	// <iframe style="position: absolute; z-index: 9999; top: ${fromTop}px; left: ${fromLeft}px;">
	// 	<!DOCTYPE html>
	// 	<html>
	// 		<head>
	// 			<script defer src="${chrome.runtime.getURL('moment.js')}"></script>
	// 			<script defer src="${chrome.runtime.getURL(
	// 				'moment-timezone-with-data.js',
	// 			)}"></script>
	// 			<link rel="stylesheet" href="${chrome.runtime.getURL('tailwind.min.css')}">
	// 		</head>
	// 		<body class="bg-indigo-300 p-4 rounded-lg">
	// 		<script defer src="${chrome.runtime.getURL('moment.js')}"></script>
	// 			<script defer src="${chrome.runtime.getURL(
	// 				'moment-timezone-with-data.js',
	// 			)}"></script>
	// 			<link rel="stylesheet" href="${chrome.runtime.getURL('tailwind.min.css')}">
	// 			<p class="text-md font-mono">${momentObj}</p>
	// 		</body>
	// 	</html>
	// </iframe>
	// `;
};

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
	var bounds = document.body.getBoundingClientRect();
	var x = parseInt(event.clientX - bounds.left);
	var y = parseInt(event.clientY - bounds.top);
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
	return isValid ? momentFromString.toString() : false;
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

console.log('### content-script end ###');
