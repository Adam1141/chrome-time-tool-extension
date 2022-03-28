// console.log('### content-script start ###');
let momentObj; // will hold moment object for valid dates only
let timezone = localStorage.getItem('timezone') || moment.tz.guess();
let isMagicPopupOn = localStorage.getItem('isMagicPopupOn') || true;
let minDateStrLength = localStorage.getItem('minDateStrLength') || 8;
let maxDateStrLength = localStorage.getItem('maxDateStrLength') || 50;




const timeOptions = [
	{
		label: 'Local',
		valueCb: (momentObj) => '' + momentObj.tz(timezone).toString(),
	},
	{
		label: 'ISO',
		valueCb: (momentObj) => momentObj.tz(timezone).toISOString(),
	},
	{
		label: 'UTC',
		valueCb: (momentObj) => momentObj.tz(timezone).utc().toString(),
	},
	{
		label: 'Epoch Seconds',
		valueCb: (momentObj) => momentObj.tz(timezone).unix().toString(),
	},
	{
		label: 'Epoch Milliseconds',
		valueCb: (momentObj) => '' + momentObj.tz(timezone),
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
			valueCb: (momentObj) => momentObj.format(moment.HTML5_FMT[objKey]),
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

if (isMagicPopupOn) {
	document.addEventListener('keyup', handleKeyupEvent);
	document.addEventListener('mouseup', handleMouseupEvent);
	window.addEventListener('resize', handleResizeEvent);
} else {
	document.removeEventListener('keyup', handleKeyupEvent);
	document.removeEventListener('mouseup', handleMouseupEvent);
	window.removeEventListener('resize', handleResizeEvent);
}

const timePopupIframe = (momentObj, offsetX = 5, offsetY = 0) => {
	const { x: fromLeft, y: fromTop } = getSelectionMarkPosition();
	const ifm = document.createElement('iframe');
	ifm.id = 'popupTimeIframe';
	document.body.appendChild(ifm);
	ifm.style = `border: 0; outline: 0; backgorund: transparent; width: 350px; position: absolute; z-index: 9999; top: ${
		fromTop + offsetY
	}px; left: ${fromLeft + offsetX}px;`;
	ifm.contentWindow.document.write(`
				<head>
					<link rel="stylesheet" href="${chrome.runtime.getURL('/styles/popup.css')}"/>
					<link rel="stylesheet" href="${chrome.runtime.getURL(
						'/styles/normalize.css',
					)}"/>
				</head>
				<body>
					<div class="main-div">
						<script src="${chrome.runtime.getURL('/js/popup-iframe-logic.js')}"></script>
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

	btnCloseIfm.addEventListener('click', removePopupIframe);

	timeOptions.forEach((obj) => {
		// create time div

		const timeDiv = document.createElement('div');
		timeDiv.className = 'time-div';

		// add copy button (img)
		const copyBtn = document.createElement('img');
		copyBtn.src = chrome.runtime.getURL('/images/copy.png');
		copyBtn.alt = 'copy button image';
		copyBtn.className = 'copy-btn';
		copyBtn.addEventListener('click', (e) =>
			handleCopyBtnClick(e, copyBtn, obj.valueCb(momentObj)),
		);

		// add time para
		const timePara = document.createElement('p');
		timePara.className = 'time-para';
		timePara.innerText = obj.valueCb(momentObj);

		// add time format label
		const formatLabel = document.createElement('p');
		formatLabel.innerHTML = `<abbr title="${obj.label}">${obj.label}</abbr>`;
		formatLabel.className = 'time-format-label';

		timeDiv.appendChild(copyBtn);
		timeDiv.appendChild(timePara);
		timeDiv.appendChild(formatLabel);

		// append timeDiv to ifm main-div

		ifm.contentWindow.document.body
			.querySelector('.main-div')
			.appendChild(timeDiv);
	});

	preventIfmOutsideBody(ifm);
};

function preventIfmOutsideBody(ifm) {
	const bodyWidth = document.body.clientWidth;
	const ifmFromLeft = ifm.getBoundingClientRect().x;
	const ifmWidth = ifm.getBoundingClientRect().width;
	const pixelsOutsideOfBody = ifmWidth + ifmFromLeft - bodyWidth;
	if (pixelsOutsideOfBody > 0) {
		ifm.style.left = `${ifmFromLeft - pixelsOutsideOfBody}px`;
	}
}

function handleKeyupEvent(e) {
	if (e.key === 'Escape') {
		// on ESC keyup close iframe if it is already open
		// console.log('ESC keyup!!!');
		removePopupIframe();
	}
}

function handleMouseupEvent(e) {
	const selectedText = getSelectedText(document);
	// console.log(`selected text = ${selectedText}`);
	const newMomentObj = guessDateFromDateString(selectedText);
	if (selectedText.length > 0 && newMomentObj) {
		momentObj = newMomentObj;
		localStorage.setItem('selectedTimeText', document.getSelection());
		removePopupIframe();
		timePopupIframe(momentObj);
	}
}

function handleResizeEvent(e) {
	removePopupIframe();
}

function handleCopyBtnClick(e, copyBtn, stringValue = momentObj) {
	copyTextToClipboard(stringValue);
	copyBtn.src = chrome.runtime.getURL('/images/checked.png');

	const timeDivLabel = copyBtn.parentNode.querySelector('.time-format-label');
	const labelInnerHTML = timeDivLabel.innerHTML;
	timeDivLabel.innerText = 'COPIED';
	setTimeout(() => {
		copyBtn.src = chrome.runtime.getURL('/images/copy.png');
		timeDivLabel.innerHTML = labelInnerHTML;
	}, 1000);
}

function copyTextToClipboard(text) {
	if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(text);
		return;
	}
	var textArea = document.createElement('textarea');

	//
	// *** This styling is an extra step which is likely not required. ***
	//
	// Why is it here? To ensure:
	// 1. the element is able to have focus and selection.
	// 2. if the element was to flash render it has minimal visual impact.
	// 3. less flakyness with selection and copying which **might** occur if
	//    the textarea element is not visible.
	//
	// The likelihood is the element won't even render, not even a
	// flash, so some of these are just precautions. However in
	// Internet Explorer the element is visible whilst the popup
	// box asking the user for permission for the web page to
	// copy to the clipboard.
	//

	// Place in the top-left corner of screen regardless of scroll position.
	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;

	// Ensure it has a small width and height. Setting to 1px / 1em
	// doesn't work as this gives a negative w/h on some browsers.
	textArea.style.width = '2em';
	textArea.style.height = '2em';

	// We don't need padding, reducing the size if it does flash render.
	textArea.style.padding = 0;

	// Clean up any borders.
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';

	// Avoid flash of the white box if rendered for any reason.
	textArea.style.background = 'transparent';

	textArea.value = text;

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Copying text command was ' + msg);
	} catch (err) {
		console.log('Oops, unable to copy');
	}

	document.body.removeChild(textArea);
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
	if (
		!isMagicPopupOn ||
		dateString.length < minDateStrLength ||
		dateString.length > maxDateStrLength
	)
		return false;
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
	// console.log('magic moment: ' + momentFromString);

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

// console.log('### content-script end ###');
