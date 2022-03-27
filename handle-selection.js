console.log('### content-script start ###');
const body = document.body;
addMomentJsToHead(document);
addTailwindFileToHead(document);
body.addEventListener('mouseup', (e) => {
	const doc = e.target.ownerDocument;
	const body = e.target.ownerDocument.body;
	const selectedText = getSelectedText(doc);
	console.log(`selected text = ${selectedText}`);
	localStorage.setItem('selectedTimeText', doc.getSelection());

	if (selectedText.length > 0 && guessDateFromDateString(selectedText)) {
		showPopupDivSelectionPosition(
			doc,
			moment(guessDateFromDateString(selectedText)),
		);
	}
	// showPopupIframeMouseUpPosition(doc, e);
});

function showPopupDivSelectionPosition(
	doc,
	momentObj = 123123,
	offsetX = 5,
	offsetY = 0,
) {
	const { x: fromLeft, y: fromTop } = getSelectionCoords(doc, false);
	console.log(`fromLeft=${fromLeft} | fromTop=${fromTop}`);
	if (isPopupIframeShown(doc)) removePopupIframe(doc);
	const popupDiv = `<div id='popupDiv' style='top: ${
		fromTop + offsetY
	}px; left: ${
		fromLeft + offsetX
	}px; z-index: 9999;' class='absolute w-56 rounded-lg overflow-hidden bg-indigo-300/50'>
	<h1 id="popup-time" class="text-center text-2xl font-semibold">${momentObj.toString()}</h1>
	</div>`;
	doc.body.insertAdjacentHTML('afterbegin', popupDiv);
}

function showPopupIframeMouseUpPosition(
	doc,
	mouseEvent,
	offsetX = 5,
	offsetY = 0,
) {
	addTailwindFileToHead(doc);
	// addMomentJsToHead(doc);
	const { x: fromLeft, y: fromTop } = relativeCoordsMouseEventFromBody(
		doc,
		mouseEvent,
	);
	// console.log(`fromLeft=${fromLeft} | fromTop=${fromTop}`);
	if (isPopupIframeShown(doc)) removePopupIframe(doc);
	const popupDiv = `<iframe id='popupDiv' style='top: ${
		fromTop + offsetX
	}px; left: ${
		fromLeft + offsetY
	}px; z-index: 9999;' class='absolute w-56 rounded-lg overflow-hidden' src='${chrome.runtime.getURL(
		'/selection-popup.html',
	)}' title='On-Selection Popup'></iframe>`;
	body.insertAdjacentHTML('afterbegin', popupDiv);
}

function addMomentJsToHead(doc) {
	if (isMomentJsFileAlreadyAdded(doc)) return;
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

function isMomentJsFileAlreadyAdded(doc) {
	return doc.querySelector(
		`script[src='${chrome.runtime.getURL('/moment.js')}']`,
	)
		? true
		: false;
}

function removePopupIframe(doc) {
	if (!isPopupIframeShown(doc)) return;
	getPopupIframe(doc).remove();
}

function isPopupIframeShown(doc) {
	return getPopupIframe(doc) ? true : false;
}

function getPopupIframe(doc) {
	return doc.querySelector(`#popupDiv`);
}

function isTailwindFileAlreadyAdded(doc) {
	return doc.querySelector(
		`link[href='${chrome.runtime.getURL('/tailwind.min.css')}']`,
	)
		? true
		: false;
}

function addTailwindFileToHead(doc) {
	if (isTailwindFileAlreadyAdded(doc)) return;
	// doc.head.insertAdjacentHTML(
	// 	'beforeend',
	// 	`<link rel="stylesheet" href="${chrome.runtime.getURL(
	// 		'/tailwind.min.css',
	// 	)}" />`,
	// );
	let s1 = document.createElement('script');
	s1.src = chrome.runtime.getURL('tailwindcss.js');
	s1.onload = function () {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s1);

	// let l1 = document.createElement('link');
	// l1.href = chrome.runtime.getURL('tailwind.min.css');
	// l1.type = 'stylesheet';
	// l1.onload = function () {
	// 	this.remove();
	// };
	// (document.head || document.documentElement).appendChild(l1);
}

function relativeCoordsMouseEventFromBody(doc, event) {
	var bounds = doc.body.getBoundingClientRect();
	var x = parseInt(event.clientX - bounds.left);
	var y = parseInt(event.clientY - bounds.top);
	return { x: x, y: y };
}

// atStart: if true, returns coord of the beginning of the selection,
//          if false, returns coord of the end of the selection
function getSelectionCoords(doc, atStart) {
	const sel = doc.getSelection();
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
	const tz = 'Israel';
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

function getSelectedText(doc) {
	let elem = doc.activeElement;
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

	if (doc.selection && doc.selection.type !== 'Control') {
		return doc.selection.createRange().text;
	}
	return '';
}

console.log('### content-script end ###');
