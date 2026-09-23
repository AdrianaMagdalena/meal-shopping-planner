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

    const amountInput = this.inputInput;
    const amountMinusButton = this.leadBtn;
    const amountPlusButton = this.trailBtn;

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
      if (Number(amountInput.value) > 50) amountInput.value = "50";
    });

    amountMinusButton.addEventListener("click", () => {
      amountPlusButton.removeAttribute("disabled");

      if (Number(amountInput.value) <= 1 || amountInput.value === "") {
        amountMinusButton.setAttribute("disabled", "true");
      } else {
        amountMinusButton.removeAttribute("disabled");
        amountInput.value = String(Number(amountInput.value) - 1);
      }
    });

    amountPlusButton.addEventListener("click", () => {
      amountMinusButton.removeAttribute("disabled");
      if (Number(amountInput.value) >= 50) {
        amountPlusButton.setAttribute("disabled", "true");
        amountInput.value = "50";
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
