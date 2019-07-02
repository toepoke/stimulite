
/**
 * Represents a player on the side picker screen.
 */
class Player {
	private _controller: SidePickerController = null;
	private _doc: Document = null;
	private _ele: Element = null;
	private _id: number = null;

	/**
	 * Constructor
	 * @param element - DOM element the player is associated with.
	 * @param ctrl - Reference to the SidePickerController the play is within (not the team, as the player can change teams).
	 */
	constructor(element: Element, ctrl: SidePickerController) {
		this._ele = element;
		// @ts-ignore - add a reference to the player object to the DOM node
		this._ele.item = this;
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
	 * Makes the player a draggable DOM element, setting up the required events (i.e. dragstart and dragend).
	 */
	private makeDraggable(): void {
		this._ele.setAttribute("draggable", "true");
		this._ele.classList.add("draggable");

		this._ele.addEventListener("dragstart", (e: Event) => {
			this._ele.classList.add("dragging-effect");
			// @ts-ignore
			e.dataTransfer.setData("text", this._id);
			// @ts-ignore
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

		this._ele.appendChild( this.createTeamSwapButton("side-1", "W", (teamId !== "side-1")) );
		this._ele.appendChild( this.createTeamSwapButton("side-2", "C", (teamId !== "side-2")) );
		this._ele.appendChild( this.createTeamSwapButton("side-0", "B", (teamId !== "side-0")) );

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
	private createTeamSwapButton(teamId: string, text: string, initiallyOn: boolean): Element {
		const initialDisplay: string = (initiallyOn ? "show" : "hide");
		let button = this._doc.createElement("button");
		

		button.innerHTML = text;
		button.setAttribute("data-team-id", teamId);
		button.classList.add("team-picker-button", initialDisplay);

		button.addEventListener("click", (e: Event) => this._controller.onMovePlayerBetweenTeams(e, button));

		return button;
	}

}

