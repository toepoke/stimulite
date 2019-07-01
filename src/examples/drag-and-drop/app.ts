/// <reference path="../../stimulite/stimulite.ts" />
/// <reference path="./player.ts" />

class Team {
	private _controller: SidePickerController = null;
	private _doc: Document = null;
	private _ele: Element = null;
	private _teamName: string = null;

	constructor(element: Element, ctrl: SidePickerController) {
		this._ele = element;
		this._teamName = element.querySelector("header").innerText;
		this._doc = ctrl.Document;
	}
}

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
			playerNode.item = new Player(playerNode, this);
		}

		this._teams = this._element.querySelectorAll(".team");
		for (let i=0; i < this._teams.length; i++) {
			const teamNode = this._teams[i];
			// @ts-ignore
			teamNode.item = new Team(teamNode, this);
		}
		
		this.addDropZones();		
	}

	public Disconnect(): void {
		this._application.warn("Disconnect!");
	}

	public Subscription(evt: ApplicationEvent): void {
		this._application.log("received", evt);
	}

	public onMovePlayerBetweenTeams(e: Event, button: Element): void {
		let sourceElement: Element = (<Element>e.srcElement);
		let targetTeamId: string = sourceElement.getAttribute("data-team-id");

		// find the team list we're moving to
		let targetTeam = this._element.querySelector<HTMLElement>(`ol[data-team-id=${targetTeamId}]`);
		let player: HTMLElement = sourceElement.parentElement;

		// Move the player to the new team
		const before = player.getBoundingClientRect();
		targetTeam.append(player);
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

		// As we've moved team the buttons are out of whack 
		// (e.g. whites button is available, but we're now on whites)
		let navButtons: NodeListOf<Element> = player.querySelectorAll("button");
		for (let i=0; i < navButtons.length; i++) {
			const nav: Element = navButtons[i];

			if (nav.getAttribute("data-team-id") === targetTeamId) {
				nav.classList.add("hide");
				nav.classList.remove("show");
			} else {
				nav.classList.add("show");
				nav.classList.remove("hide");
			}
		}

	} // onMovePlayerBetweenTeams


	/**
	 * Identifies the "zones" where a player can be dropped.  For us this is "Team A", "Team B"
	 * and the "Bench" blocks.  Wires up appropriate events.
	 */
	private addDropZones(): void {
		const sectionZones: NodeListOf<Element> = this._element.querySelectorAll("section.team");

		for (let i=0; i < sectionZones.length; i++) {
			const sectionZone: Element = sectionZones[i];

			sectionZone.addEventListener("drop", (e: Event) => this.onDrop(e) );
			sectionZone.addEventListener("dragenter", (e: Event) => this.cancelDefaultAction(e) );
			sectionZone.addEventListener("dragover", (e: Event) => this.onDragOver(e) );
			sectionZone.addEventListener("dragleave", (e: Event) => this.onDragLeave(e) );

			const playerZones: NodeListOf<Element> = sectionZone.querySelectorAll("OL");
			for (let j=0; j < playerZones.length; j++) {
				const playerZone: Element = playerZones[j];

				// TODO: Add dragenter, dragover, etc to remove the styling at both levels
				playerZone.addEventListener("drop", (e: Event) => this.onDrop(e) );
			}
		}
	}


	/**
	 * Fired when a player is moved over a given drop area (aka Team block).
	 * @param e - Event associated with the move.
	 */
	private onDragOver(e: Event): void {		
		this.cancelDefaultAction(e);
		(e.currentTarget as HTMLDivElement).classList.add("section-hover");
	}


	/**
	 * Fired when a player is leaves the given drop area (aka Team block).
	 * @param e - Event associated with the move.
	 */
	private onDragLeave(e: Event): void {
		this.cancelDefaultAction(e);
		(e.currentTarget as HTMLDivElement).classList.remove("section-hover");
	}


	/**
	 * Cancels the default browser action for an event (so we can take over)
	 * @param e - Event associated with the action
	 */
	private cancelDefaultAction(e: Event): boolean {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}


	/**
	 * Fired when the player is dropped into a "Team" or "Bench" block.
	 * Moves the player as appropriate:
	 *  - If dropped at SECTION, HEADER or OL level, player is added to bottom of list
	 *  - If dropped at LI level, player is added immediately after the player it's dropped on (so user can re-order nodes)
	 * @param event - Event associated with the drop action.
	 */
	onDrop(event: any): void {
		let dropTarget: Element = null;
		let draggedItem: Element = null;
		let data: any = null;
		let target: Element = event.target || event.srcElement;

		this.cancelDefaultAction(event)
		target.classList.remove("section-hover");

		// Id of the node being dragged, then use that to find the element being dragged
		data = event.dataTransfer.getData("text");
		draggedItem = this._element.querySelector(`[data-player-id='${data}'`);

		switch (target.tagName) {
			case "SECTION":
				// Add player at the bottom of the list
				dropTarget = target.querySelector("OL");
				this.appendTo(dropTarget, draggedItem);
			break;

			case "HEADER":
				// Add player at the bottom of the list
				dropTarget = target.parentElement.querySelector("OL");
				this.appendTo(dropTarget, draggedItem);
			break;

			case "OL": 
				// Add player at the bottom of the list
				this.appendTo(target, draggedItem);
			break;

			case "LI":
				// Add player just after the player the user is dropping them onto
				dropTarget = target;
				this.insertAfter(dropTarget, draggedItem);
			break;

			default:
				// ignore
		} // switch

	} // onDrop


	private sequenceTeamPlayers(teamNode: Element): void {
		const playerNodes: NodeListOf<Element> = teamNode.querySelectorAll("LI");

		for (let i=0; i < playerNodes.length; i++) {
			const current: Element = playerNodes[i];
			current.setAttribute("data-player-sequence", (i+1).toString());
		}
	}

	
	/**
	 * Adds the dropped player to the end of the list of players in the block
	 * @param target - "Team" player is being dropped on
	 * @param draggedItem - Player being moved.
	 */
	private appendTo(target: Element, draggedItem: Element) {
		let teamNode: Element = null;
		try {
			target.appendChild(draggedItem);
			teamNode = this.removeEffects(target, draggedItem);
			this.sequenceTeamPlayers(teamNode);
		} 
		catch {
			; // probably dropped back on the team it was dragged from
		}
	}


	/**
	 * Adds the dropped player just after the player the user is hovering over (in the Team block)
	 * @param target - Player user is hovering over
	 * @param draggedItem - Player being moved.
	 */
	private insertAfter(target: Element, draggedItem: Element) {
		let teamNode: Element = null;
		try {
			target.parentNode.insertBefore(draggedItem, target.nextSibling);
			teamNode = this.removeEffects(target, draggedItem);
			this.sequenceTeamPlayers(teamNode);
		} 
		catch {
			; // probably dropped back on the team it was dragged from
		}
	}	


	/**
	 * Once player has been dropped, remove any CSS effects associated with the
	 * move action.
	 * @param target - "Team" block where player has been dropped
	 * @param draggedItem - Player who has been moved
	 */
	private removeEffects(target: Element, draggedItem: Element): Element {
		let current: Element = target;
		let team: Element = null;

		// Remove player drag effect
		draggedItem.classList.remove("dragging-effect");

		// Find the "Team" block where player has been dropped and remove associated effect
		// "current" could be an LI the user has dropped the player onto, or the HEADER or the
		// section.  So we keep moving up until we find the "Team" block.
		// If we get to the controller level (this._element) we shortcut out as we haven't found and
		// no point going all the way to the root of the document.
		while (current != null && current != this._element) {
			// We'll need to know this later, so save some work ..
			if (current != null && current.getAttribute("data-team-id")) {
				team = current;
			}

			if (current.classList.contains("section-hover")) {
				current.classList.remove("section-hover");
				current = null;	// done, so exit
			} else {
				current = current.parentElement;
			}
		}

		return team;
	}

} // SidePickerController


// IE9+
document.addEventListener("DOMContentLoaded", function() {
	const debugOn: boolean = true;

	console.warn("Document Ready!");

	const a = new Application(window, document.documentElement, debugOn);
	
	// setTimeout(() => {
	// 	a.Disconnect();
	// }, 5000);

});

