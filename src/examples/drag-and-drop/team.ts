class Team {
	private _controller: SidePickerController = null;
	private _doc: Document = null;
	private _ele: HTMLElement = null;
	private _teamName: string = null;

	constructor(element: HTMLElement, ctrl: SidePickerController) {
		this._controller = ctrl;
		this._ele = element;
		this._teamName = element.querySelector("header").innerText;
		this._doc = ctrl.Document;
		this.addDropZone();
	}

	/**
	 * Wires up the events for the team area (i.e. the effects to apply when a player
	 * is dragged over a team section)
	 */
	private addDropZone(): void {
		this._ele.addEventListener("drop", (e: Event) => this.onDrop(e) );
		this._ele.addEventListener("dragenter", (e: Event) => this.cancelDefaultAction(e) );
		this._ele.addEventListener("dragover", (e: Event) => this.onDragOver(e) );
		this._ele.addEventListener("dragleave", (e: Event) => this.onDragLeave(e) );
		this._ele.querySelector("OL").addEventListener("drop", (e: Event) => this.onDrop(e) );
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
	private onDrop(event: any): void {
		let draggedItem: HTMLElement = null;
		let draggedPlayer: Player = null;
		let data: any = null;
		let target: HTMLElement = event.target || event.srcElement;

		this.cancelDefaultAction(event)

		// Id of the node being dragged, then use that to find the element being dragged
		data = event.dataTransfer.getData("text");
		draggedItem = this._controller.FindPlayer(data);
		draggedPlayer = draggedItem.playerNode;

		let dropTeamTarget: HTMLElement = null;
		switch (target.tagName) {
			case "SECTION":
				// Add player at the bottom of the list
				dropTeamTarget = target.querySelector("OL");
				this.appendTo(dropTeamTarget, draggedItem);
			break;

			case "HEADER":
				// Add player at the bottom of the list
				dropTeamTarget = this._ele.querySelector("OL");
				this.appendTo(dropTeamTarget, draggedItem);
			break;

			case "OL": 
				// Add player at the bottom of the list
				this.appendTo(target, draggedItem);
				dropTeamTarget = target;
			break;

			case "LI":
				// Add player just after the player the user is dropping them onto
				this.insertAfter(target, draggedItem);
				dropTeamTarget = target.parentElement;
			break;

			default:
				// ignore
		} // switch

		const targetTeamId: string = dropTeamTarget.getAttribute("data-team-id");
		draggedPlayer.onPlayerMovedTeam(targetTeamId);

		// remove the hover effect
		this._ele.classList.remove("section-hover");

	} // onDrop


	/**
	 * Each player holds the order in which they are picked (so when we load the
	 * page we can honour where they were selected).  This method ensures the sequence
	 * is updated.
	 * @param teamNode Team where players need resequencing
	 */
	private reSequenceTeamPlayers(teamNode: HTMLElement): void {
		const playerNodes: NodeListOf<HTMLElement> = teamNode.querySelectorAll("LI");

		for (let i=0; i < playerNodes.length; i++) {
			const current: HTMLElement = playerNodes[i];
			current.playerNode.Sequence = i+1;
		}
	}
	

	/**
	 * Adds the dropped player to the end of the list of players in the block
	 * @param target - "Team" player is being dropped on
	 * @param draggedItem - Player being moved.
	 */
	private appendTo(target: HTMLElement, draggedItem: HTMLElement) {
		let teamNode: HTMLElement = null;
		try {
			target.appendChild(draggedItem);
			teamNode = this.removeEffects(target, draggedItem);
			this.reSequenceTeamPlayers(teamNode);
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
	private insertAfter(target: HTMLElement, draggedItem: HTMLElement) {
		let teamNode: HTMLElement = null;
		try {
			target.parentNode.insertBefore(draggedItem, target.nextSibling);
			teamNode = this.removeEffects(target, draggedItem);
			this.reSequenceTeamPlayers(teamNode);
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
	private removeEffects(target: HTMLElement, draggedItem: HTMLElement): HTMLElement {
		let current: HTMLElement = target;
		let team: HTMLElement = null;

		// Remove player drag effect
		draggedItem.classList.remove("dragging-effect");

		// Find the "Team" block where player has been dropped and remove associated effect
		// "current" could be an LI the user has dropped the player onto, or the HEADER or the
		// section.  So we keep moving up until we find the "Team" block.
		// If we get to the controller level (this._element) we shortcut out as we haven't found and
		// no point going all the way to the root of the document.
		while (current != null && current != this._ele) {
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

} // Team