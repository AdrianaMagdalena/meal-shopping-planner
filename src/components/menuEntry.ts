import { WeeklyMenuEntry } from "../models/weeklyMenuEntry.js";
import { insertElem } from "../utils/insertElem.js";
import { isSelectorString } from "../utils/typeGuards.js";
import { AmountInput } from "./amountInput.js";

const template = document.createElement("template");
const templateHTML = `
<div class="day-menu__entry">
    <button class="button button--sec button--icon-only 
        button--mini button--trash"
        aria-label="Remove entry"></button>
    <p class="day-menu__recipe-title"></p>
</div>
`;
template.innerHTML = templateHTML.trim();

export class MenuEntry {
  private readonly _entryElem: HTMLDivElement;
  private readonly _removeButton: HTMLButtonElement;
  private readonly _recipeTitle: HTMLParagraphElement;
  private readonly _servingsInput: AmountInput;

  constructor(entry: WeeklyMenuEntry, onRemove: (entryId: string) => void) {
    const entryServings = String(entry.servingsAmount);

    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const entryElem =
      fragment.querySelector<HTMLDivElement>(".day-menu__entry");
    if (!entryElem) throw new Error("entry not found in template");
    this._entryElem = entryElem;

    const removeBtn =
      this._entryElem.querySelector<HTMLButtonElement>(".button--trash");
    if (!removeBtn) throw new Error("removeBtn not found in template");
    this._removeButton = removeBtn;

    const title = this._entryElem.querySelector<HTMLParagraphElement>(
      ".day-menu__recipe-title",
    );
    if (!title) throw new Error("title not found in template");
    this._recipeTitle = title;

    this._recipeTitle.textContent = entry.recipeTitle;
    const entryServingsInput = new AmountInput(
      "day-menu__servings",
      "numeric",
      "[0-9]*",
      entryServings,
      "",
      "Recipe servings",
      "",
      "Remove amout of servings",
      "Add amount of servings",
    );
    this._servingsInput = entryServingsInput;
    this._servingsInput.render(this._entryElem, "append");

    this._removeButton.addEventListener("click", () => {
      onRemove(entry.id);
    });
  }

  render(parentSelector: string | HTMLElement, position: string): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }

    insertElem(position, this._entryElem, parentElement);
  }
}
