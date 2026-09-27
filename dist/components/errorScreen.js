import { isSelectorString } from "../utils/typeGuards.js";
const template = document.createElement("template");
const templateHTML = `
<div class="error-screen">
    <img class="error-screen__img" alt=""/>
    <h4 class="error-screen__title"></h4>
</div>
`;
template.innerHTML = templateHTML.trim();
export class ErrorScreen {
    constructor(imgPath, title, desc) {
        const fragment = template.content.cloneNode(true);
        const errorScreen = fragment.querySelector(".error-screen");
        if (!errorScreen) {
            throw new Error("errorScreen not found in template");
        }
        this._errorElement = errorScreen;
        const errorImg = this._errorElement.querySelector(".error-screen__img");
        if (!errorImg) {
            throw new Error("errorImg not found in template");
        }
        this._errorImg = errorImg;
        const errorTitle = this._errorElement.querySelector(".error-screen__title");
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
    render(parentSelector) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        parentElement.appendChild(this._errorElement);
    }
}
