// export module Stimuli {
// 	export interface ApplicationEvent {	
// 		/**
// 		 * Name of the notification being broadcast, e.g. "TEAM::PLAYER__MOVE"
// 		 */
// 		name: string;
// 		/**
// 		 * Payload (if any) associated with the notification
// 		 */
// 		payload?: any;
// 	}	
// 	export class Application {
// 		private _window: Window;
// 		private _element: Element;
// 		private _controllers: Array<Controller>;
// 		constructor(window: Window, element?: Element) {
// 			this._window = window;
// 			this._element = element;
// 			this.FindControllers();
// 			this.ConnectionComplete();
// 		}
// 		public BroadcastEvent(evt: ApplicationEvent): void {
// 			for (const ctrl of this._controllers) {
// 				// todo: Exclude sending controller from broadcast
// 				ctrl.Subscription(evt);
// 			}
// 		}
// 		public Disconnect(): void {
// 			for (const ctrl of this._controllers) {
// 				ctrl.Disconnect();
// 			}
// 		}
// 		private ConnectionComplete(): void {
// 			for (const ctrl of this._controllers) {
// 				ctrl.Connect();
// 			}
// 		}
// 		private FindControllers(): void {
// 			const ctrlDomNodes: NodeListOf<Element> = this._element.querySelectorAll("[data-controller");
// 			this._controllers = new Array<Controller>();
// 			for (var i=0; i < ctrlDomNodes.length; i++) {
// 				const ctrlDomNode = ctrlDomNodes[i];
// 				const ctrlName = ctrlDomNode.getAttribute("data-controller") + "Controller";
// 				const application: Application = this;
// 				const controller: Controller = new (<any>this._window)[ctrlName](ctrlName, application, ctrlDomNode);
// 				this._controllers.push(controller);
// 			}
// 		}
// 	}
// 	export abstract class Controller {
// 		private _element: Element;
// 		private _application: Application;
// 		private _name: string;
// 		constructor(name: string, application: Application, element: Element) {
// 			this._name = name;
// 			this._application = application;
// 			this._element = element;
// 		}
// 		public abstract Subscription(evt: ApplicationEvent): void;
// 		public abstract Connect(): void;
// 		public abstract Disconnect(): void;
// 		get application(): Application {
// 			return this._application;
// 		}
// 		set application(value: Application) {
// 			this._application = value;
// 		}
// 	}
// }
//# sourceMappingURL=stimuli.js.map