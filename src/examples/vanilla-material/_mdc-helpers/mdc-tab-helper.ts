/// <reference path="../../../stimulite/stimulite.ts" />

interface MdcTabEvent_TabChange {
	index: number;
	content: Element;
}

abstract class MdcTabHelper {
	private _tabBarElement: Element = null;
	// @ts-ignore
	private _tabBar: mdc.tabBar.MDCTabBar = null;
	private _totalTabs: number = 0;
	private _panes = new Array<Element>();

	constructor(tabBarElement: Element, selectedIndex: number = 0) {
		this._tabBarElement = tabBarElement;
		// @ts-ignore
		this._tabBar = new mdc.tabBar.MDCTabBar(this._tabBarElement);
		this.initialise(selectedIndex);
		this.activatedTabHandler();
		
		this.selectTab(selectedIndex);
	}
	
	activatedTabHandler(): void {
		this._tabBar.listen("MDCTabBar:activated", (event) => {
			const newIndex: number = event.detail.index;
			const currActive = this._tabBarElement.parentElement.querySelector(".tab-content--active");
			const toActivate = this._panes[newIndex];
			
			// hide currently active
			currActive.classList.remove("tab-content--active", "show");
			currActive.classList.add("hide");

			// show new active tab
			toActivate.classList.add("tab-content--active", "show");
			toActivate.classList.remove("hide");

			this.onActivatedTab({
				index: newIndex,
				content: this._panes[newIndex]
			});
		});
	}

	initialise(selectedIndex: number): void {
		// how many tabs are we dealing with?
		const tabs = this._tabBarElement.querySelectorAll(".mdc-tab");
		this._totalTabs = tabs.length;

		// Find the content sections
		let index: number = 0;
		let currSection: Element = this._tabBarElement;
		for (let i=0; i < this._totalTabs; i++) {
			currSection = currSection.nextElementSibling;
			currSection.classList.add("tab-content");
			this._panes.push(currSection);
		}

		this._panes[selectedIndex].classList.add("tab-content--active", "show");

		console.log(this._panes);
	}

	selectTab(index: number): void {
		this._tabBar.activateTab(index);
	}

	onActivatedTab(tabChangeEvent: MdcTabEvent_TabChange): void {
		// TODO: Implement this to get events fired when tab changes
	}

}