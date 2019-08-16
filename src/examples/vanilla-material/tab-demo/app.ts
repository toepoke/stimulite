/// <reference path="../../../stimulite/stimulite.ts" />
/// <reference path="../_mdc-helpers/mdc-tab-helper.ts" />

class MyTabs extends MdcTabHelper {
	constructor(tabBarElement: HTMLElement, selectedIndex: number = 0) {
		super(tabBarElement, selectedIndex);
	}

	onActivatedTab(tabChanged: MdcTabEvent_TabChange): void {
		console.log("Selected", tabChanged);
	}
}

class TabDemoController extends Controller {
	protected _matButtons: Array<HTMLElement> = null;
	protected _matTextFields: Array<HTMLElement> = null;
	protected _myTabs: MyTabs = null;

	constructor(name: string, application: Application, element: HTMLElement) {
		super(name, application, element);
	}

	public Connect(): void {
		const domTabBar = <HTMLElement>this._element.querySelector(".mdc-tab-bar");
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

