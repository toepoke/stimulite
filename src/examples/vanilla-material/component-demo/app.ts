/// <reference path="../../../stimulite/stimulite.ts" />

class MaterialExamplesController extends Controller {
	protected _matButtons: Array<Element> = null;
	protected _matTextFields: Array<Element> = null;

	constructor(name: string, application: Application, element: Element) {
		super(name, application, element);
	}

	public Connect(): void {
		this._application.warn("Connect!");
		this.attachButtonRipples();
		// this.attachControls();
			// @ts-ignore
		mdc.autoInit();

		//this._element.querySelector(".clicky")
			//.addEventListener("click", (e: Event) => this.detachButtonRipples() )
	}

	/**
	 * Note you can just add data-mdc-auto-init="MDCRipple" 
	 * to the markup, but this makes it noisey, hence js it up
	 */
	private attachButtonRipples(): void {
		this._matButtons = [];
		const domButtons = this._element.querySelectorAll("[mdl-button]");

		for (let i=0; i < domButtons.length; i++) {
			let btn = domButtons[i];

			// @ts-ignore
			let matBtn = mdc.ripple.MDCRipple.attachTo(btn);
			this._matButtons.push(matBtn);
		}
	}

	private attachControls(): void {
		this._matTextFields = [];
		const domFields = this._element.querySelectorAll(".mdc-text-field");
		const domLabels = this._element.querySelectorAll(".mdc-floating-label");

		for (let i=0; i < domFields.length; i++) {
			let textField = domFields[i];
			// @ts-ignore
			let matTextField = new mdc.textField.MDCTextField(textField);
		}

		for (let i=0; i < domLabels.length; i++) {
			let labelField = domLabels[i];
			// @ts-ignore
			let matLabel = new mdc.floatingLabel.MDCFloatingLabel(labelField);
		}
	}



	private detachButtonRipples(): void {
		for (let i=0; i < this._matButtons.length; i++) {
			let btn = this._matButtons[i];
			// @ts-ignore
			btn.destroy();
		}
	}

} // MaterialExamplesController


// IE9+
document.addEventListener("DOMContentLoaded", function() {
	const debugOn: boolean = true;

	console.warn("Document Ready!");

	const a = new Application(window, document.documentElement, debugOn);
	
	// setTimeout(() => {
	// 	a.Disconnect();
	// }, 5000);

});

