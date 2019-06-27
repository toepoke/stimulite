/// <reference path="./application-event.ts" />
/// <reference path="./controller.ts" />

/**
 * In effect, the application is the page on which all controllers reside.
 */
class Application {
	protected _window: Window;
	protected _element: Element;
	protected _controllers: Array<Controller>;
	protected _debugOn: boolean = false;

	/**
	 * Application constructor
	 * @param window  - Reference to the global Window object
	 * @param element - HTML document element
	 * @param debugOn - Flags whether debugging is enabled for the application (basically enables console logging)
	 */
	constructor(window: Window, element?: Element, debugOn: boolean = false) {
		this._window = window;
		this._element = element;
		this._debugOn = debugOn;
		this.FindControllers();
		this.ConnectionComplete();
	}

	public get Window(): Window {
		return this._window;
	}

	/**
	 * Broadcasts an event from controller (a) to all other controllers on the page
	 * Example:
	 *    this.application.BroadcastEvent({
	 *       name: "testy::mctesty",
	 *       payload: {
	 *          hi: "Hello there!"
	 *       }
	 *    });
	 */
	public BroadcastEvent(evt: ApplicationEvent): void {
		for (const ctrl of this._controllers) {
			// todo: Exclude sending controller from broadcast
			ctrl.Subscription(evt);
		}
	}

	/**
	 * Disconnects all controllers
	 */
	public Disconnect(): void {
		for (const ctrl of this._controllers) {
			ctrl.Disconnect();
		}
	}

	/**
	 * Messages all controllers telling them the are connected (i.e. stimulite is setup and ready)
	 */
	private ConnectionComplete(): void {
		for (const ctrl of this._controllers) {
			ctrl.Connect();
		}
	}

	/**
	 * If debugging is enabled, adds a warning entry into the console log.
	 * @param message - Message to write
	 * @param optionalParams - Additional data
	 */
	public warn(message?: any, ...optionalParams: any[]): void {
		if (this._debugOn && console.warn) {
			console.warn(message, optionalParams);
		}
	}

	/**
	 * If debugging is enabled, adds an entry into the console log.
	 * @param message - Message to write
	 * @param optionalParams - Additional data
	 */
	public log(message?: any, ...optionalParams: any[]): void {
		if (this._debugOn && console.log) {
			console.log(message, optionalParams);
		}
	}

	/**
	 * If debugging is enabled, adds an info entry into the console log.
	 * @param message - Message to write
	 * @param optionalParams - Additional data
	 */
	public info(message?: any, ...optionalParams: any[]): void {
		if (this._debugOn && console.log) {
			console.info(message, optionalParams);
		}
	}

	/**
	 * Finds all the elements on the page that have a "data-controller" attribute and creates
	 * an object for the controller.
	 */
	private FindControllers(): void {
		const ctrlDomNodes: NodeListOf<Element> = this._element.querySelectorAll("[data-controller");
		this._controllers = new Array<Controller>();
		for (var i=0; i < ctrlDomNodes.length; i++) {
			const ctrlDomNode = ctrlDomNodes[i];
			const ctrlName = this.toControllerName(ctrlDomNode.getAttribute("data-controller"));
			const application: Application = this;
			const controller: Controller = new (<any>this._window)[ctrlName](ctrlName, application, ctrlDomNode);

			this._controllers.push(controller);
		}
	}

	/**
	 * Converts the given attribute value (in kebab-case) and returns in CapitalCase, appending
	 * Controller at the end.  For example "side-picker" becomes "SidePickerController".
	 * This overcomes the fact that attribute keys with Capitals or Whitespace are not valid.
	 * @param str - html attribute value in kebab-case, e.g. "side-picker"
	 */
	private toControllerName(str: string): string {
		let ctrlName: string = '';
		ctrlName = str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function (match) {
			match = match.replace('-','');
			return match.toUpperCase();
		});

		if (!this.endsWith(ctrlName, "Controller")) {
			ctrlName += "Controller";
		}

		return ctrlName;
	}

	private endsWith(value: string, search: string): boolean {
		const len = (value === undefined ? 0 : value.length);

		return value.substring(len - search.length, len) === search;
	}

}

