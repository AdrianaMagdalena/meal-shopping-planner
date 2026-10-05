import { isSelectorString } from "../../utils/typeGuards.js";
import { insertElem } from "../../utils/insertElem.js";
const template = document.createElement("template");
const templateHTML = `
<div class="modal">
    <div class="modal-backdrop"></div>
    <div class="modal-wrap">
      <div class="modal-body">
        <div class="modal-header">
          <h2></h2>
          <p></p>
        </div>
        <div class="modal-actions">
          <button class="button button--prim"></button>
          <button class="button button--sec"></button>
        </div>
      </div>
    </div>
</div>
`;
template.innerHTML = templateHTML.trim();
export class WarningModalComponent {
    constructor(modalTitle, modalDesc, modalSecBtnText, modalPrimBtnText, onConfirm, modalImageSrc) {
        const fragment = template.content.cloneNode(true);
        const modalContainer = fragment.querySelector(".modal");
        if (!modalContainer)
            throw new Error("modalContainer not found in template");
        this._modalElem = modalContainer;
        const modalBody = this._modalElem.querySelector(".modal-body");
        if (!modalBody)
            throw new Error("modalBody not found in template");
        this._modalBody = modalBody;
        if (modalImageSrc && modalImageSrc.length > 0) {
            const image = document.createElement("img");
            image.setAttribute("alt", "");
            image.setAttribute("src", modalImageSrc);
            this._modalBody.prepend(image);
        }
        const title = this._modalElem.querySelector("h2");
        if (!title)
            throw new Error("title not found in template");
        this._modalTitle = title;
        const description = this._modalElem.querySelector("p");
        if (!description)
            throw new Error("description not found in template");
        this._modalDesc = description;
        const primaryBtn = this._modalElem.querySelector(".button--prim");
        if (!primaryBtn)
            throw new Error("primaryBtn not found in template");
        primaryBtn.textContent = modalPrimBtnText;
        this._modalPrimBtn = primaryBtn;
        const secondaryBtn = this._modalElem.querySelector(".button--sec");
        if (!secondaryBtn)
            throw new Error("secondaryBtn not found in template");
        secondaryBtn.textContent = modalSecBtnText;
        this._modalSecBtn = secondaryBtn;
        this._modalTitle.textContent = modalTitle;
        this._modalDesc.textContent = modalDesc;
        this._modalPrimBtn.addEventListener("click", () => {
            onConfirm();
        });
        this._modalSecBtn.addEventListener("click", () => {
            this.closeModalComponent();
        });
    }
    render(parentSelector, position) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        insertElem(position, this._modalElem, parentElement);
    }
    openModalComponent() {
        setTimeout(() => {
            this._modalElem.classList.add("visible", "in-front");
        }, 10);
    }
    closeModalComponent() {
        this._modalElem.classList.remove("visible");
        setTimeout(() => {
            this._modalElem.classList.remove("in-front");
        }, 200);
    }
}
