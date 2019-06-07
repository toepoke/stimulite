
// ie9 dragstart event doesn't fire if you use a div.
// this works around it by repurposing the "selectstart" event
// see https://stackoverflow.com/questions/5500615/internet-explorer-9-drag-and-drop-dnd/30177424#30177424
if (document.doctype && navigator.appVersion.indexOf("MSIE 9") > -1) {
	document.addEventListener('selectstart', function (e) {
		for (var el = e.target; el; el = el.parentNode) {
			if (el.attributes && el.attributes['draggable']) {
				e.preventDefault();
				e.stopImmediatePropagation();
				el.dragDrop();
				return false;
			}
		}
	});
}


