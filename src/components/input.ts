import { generateId } from "../utils/generateId.js";
import { isSelectorString } from "../utils/typeGuards.js";
import { insertElem } from "../utils/insertElem.js";

const template = document.createElement("template");
const templateHTML = `
<div class="input">
  <label class="input__label"></label>
  <div class="input__wrap">
    <input class="input__input" />
  </div>
</div>
`;

template.innerHTML = templateHTML.trim();

export class Input {
  private readonly _inputField: HTMLDivElement;
  private readonly _inputLabel: HTMLLabelElement;
  private readonly _inputWrap: HTMLDivElement;
  private readonly _inputInput: HTMLInputElement;
  private readonly _leadBtn?: HTMLButtonElement;
  private readonly _trailBtn?: HTMLButtonElement;

  constructor(
    inputCustomClass: string,
    inputLabelText: string,
    placeholderText: string,
    leadBtnAriaLabel?: string,
    trailBtnAriaLabel?: string,
  ) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;

    const inputField = fragment.querySelector<HTMLDivElement>(".input");
    if (!inputField) {
      throw new Error("inputField not found in template");
    }
    this._inputField = inputField;

    const inputLabel =
      this._inputField.querySelector<HTMLLabelElement>(".input__label");
    if (!inputLabel) {
      throw new Error("inputLabel not found in template");
    }
    this._inputLabel = inputLabel;

    const inputWrap =
      this._inputField.querySelector<HTMLInputElement>(".input__wrap");
    if (!inputWrap) {
      throw new Error("inputWrap not found in template");
    }
    this._inputWrap = inputWrap;

    const inputInput =
      this._inputField.querySelector<HTMLInputElement>(".input__input");
    if (!inputInput) {
      throw new Error("inputInput not found in template");
    }
    this._inputInput = inputInput;

    const inputId = generateId("input", 5);
    this._inputField.classList.add(inputCustomClass);
    this._inputLabel.textContent = inputLabelText;
    this._inputLabel.setAttribute("for", inputId);
    this._inputInput.id = inputId;
    this._inputInput.placeholder = placeholderText;

    if (leadBtnAriaLabel && leadBtnAriaLabel.length > 0) {
      const inputLeadBtn = document.createElement("button");
      inputLeadBtn.classList.add("input__action", "input__action--lead");
      inputLeadBtn.setAttribute("aria-label", leadBtnAriaLabel);
      inputWrap.prepend(inputLeadBtn);
    }

    if (trailBtnAriaLabel && trailBtnAriaLabel.length > 0) {
      const inputTrailBtn = document.createElement("button");
      inputTrailBtn.classList.add("input__action", "input__action--trail");
      inputTrailBtn.setAttribute("aria-label", trailBtnAriaLabel);
      inputWrap.append(inputTrailBtn);
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

  render(parentSelector: string | HTMLElement, position: string): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }

    insertElem(position, this._inputField, parentElement);
  }
}
