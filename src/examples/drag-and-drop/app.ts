

// IE9+
document.addEventListener("DOMContentLoaded", function() {
	const debugOn: boolean = true;

	console.warn("Document Ready!");

	const a = new Application(window, document.documentElement, debugOn);
	
	// setTimeout(() => {
	// 	a.Disconnect();
	// }, 5000);

});

