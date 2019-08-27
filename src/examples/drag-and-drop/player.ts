/// <reference path="./interface-extensions.ts" />
/// <reference path="./event-types.ts" />

/**
 * Represents a player on the side picker screen.
 */
class Player {
	private _controller: SidePickerController = null;
	private _doc: Document = null;
	private _ele: HTMLElement = null;
	private _id: number = null;

	/**
	 * Constructor
	 * @param element - DOM element the player is associated with.
	 * @param ctrl - Reference to the SidePickerController the play is within (not the team, as the player can change teams).
	 */
	constructor(element: HTMLElement, ctrl: SidePickerController) {
		this._ele = element;
		this._ele.playerNode = this;
		this._id = parseInt(element.getAttribute("data-player-id"), 10);
		this._controller = ctrl;
		this._doc = this._controller.Document;

		this.addTeamSelectButtons();
		this.makeDraggable();
	}

	public get Element(): HTMLElement {
		return this._ele as HTMLElement;
	}

	public set Sequence(value: number) {
		this._ele.setAttribute("data-player-sequence", value.toString());
	}


	/**
	 * Called when a player is moved from team "A" to team "B".  
	 * The player can be moved by dragging, or by the move team buttons, in either case this will be called.
	 * As a consequence of the player moving teams, the move buttons will be shown or hidden as appropriate, 
	 * (i.e. if you're on the colours team, the colours selection button makes no sense).
	 * @param newTeamId 
	 */
	public onPlayerMovedTeam(newTeamId: string): void {
		// As we've moved team the buttons are out of whack 
		// (e.g. whites button is available, but we're now on whites)
		let navButtons: NodeListOf<HTMLButtonElement> = this._ele.querySelectorAll("button");
		for (let i=0; i < navButtons.length; i++) {
			const nav: Element = navButtons[i];

			if (nav.getAttribute("data-team-id") === newTeamId) {
				nav.classList.add("hide");
				nav.classList.remove("show");
			} else {
				nav.classList.add("show");
				nav.classList.remove("hide");
			}
		}

	}


	/**
	 * Makes the player a draggable DOM element, setting up the required events (i.e. dragstart and dragend).
	 */
	private makeDraggable(): void {
		this._ele.setAttribute("draggable", "true");
		this._ele.classList.add("draggable");

		this._ele.addEventListener("dragstart", (e: DragEvent) => {
			this._ele.classList.add("dragging-effect");
			e.dataTransfer.setData("text", this._id.toString());
			e.dataTransfer.effectAllowed = "move";
		});

		this._ele.addEventListener("dragend", (e: Event) => {
			this._ele.classList.remove("dragging-effect");
		});
	}
	

	/**
	 * Adds buttons to the player DOM for swapping between sides.
	 * (buttons will be a better mobile experience, dragging can be a tad faffy on touch device)
	 */
	private addTeamSelectButtons(): void {
		const teamId: string = this._ele.parentElement.getAttribute("data-team-id");

		this._ele.appendChild( this.createTeamSwapButton("1", "W", (teamId !== "1")) );
		this._ele.appendChild( this.createTeamSwapButton("2", "C", (teamId !== "2")) );
		this._ele.appendChild( this.createTeamSwapButton("0", "B", (teamId !== "0")) );

		// Noddy effect whilst the players are moving between teams (when buttons are used)
		this._ele.addEventListener("transitionstart", (e: Event) => {
			(e.currentTarget as HTMLDivElement).style.opacity = "0.5";
		});
		this._ele.addEventListener("transitionend", (e: Event) => {
			(e.currentTarget as HTMLDivElement).style.opacity = "1";
		});

	}	

	
	/**
	 * Convenience method to add the buttons on the player that change the team they're on
	 * @param teamId - Id of the team the button moves the player to
	 * @param text - Text of the button
	 * @param initiallyOn - Whether the button is visible at the start or not
	 */
	private createTeamSwapButton(teamId: string, text: string, initiallyOn: boolean): HTMLButtonElement {
		const initialDisplay: string = (initiallyOn ? "show" : "hide");
		let button = this._doc.createElement("button");
		
		button.innerHTML = text;
		button.setAttribute("data-team-id", teamId);
		button.classList.add("team-picker-button", initialDisplay);

		button.addEventListener("click", (e: Event) => {
			let targetTeamId = button.getAttribute("data-team-id");

			this._controller.Application.Publish(this, EVENT_TYPES.PLAYER_MOVE_BY_BUTTON__START, {
				targetTeamId: targetTeamId,
				player: this
			});
		});

		return button;
	}

} // Player

