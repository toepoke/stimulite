/// <reference path="../../../stimulite/stimulite.ts" />
/// <reference path="../_mdc-helpers/mdc-tab-helper.ts" />

class MyTabs extends MdcTabHelper {
	constructor(tabBarElement: Element, selectedIndex: number = 0) {
		super(tabBarElement, selectedIndex);
	}

	onActivatedTab(tabChanged: MdcTabEvent_TabChange): void {
		console.log("Selected", tabChanged);
	}
}

class TabDemoController extends Controller {
	protected _matButtons: Array<Element> = null;
	protected _matTextFields: Array<Element> = null;
	protected _myTabs: MyTabs = null;

	constructor(name: string, application: Application, element: Element) {
		super(name, application, element);
	}

	public Connect(): void {
		const domTabBar = this._element.querySelector(".mdc-tab-bar");
		this._myTabs = new MyTabs(domTabBar, 1);		
	}

} // TabDemoController


// IE9+
document.addEventListener("DOMContentLoaded", function() {
	const debugOn: boolean = true;

	console.warn("Document Ready!");

	const a = new Application(window, document.documentElement, debugOn);
	
	// setTimeout(() => {
	// 	a.Disconnect();
	// }, 5000);

});

