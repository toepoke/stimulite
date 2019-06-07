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
	protected _element: Element;

	/**
	 * Reference to the underlying application.
	 */
	protected _application: Application;

	constructor(name: string, application: Application, element: Element) {
		this._name = name;
		this._application = application;
		this._element = element;
	}

	/**
	 * Called when an event is broadcast through the application.
	 * @param evt - Event that has been broadcast.
	 */
	public abstract Subscription(evt: ApplicationEvent): void;

	/**
	 * Called once the controller has been created and initialised (i.e. after it's constructor)
	 * has been called.
	 */
	public abstract Connect(): void;

	/**
	 * TODO: Not sure when this is called yet ...
	 */
	public abstract Disconnect(): void;

} // Controller
