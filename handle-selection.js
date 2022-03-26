console.log(123123123);
const body = document.body;

body.addEventListener('mouseup', (e) => {
	const doc = e.target.ownerDocument;
	const body = e.target.ownerDocument.body;

	console.log(`selected text = ${document.getSelection()}`);
	localStorage.setItem('selectedTimeText', document.getSelection());
	showPopupIframeSelectionPosition(doc);
});

function showPopupIframeSelectionPosition(doc, offsetX = 5, offsetY = 0) {
	addTailwindFileToHead(doc);
	addMomentJsToHead(doc);
	const { x: fromLeft, y: fromTop } = getSelectionCoords(doc, false);
	// console.log(`fromLeft=${fromLeft} | fromTop=${fromTop}`);
	if (isPopupIframeShown(doc)) removePopupIframe(doc);
	const popupIframe = `<iframe id='popupIframe' seamless style='top: ${
		fromTop + offsetX
	}px; left: ${
		fromLeft + offsetY
	}px; z-index: 9999;' class='absolute w-56 rounded-lg overflow-hidden' src='${chrome.runtime.getURL(
		'/selection-popup.html',
	)}' title='On-Selection Popup'></iframe>`;
	body.insertAdjacentHTML('afterbegin', popupIframe);
}

function showPopupIframeMouseUpPosition(
	doc,
	mouseEvent,
	offsetX = 5,
	offsetY = 0,
) {
	addTailwindFileToHead(doc);
	const { x: fromLeft, y: fromTop } = relativeCoordsMouseEventFromBody(
		doc,
		mouseEvent,
	);
	// console.log(`fromLeft=${fromLeft} | fromTop=${fromTop}`);
	if (isPopupIframeShown(doc)) removePopupIframe(doc);
	const popupIframe = `<iframe id='popupIframe' style='top: ${
		fromTop + offsetX
	}px; left: ${
		fromLeft + offsetY
	}px; z-index: 9999;' class='absolute w-56 rounded-lg overflow-hidden' src='${chrome.runtime.getURL(
		'/selection-popup.html',
	)}' title='On-Selection Popup'></iframe>`;
	body.insertAdjacentHTML('afterbegin', popupIframe);
}

function addMomentJsToHead(doc) {
	if (isMomentJsFileAlreadyAdded(doc)) return;
	doc.head.insertAdjacentHTML(
		'beforeend',
		`<script type="text/javascript" src="${chrome.runtime.getURL(
			'/moment.js',
		)}" ></script>`,
	);
	doc.head.insertAdjacentHTML(
		'beforeend',
		`<script type="text/javascript" src="${chrome.runtime.getURL(
			'/moment-timezone-with-data.js',
		)}" ></script>`,
	);
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
	return doc.querySelector(`#popupIframe`);
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
	doc.head.insertAdjacentHTML(
		'beforeend',
		`<link rel="stylesheet" href="${chrome.runtime.getURL(
			'/tailwind.min.css',
		)}" />`,
	);
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

	// check if selection exists
	if (!sel.rangeCount) return null;

	// get range
	let range = sel.getRangeAt(0).cloneRange();
	if (!range.getClientRects) return null;

	// get client rect
	range.collapse(atStart);
	let rects = range.getClientRects();
	if (rects.length <= 0) return null;

	// return coord
	let rect = rects[0];

	// find scroll postitions
	let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	// console.log(`scrollTop=${scrollTop} | scrollLeft=${scrollLeft}`);

	return { x: rect.x + scrollLeft, y: rect.y + scrollTop };
}
console.log('bananas');
