
interface ApplicationEvent {
	/**
	 * Name of the notification being broadcast, e.g. "TEAM::PLAYER__MOVE"
	 */
	name: string;

	/**
	 * Controller which sent the event;
	 */
	from: Controller;

	/**
	 * Payload (if any) associated with the notification
	 */
	payload?: any;
}


