/// <reference path="../../stimulite/stimulite.ts" />
/// <reference path="./player.ts" />

class SidePickerController extends Controller {
	private _players: NodeListOf<Element> = null;
	private _teams: NodeListOf<Element> = null;
	private _doc: Document = null;

	constructor(name: string, application: Application, element: Element) {
		super(name, application, element);
		this._doc = application.Window.document;		
	}

	public get Document(): Document {
		return this._doc;
	}

	public Connect(): void {
		this._application.warn("Connect!");		

		this._players = this._element.querySelectorAll("[data-player-id]");
		for (let i=0; i < this._players.length; i++) {
			const playerNode = this._players[i];
			// @ts-ignore - constructor will initialise the player
			new Player(playerNode, this);
		}

		this._teams = this._element.querySelectorAll("section.team");
		for (let i=0; i < this._teams.length; i++) {
			const teamNode = this._teams[i];
			// @ts-ignore - constructor will initialise the team
			teamNode.item = new Team(teamNode, this);
		}
	}

	public Disconnect(): void {
		this._application.warn("Disconnect!");
	}

	public Subscription(evt: ApplicationEvent): void {
		this._application.log("received", evt);
	}


	/**
	 * Convenience function to find a player, based on their [data] identifier
	 * @param playerId Id of the player
	 */
	public FindPlayer(playerId: number): Element {
		let ele: Element = this._element.querySelector(`[data-player-id='${playerId}'`);

		return ele;
	}


	/**
	 * Fired when one of the [player] buttons are selected to move a player between
	 * teams.
	 * @param e - Event - the team where the player is moving to
	 * @param button - Button which was clicked (on the player)
	 */
	public onMovePlayerBetweenTeams(e: Event, button: Element): void {
		let sourceElement: Element = (<Element>e.srcElement);
		let targetTeamId: string = sourceElement.getAttribute("data-team-id");

		// find the team list we're moving to
		let targetTeam = this._element.querySelector<HTMLElement>(`ol[data-team-id=${targetTeamId}]`);
		let player: HTMLElement = button.parentElement;

		// Move the player to the new team
		const before = player.getBoundingClientRect();
		targetTeam.appendChild(player);
		const after = player.getBoundingClientRect();

		const deltaX = before.left - after.left;
		const deltaY = before.top - after.top;

		// When a player button is clicked, this gives an animation showing the player
		// being dragged across to it's new placing.  It's a bit funky what's happening, for details see:
		// https://medium.com/developers-writing/animating-the-unanimatable-1346a5aab3cd
		let w: Window = this._application.Window;
		let bg = player.style.backgroundColor;
		w.requestAnimationFrame( () => {
			player.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
			player.style.transition = 'transform 0s';

			w.requestAnimationFrame( () => {
				player.style.transform = '';
				player.style.transition = 'transform 500ms';
			});

		});

		// @ts-ignore
		player.item.onPlayerMovedTeam(targetTeamId);

	} // onMovePlayerBetweenTeams

} // SidePickerController

