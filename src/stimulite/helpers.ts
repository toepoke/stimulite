
class Helpers {
	
	static findParentTag(from: Element, tagName: string): Element {
		let current: Element = from;

		while (current != null && current.tagName !== "BODY") {
			if (current.tagName === tagName) {
				return current;
			}

			current = current.parentElement;
		}
	} // findParentTag

}