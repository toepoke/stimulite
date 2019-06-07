/// <reference path="../../stimulite/stimulite.ts" />

class SeasonGalleryController extends Controller {
	constructor(name: string, application: Application, element: Element) {
		super(name, application, element);
	}

	private _current: number = 0;

	public Connect(): void {
		this._application.warn("Connect!");		
		//this.addAnimatron();
	}

	public Disconnect(): void {
	}

	public Subscription(evt: ApplicationEvent): void {
	}

	private addAnimatron(): void {
		const slides: NodeListOf<Element> = this._element.querySelectorAll("[data-slide-id]");
		
		for (let i=0; i < slides.length; i++) {
			const slide: Element = slides[i];

			slide.addEventListener("animationend", (e: Event) => this.slideEnd(e) );
		}
	}

	private slideEnd(e: Event): void {
		let currSlide: Element = <Element>e.srcElement;
		let nextSlide: Element = currSlide.nextElementSibling;

		currSlide.classList.remove("zoom-in");
		currSlide.classList.add("hide");

		nextSlide.classList.remove("hide");
		nextSlide.classList.add("zoom-in");
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

