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

    const MIN_VALUE = 1;
    const MAX_VALUE = 50;

    amountInputField.classList.add("input--amount");
    amountInput.setAttribute("inputmode", inputmodeAttribute);
    amountInput.setAttribute("pattern", patternAttribute);
    if (startValue) {
      amountInput.value = startValue;
    }

    if (!amountMinusButton || !amountPlusButton) {
      throw new Error("leadBtn and trailBtn are both required but not found");
    }

    amountInput.addEventListener("input", () => {
      amountInput.value = amountInput.value.replace(/\D/g, "");

      if (Number(amountInput.value) >= MAX_VALUE) {
        amountInput.value = String(MAX_VALUE);
        amountPlusButton.setAttribute("disabled", "true");
      } else if (Number(amountInput.value) <= MIN_VALUE) {
        amountInput.value = String(MIN_VALUE);
        amountMinusButton.setAttribute("disabled", "true");
      } else {
        amountPlusButton.removeAttribute("disabled");
        amountMinusButton.removeAttribute("disabled");
      }
    });

    amountMinusButton.addEventListener("click", () => {
      amountPlusButton.removeAttribute("disabled");

      if (Number(amountInput.value) <= MIN_VALUE || amountInput.value === "") {
        amountMinusButton.setAttribute("disabled", "true");
      } else if (Number(amountInput.value) === MIN_VALUE + 1) {
        amountInput.value = String(Number(amountInput.value) - 1);
        amountMinusButton.setAttribute("disabled", "true");
      } else {
        amountInput.value = String(Number(amountInput.value) - 1);
      }
    });

    amountPlusButton.addEventListener("click", () => {
      amountMinusButton.removeAttribute("disabled");
      if (Number(amountInput.value) >= MAX_VALUE) {
        amountPlusButton.setAttribute("disabled", "true");
        amountInput.value = String(MAX_VALUE);
      } else if (Number(amountInput.value) === MAX_VALUE - 1) {
        amountInput.value = String(Number(amountInput.value) + 1);
        amountPlusButton.setAttribute("disabled", "true");
      } else {
        amountPlusButton.removeAttribute("disabled");
        amountInput.value = String(Number(amountInput.value) + 1);
      }
    });
  }

  get amountInput() {
    return this.inputInput;
  }
}
