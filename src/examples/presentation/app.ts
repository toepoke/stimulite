/// <reference path="../../stimulite/stimulite.ts" />

class SeasonGalleryController extends Controller {
	constructor(name: string, application: Application, element: Element) {
		super(name, application, element);
	}

	private _current: number = 0;

	public Connect(): void {
		this._application.warn("Connect!");		
		this.wireUpSounds();
	}

	public Disconnect(): void {
	}

	public Subscription(evt: ApplicationEvent): void {
	}

	private wireUpSounds(): void {
		const slides: NodeListOf<Element> = this._element.querySelectorAll(".slide");
		
		const sounds = this._element.getElementsByTagName("audio");
		const woosh: HTMLAudioElement = sounds[0];

		this._element.querySelector(".close-presentation-button").addEventListener("click", (e: MouseEvent) => {
			this.closePresentation();
		});
		
		this._application.Window.addEventListener("keyup", (e: KeyboardEvent) => {
			if (e.keyCode === 27) {
				this.closePresentation();
			}
		});

		for (let i=0; i < slides.length; i++) {
			const slide: Element = slides[i];

			slide.addEventListener("animationstart", (e: Event) => this.play(woosh) );
			// we were going to have "crash" at "animationend", but it seems unreliable, so removed

		}
	}

	private closePresentation(): void {
		this._element.classList.add("close-presentation");
	}

	private play(mp3: HTMLAudioElement): void {
		if (mp3 !== undefined) {
			let promise = mp3.play();
		}
	}

} // SeasonGalleryController




// IE9+
document.addEventListener("DOMContentLoaded", function() {
	const debugOn: boolean = true;

	console.warn("Document Ready!");

	const a = new Application(window, document.documentElement, debugOn);
	
	// setTimeout(() => {
	// 	a.Disconnect();
	// }, 5000);

});

