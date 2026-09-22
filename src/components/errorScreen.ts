import { isSelectorString } from "../utils/typeGuards.js";

const template = document.createElement("template");
const templateHTML = `
<div class="error-screen">
    <img class="error-screen__img" alt=""/>
    <h4 class="error-screen__title"></h4>
    <p class="error-screen__desc"></p>
</div>
`;
template.innerHTML = templateHTML.trim();

export class ErrorScreen {
  private _errorElement: HTMLDivElement;
  private _errorImg: HTMLImageElement;
  private _errorTitle: HTMLHeadingElement;
  private _errorDesc?: HTMLParagraphElement;

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
    this._errorTitle = errorTitle;

    const errorDesc = this._errorElement.querySelector<HTMLParagraphElement>(
      ".error-screen__desc",
    );
    if (!errorDesc) {
      throw new Error("errorDesc not found in template");
    }
    this._errorDesc = errorDesc;

    this._errorImg.setAttribute("src", imgPath);
    this._errorTitle.textContent = title;
    if (desc) {
      this._errorDesc.textContent = desc;
    }
  }

  render(parentSelector: string): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }
    parentElement.appendChild(this._errorElement);
  }
}
