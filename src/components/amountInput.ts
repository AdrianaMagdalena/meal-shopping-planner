import { SERVINGS_MAX_VALUE, SERVINGS_MIN_VALUE } from "../utils/constants.js";
import { Input } from "./input.js";

export class AmountInput extends Input {
  constructor(
    inputCustomClass: string,
    inputmodeAttribute: string,
    patternAttribute: string,
    startValue?: string,
    inputLabelText?: string,
    inputAriaText?: string,
    placeholderText?: string,
    leadBtnAriaLabel?: string,
    trailBtnAriaLabel?: string,
  ) {
    super(
      inputCustomClass,
      inputLabelText,
      inputAriaText,
      placeholderText,
      leadBtnAriaLabel,
      trailBtnAriaLabel,
    );

    const amountInputField = this.inputField;
    const amountInput = this.inputInput;
    const amountMinusButton = this.leadBtn;
    const amountPlusButton = this.trailBtn;

    amountInputField.classList.add("input--amount");
    amountInput.setAttribute("inputmode", inputmodeAttribute);
    amountInput.setAttribute("pattern", patternAttribute);
    if (startValue) {
      amountInput.value = startValue;
    }

    if (!amountMinusButton || !amountPlusButton) {
      throw new Error("leadBtn and trailBtn are both required but not found");
    }

    const clamp = (value: number): number => {
      if (value < SERVINGS_MIN_VALUE) return SERVINGS_MIN_VALUE;
      if (value > SERVINGS_MAX_VALUE) return SERVINGS_MAX_VALUE;
      return value;
    };

    this.updateButtonStates();

    amountInput.addEventListener("input", () => {
      const digitsOnly = amountInput.value.replace(/\D/g, "");
      const clamped = clamp(Number(digitsOnly));
      amountInput.value = String(clamped);
      this.updateButtonStates();
    });

    amountMinusButton.addEventListener("click", () => {
      amountInput.value = String(clamp(Number(amountInput.value) - 1));
      this.updateButtonStates();
    });

    amountPlusButton.addEventListener("click", () => {
      amountInput.value = String(clamp(Number(amountInput.value) + 1));
      this.updateButtonStates();
    });
  }

  get amountInput() {
    return this.inputInput;
  }

  updateButtonStates(): void {
    const currentValue = Number(this.inputInput.value);
    this.leadBtn?.toggleAttribute(
      "disabled",
      currentValue <= SERVINGS_MIN_VALUE,
    );
    this.trailBtn?.toggleAttribute(
      "disabled",
      currentValue >= SERVINGS_MAX_VALUE,
    );
  }
}
