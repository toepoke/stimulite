// import { ApplicationEvent } from './application-event';
// import { Controller } from './controller';
// export class Application {
// 	private _window: Window;
// 	private _element: Element;
// 	private _controllers: Array<Controller>;
// 	constructor(window: Window, element?: Element) {
// 		this._window = window;
// 		this._element = element;
// 		this.FindControllers();
// 		this.ConnectionComplete();
// 	}
// 	public BroadcastEvent(evt: ApplicationEvent): void {
// 		for (const ctrl of this._controllers) {
// 			// todo: Exclude sending controller from broadcast
// 			ctrl.Subscription(evt);
// 		}
// 	}
// 	public Disconnect(): void {
// 		for (const ctrl of this._controllers) {
// 			ctrl.Disconnect();
// 		}
// 	}
// 	private ConnectionComplete(): void {
// 		for (const ctrl of this._controllers) {
// 			ctrl.Connect();
// 		}
// 	}
// 	private FindControllers(): void {
// 		const ctrlDomNodes: NodeListOf<Element> = this._element.querySelectorAll("[data-controller");
// 		this._controllers = new Array<Controller>();
// 		for (var i=0; i < ctrlDomNodes.length; i++) {
// 			const ctrlDomNode = ctrlDomNodes[i];
// 			const ctrlName = ctrlDomNode.getAttribute("data-controller") + "Controller";
// 			const application: Application = this;
// 			const controller: Controller = new (<any>this._window)[ctrlName](ctrlName, application, ctrlDomNode);
// 			this._controllers.push(controller);
// 		}
// 	}
// }
//# sourceMappingURL=application.js.map