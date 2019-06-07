
function monitorEvents(element) {
	var log = function(e) { console.log(e); }	
	var events = [];

	for (var i in element) {
		if (i.substr(0,2) === "on")
			events.push(i.substr(2));
	}
	events.forEach(function(eventName) {
		element.addEventListener(eventName, log);		
	});
}


