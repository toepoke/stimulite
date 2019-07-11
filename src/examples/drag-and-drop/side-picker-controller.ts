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
		this._application.SubscribeToEvents(this);

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


	/**
	 * Looks for events that need dealing with at the controller level.
	 * @param evt - Event being consumed
	 */
	public Subscribe(evt: ApplicationEvent): void {
		if (evt.name === "PLAYER-TEAM-MOVE::START") {
			this.switchTeams(evt.payload.targetTeamId, evt.payload.player);
		}
	}


	/**
	 * Moves a player between teams when a "team selection button" is click on a player.
	 * @param button - Team button that was clicked (Colours, Whites or Bench)
	 * @param player - Player that was clicked to be moved
	 */
	public switchTeams(targetTeamId: string, player: Player): void {
		// find the team list we're moving to
		let targetTeam = this.FindTeam(targetTeamId);

		// Move the player to the new team
		const before = player.Element.getBoundingClientRect();
		targetTeam.appendChild(player.Element);
		const after = player.Element.getBoundingClientRect();

		const deltaX = before.left - after.left;
		const deltaY = before.top - after.top;

		// When a player button is clicked, this gives an animation showing the player
		// being dragged across to it's new placing.  It's a bit funky what's happening, for details see:
		// https://medium.com/developers-writing/animating-the-unanimatable-1346a5aab3cd
		let w: Window = this._application.Window;
		w.requestAnimationFrame( () => {
			player.Element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
			player.Element.style.transition = 'transform 0s';

			w.requestAnimationFrame( () => {
				player.Element.style.transform = '';
				player.Element.style.transition = 'transform 500ms';
			});

		});

		// @ts-ignore
		player.onPlayerMovedTeam(targetTeamId);
	}

	
	/**
	 * Convenience function to find a player, based on their [data] identifier
	 * @param playerId Id of the player
	 */
	public FindPlayer(playerId: number | string): Element {
		let ele: Element = this._element.querySelector(`[data-player-id='${playerId}']`);

		return ele;
	}

	/**
	 * Convenience function to find a team section, based on it's [data] identifier
	 * @param teamId - Id of the team div
	 */
	public FindTeam(teamId: number | string): Element {
		let ele = this._element.querySelector<HTMLElement>(`ol[data-team-id='${teamId}']`);

		return ele;
	}

} // SidePickerController

