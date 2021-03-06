/// <reference path="../../stimulite/stimulite.ts" />
/// <reference path="./player.ts" />
/// <reference path="./event-types.ts" />

class SidePickerController extends Controller {
	private _players: NodeListOf<HTMLElement> = null;
	private _teams: NodeListOf<HTMLElement> = null;
	private _doc: Document = null;

	constructor(name: string, application: Application, element: HTMLElement) {
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
			new Player(playerNode, this);
		}

		this._teams = this._element.querySelectorAll("section.team");
		for (let i=0; i < this._teams.length; i++) {
			const teamNode = <HTMLElement>this._teams[i];
			teamNode.teamNode = new Team(teamNode, this);
		}
	}


	/**
	 * Looks for events that need dealing with at the controller level.
	 * @param evt - Event being consumed
	 */
	public Subscribe(evt: ApplicationEvent): void {
		
		switch (evt.name) {
			case EVENT_TYPES.PLAYER_MOVE_BY_BUTTON__START:
				this.switchTeams(evt.payload.targetTeamId, evt.payload.player);
			break;

			case EVENT_TYPES.PLAYER_MOVE_BY_DRAG__COMPLETE:
			case EVENT_TYPES.PLAYER_MOVE_BY_BUTTON__COMPLETE:
					evt.payload.player.onPlayerMovedTeam(evt.payload.targetTeamId)
			break;
		}

	} // Subscribe


	/**
	 * Convenience function to find a player, based on their [data] identifier
	 * @param playerId Id of the player
	 */
	public FindPlayer(playerId: number | string): HTMLElement {
		let ele: HTMLElement = this._element.querySelector(`[data-player-id='${playerId}']`);

		return ele;
	}

	/**
	 * Convenience function to find a team section, based on it's [data] identifier
	 * @param teamId - Id of the team div
	 */
	public FindTeam(teamId: number | string): HTMLElement {
		let ele = this._element.querySelector<HTMLElement>(`ol[data-team-id='${teamId}']`);

		return ele;
	}

	/**
	 * Moves a player between teams when a "team selection button" is click on a player.
	 * @param button - Team button that was clicked (Colours, Whites or Bench)
	 * @param player - Player that was clicked to be moved
	 */
	protected switchTeams(targetTeamId: string, player: Player): void {
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

		this.Application.Publish(this, EVENT_TYPES.PLAYER_MOVE_BY_BUTTON__COMPLETE, {
			player: player,
			targetTeamId: targetTeamId
		});
	} // switchTeams

} // SidePickerController

