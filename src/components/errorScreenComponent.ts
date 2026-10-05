import { insertElem } from "../utils/insertElem.js";
import { isSelectorString } from "../utils/typeGuards.js";

const template = document.createElement("template");
const templateHTML = `
<div class="error-screen">
    <img class="error-screen__img" alt=""/>
    <h4 class="error-screen__title"></h4>
</div>
`;
template.innerHTML = templateHTML.trim();

export class ErrorScreenComponent {
  private readonly _errorElement: HTMLDivElement;
  private readonly _errorImg: HTMLImageElement;
  private readonly _errorTitle: HTMLHeadingElement;
  private readonly _errorDesc?: HTMLParagraphElement;

  constructor(imgPath: string, title: string, desc?: string) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;

    const errorScreen = fragment.querySelector<HTMLDivElement>(".error-screen");
    if (!errorScreen) {
      throw new Error("errorScreen not found in template");
    }
    this._errorElement = errorScreen;

    const errorImg =
      this._errorElement.querySelector<HTMLImageElement>(".error-screen__img");
    if (!errorImg) {
      throw new Error("errorImg not found in template");
    }
    this._errorImg = errorImg;

    const errorTitle = this._errorElement.querySelector<HTMLHeadingElement>(
      ".error-screen__title",
    );
    if (!errorTitle) {
      throw new Error("errorTitle not found in template");
    }

    this._errorImg.setAttribute("src", imgPath);
    this._errorTitle = errorTitle;
    this._errorTitle.textContent = title;
    if (desc && desc.length > 0) {
      const errorDesc = document.createElement("p");
      this._errorDesc = errorDesc;
      this._errorDesc.classList.add("error-screen__desc");
      this._errorDesc.textContent = desc;
      this._errorElement.appendChild(errorDesc);
    }
  }

  render(parentSelector: string | HTMLElement): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) throw new Error("parentElement not found in template");

    insertElem("append", this._errorElement, parentElement);
  }
}
