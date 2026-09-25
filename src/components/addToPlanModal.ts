import { isSelectorString } from "../utils/typeGuards.js";
import { insertElem } from "../utils/insertElem.js";
import { AmountInput } from "./amountInput.js";
import { DAY_LABELS } from "../services/weeklyMenuManager.js";
import { Recipe } from "../models/recipe.js";
import { generateId } from "../utils/generateId.js";

const template = document.createElement("template");
const templateHTML = `
<div class="modal">
    <div class="modal-backdrop"></div>
    <div class="modal-body">
      <div class="modal-header">
        <h2></h2>
        <p></p>
      </div>
      <div class="modal-content">
        <p class="modal-recipe-title"></p>
        <div class="modal-daypicker"></div>
      </div>
    <div class="modal-actions">
        <button class="button button--prim">Approve</button>
        <button class="button button--sec">Cancel</button>
    </div>
    </div>
</div>
`;

template.innerHTML = templateHTML.trim();

const tagTemplate = document.createElement("template");
const tagTemplateHTML = `
<label class="tag tag--picker">
    <div class="tag__marker"></div>
    <input class="tag__input" type="checkbox" />
    <span></span>
</label>
`;
tagTemplate.innerHTML = tagTemplateHTML.trim();

export class AddToPlanModal {
  private readonly _modalElem: HTMLDivElement;
  private readonly _modalTitle: HTMLHeadingElement;
  private readonly _modalDesc: HTMLParagraphElement;
  private readonly _modalContent: HTMLDivElement;
  private readonly _modalRecipeTitle: HTMLParagraphElement;
  private readonly _modalDayPicker: HTMLDivElement;
  private readonly _servingsInput: AmountInput;
  private readonly _modalPrimBtn: HTMLButtonElement;
  private readonly _modalSecBtn?: HTMLButtonElement;
  //private readonly _onConfirm: (dayIndex: number, servingsNum: number) => void;

  constructor(
    modalTitle: string,
    modalDesc: string,
    //onConfirm: (dayIndex: number, servingsNum: number) => void,
  ) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;

    const modalContainer = fragment.querySelector<HTMLDivElement>(".modal");
    if (!modalContainer)
      throw new Error("modalContainer not found in template");
    this._modalElem = modalContainer;

    const title = this._modalElem.querySelector<HTMLHeadingElement>("h2");
    if (!title) throw new Error("title not found in template");
    this._modalTitle = title;

    const description =
      this._modalElem.querySelector<HTMLParagraphElement>("p");
    if (!description) throw new Error("description not found in template");
    this._modalDesc = description;

    const modalContent =
      fragment.querySelector<HTMLDivElement>(".modal-content");
    if (!modalContent) throw new Error("modalContent not found in template");
    this._modalContent = modalContent;

    const modalRecipeTitle = fragment.querySelector<HTMLParagraphElement>(
      ".modal-recipe-title",
    );
    if (!modalRecipeTitle)
      throw new Error("modalRecipeTitle not found in template");
    this._modalRecipeTitle = modalRecipeTitle;

    const dayPicker =
      this._modalElem.querySelector<HTMLDivElement>(".modal-daypicker");
    if (!dayPicker) throw new Error("dayPicker not found in template");
    this._modalDayPicker = dayPicker;

    const approveBtn =
      this._modalElem.querySelector<HTMLButtonElement>(".button--prim");
    if (!approveBtn) throw new Error("approveBtn not found in template");
    this._modalPrimBtn = approveBtn;

    const cancelBtn =
      this._modalElem.querySelector<HTMLButtonElement>(".button--sec");
    if (!cancelBtn) throw new Error("cancelBtn not found in template");
    this._modalSecBtn = cancelBtn;

    this._modalTitle.textContent = modalTitle;
    this._modalDesc.textContent = modalDesc;

    DAY_LABELS.forEach((l) => {
      const tagFragment = tagTemplate.content.cloneNode(
        true,
      ) as DocumentFragment;

      const dayPickerTag =
        tagFragment.querySelector<HTMLLabelElement>(".tag--picker");
      if (!dayPickerTag) throw new Error("dayPickerTag not found in template");

      const tagInput =
        dayPickerTag.querySelector<HTMLInputElement>(".tag__input");
      if (!tagInput) throw new Error("tagInput not found in template");

      const tagText = dayPickerTag.querySelector<HTMLSpanElement>("span");
      if (!tagText) throw new Error("tagText not found in template");

      const tagId = generateId("day", 4);

      dayPickerTag.setAttribute("for", tagId);
      tagInput.setAttribute("id", tagId);
      tagText.textContent = l;
      this._modalDayPicker.appendChild(dayPickerTag);
    });

    const amountInput = new AmountInput(
      "modal__servings-input",
      "numeric",
      "[0-9]*",
      "0",
      "",
      "Servings amount",
      "",
      "Remove amout of servings",
      "Add amount of servings",
    );
    this._servingsInput = amountInput;
    this._servingsInput.render(this._modalContent, "append");

    this._modalSecBtn.addEventListener("click", () => {
      this.closeModal();
    });
    //this._onConfirm = onConfirm;
  }

  render(parentSelector: string | HTMLElement, position: string): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }

    insertElem(position, this._modalElem, parentElement);
  }

  openModal(recipe: Recipe, servings: number) {
    setTimeout(() => {
      this._modalElem.classList.add("visible");
    }, 10);

    this._modalRecipeTitle.textContent = recipe.title;
    this._servingsInput.inputInput.value = String(servings);
  }

  closeModal(): void {
    this._modalElem.classList.remove("visible");
  }
}
