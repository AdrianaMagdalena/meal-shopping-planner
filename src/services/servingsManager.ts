import { AmountInput } from "../components/amountInput.js";
import { Recipe } from "../models/recipe.js";
import { roundIngredients } from "../utils/roundIngredients.js";

export class ServingsManager {
  private readonly _recipe: Recipe;
  private readonly _servingsInput: AmountInput;
  private readonly _previewElem: HTMLElement;
  private _debounceTimer?: number;

  constructor(
    recipe: Recipe,
    servingsInput: AmountInput,
    previewElem: HTMLElement,
  ) {
    this._recipe = recipe;
    this._servingsInput = servingsInput;
    this._previewElem = previewElem;

    this._servingsInput.inputInput.addEventListener("input", () => {
      this.scheduleRecalc();
    });
    if (!this._servingsInput.leadBtn) throw new Error("Missing lead button");
    this._servingsInput.leadBtn.addEventListener("click", () => {
      this.scheduleRecalc();
    });
    if (!this._servingsInput.trailBtn) throw new Error("Missing trail button");
    this._servingsInput.trailBtn.addEventListener("click", () => {
      this.scheduleRecalc();
    });
  }

  scheduleRecalc(): void {
    clearTimeout(this._debounceTimer);
    this._debounceTimer = window.setTimeout(() => {
      this.recalculateIngerdients();
    }, 500);
  }

  recalculateIngerdients(): void {
    const newServings = Number(this._servingsInput.inputInput.value);
    if (Number.isNaN(newServings) || newServings < 1 || newServings > 50)
      return;

    const ratio = newServings / this._recipe.servings;
    const ingredients = this._previewElem.querySelectorAll<HTMLLIElement>(
      ".ingredients__wrap li",
    );

    ingredients.forEach((i) => {
      const originalAmount = Number(i.dataset.originalAmount);
      const ingrAmountWrap = i.querySelector(".ingredients__ingr-amount");
      if (!ingrAmountWrap) throw new Error("ingrAmountWrap not found");
      const newAmount = originalAmount * ratio;
      ingrAmountWrap.textContent = `${roundIngredients(newAmount)}`;
    });
  }
}
