/// <reference path="./application-event.ts" />
/// <reference path="./controller.ts" />

type outSignature = (message: string, ...optionalParams: any[]) => void;

/**
 * In effect, the application is the page on which all controllers reside.
 */
class Application {
	protected _window: Window;
	protected _element: Element;
	protected _controllers: Array<Controller>;
	protected _subscribers: Array<any> = [];
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
	 * Registers with the application that an object wishes to be notified of events.
	 * @param subscriber 
	 */
	public SubscribeToEvents(subscriber: any): void {
		this._subscribers.push(subscriber);
	}


	/**
	 * Broadcasts an event to all subscribers registered to listen for events.
	 * Example:
	 *    this.application.Publish({
	 *       name: "testy::mctesty",
	 *       payload: {
	 *          hi: "Hello there!"
	 *       }
	 *    });
	 */
	public Publish(sender: any, eventName: string, payload: any): void {
		const evt: ApplicationEvent = {
			from: sender,
			name: eventName,
			payload: payload
		};
		
		for (let i=0; i < this._subscribers.length; i++) {
			let subscriber = this._subscribers[i];
			if (!subscriber["Subscribe"]) {
				throw new Error("Subscribing object does not implement 'Subscribe' method!");
			}
			subscriber["Subscribe"](evt);
		}
	}


	/**
	 * Disconnects all controllers
	 */
	public Disconnect(): void {
		for (const ctrl of this._controllers) {
			ctrl.Disconnect();
		}
		this._subscribers = null;
		this._controllers = null;
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
		this.out(console.warn, message, optionalParams);
	}

	/**
	 * If debugging is enabled, adds an entry into the console log.
	 * @param message - Message to write
	 * @param optionalParams - Additional data
	 */
	public log(message?: any, ...optionalParams: any[]): void {
		this.out(console.log, message, optionalParams);
	}

	/**
	 * If debugging is enabled, adds an info entry into the console log.
	 * @param message - Message to write
	 * @param optionalParams - Additional data
	 */
	public info(message?: any, ...optionalParams: any[]): void {
		this.out(console.info, message, optionalParams);
	}

	/**
	 * Helper for writing to the console.
	 * @param outOn - warn|log|info
	 * @param message - message to be displayed
	 * @param optionalParams - additional parameters to be displayed
	 */
	private out(outOn: outSignature, message: any, optionalParams: any[]): void {
		if (this._debugOn && outOn) {
			if (optionalParams.length === 1) {
				outOn(message, optionalParams[0]);
			} else {
				outOn(message, optionalParams);
			}
		}
	} // out

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

} // Application

