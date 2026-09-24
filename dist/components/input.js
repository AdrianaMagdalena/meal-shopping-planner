import { generateId } from "../utils/generateId.js";
import { isSelectorString } from "../utils/typeGuards.js";
import { insertElem } from "../utils/insertElem.js";
const template = document.createElement("template");
const templateHTML = `
<div class="input">
  <div class="input__wrap">
    <input class="input__input" />
  </div>
</div>
`;
template.innerHTML = templateHTML.trim();
export class Input {
    constructor(inputCustomClass, inputLabelText, inputAriaText, placeholderText, leadBtnAriaLabel, trailBtnAriaLabel) {
        const fragment = template.content.cloneNode(true);
        const inputField = fragment.querySelector(".input");
        if (!inputField) {
            throw new Error("inputField not found in template");
        }
        this._inputField = inputField;
        const inputWrap = this._inputField.querySelector(".input__wrap");
        if (!inputWrap) {
            throw new Error("inputWrap not found in template");
        }
        this._inputWrap = inputWrap;
        const inputInput = this._inputField.querySelector(".input__input");
        if (!inputInput) {
            throw new Error("inputInput not found in template");
        }
        this._inputInput = inputInput;
        const inputId = generateId("input", 5);
        this._inputField.classList.add(inputCustomClass);
        this._inputInput.id = inputId;
        if (inputLabelText && inputLabelText.length > 0) {
            const inputLabel = document.createElement("label");
            inputLabel.classList.add(".input__label");
            inputLabel.textContent = inputLabelText;
            inputLabel.setAttribute("for", inputId);
            this._inputField.prepend(inputLabel);
            this._inputLabel = inputLabel;
        }
        if (inputAriaText && inputAriaText.length > 0) {
            this._inputField.setAttribute("aria-label", inputAriaText);
        }
        if (placeholderText) {
            this._inputInput.placeholder = placeholderText;
        }
        if (leadBtnAriaLabel && leadBtnAriaLabel.length > 0) {
            const inputLeadBtn = document.createElement("button");
            inputLeadBtn.classList.add("input__action", "input__action--lead");
            inputLeadBtn.setAttribute("aria-label", leadBtnAriaLabel);
            this._inputWrap.prepend(inputLeadBtn);
            this._leadBtn = inputLeadBtn;
        }
        if (trailBtnAriaLabel && trailBtnAriaLabel.length > 0) {
            const inputTrailBtn = document.createElement("button");
            inputTrailBtn.classList.add("input__action", "input__action--trail");
            inputTrailBtn.setAttribute("aria-label", trailBtnAriaLabel);
            this._inputWrap.append(inputTrailBtn);
            this._trailBtn = inputTrailBtn;
        }
    }
    get leadBtn() {
        return this._leadBtn;
    }
    get trailBtn() {
        return this._trailBtn;
    }
    get inputInput() {
        return this._inputInput;
    }
    render(parentSelector, position) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        insertElem(position, this._inputField, parentElement);
    }
}
