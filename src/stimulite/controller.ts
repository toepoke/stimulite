/// <reference path="./application.ts" />
/// <reference path="./application-event.ts" />

/**
 * Base class for controllers.
 */
abstract class Controller {
	/**
	 * Name of the controller (the value assigned to the "data-controller" attribute).
	 * This should be the same as the JavaScript controller name.
	 * So an attribute (in the HTML) of "ToDo" should have an associated "ToDoController" class.
	 */
	protected _name: string;

	/**
	 * Element where the "data-controller" is defined.
	 */
	protected _element: HTMLElement;

	/**
	 * Reference to the underlying application.
	 */
	protected _application: Application;

	constructor(name: string, application: Application, element: HTMLElement) {
		this._name = name;
		this._application = application;
		this._element = element;
	}

	/**
	 * Called once the controller has been created and initialised (i.e. after it's constructor)
	 * has been called.
	 */
	public Connect(): void {
		// Implement this in the subclass if you wish to recieve connect events
	}

	/**
	 * TODO: Not sure when this is called yet ...
	 */
	public Disconnect(): void {
		// Implement this in the subclass if you wish to recieve disconnect events
	}

	public get Application(): Application {
		return this._application;
	}

} // Controller
