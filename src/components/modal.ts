import { isSelectorString } from "../utils/typeGuards.js";
import { insertElem } from "../utils/insertElem.js";

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
        </div>
      </div>
    </div>
</div>
`;

template.innerHTML = templateHTML.trim();

export class Modal {
  private readonly _modalElem: HTMLDivElement;
  private readonly _modalBody: HTMLDivElement;
  private readonly _modalTitle: HTMLHeadingElement;
  private readonly _modalDesc: HTMLParagraphElement;
  private readonly _modalPrimBtn: HTMLButtonElement;

  constructor(
    modalTitle: string,
    modalDesc: string,
    modalPrimBtnText: string,
    modalImageSrc?: string,
  ) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;

    const modalContainer = fragment.querySelector<HTMLDivElement>(".modal");
    if (!modalContainer)
      throw new Error("modalContainer not found in template");
    this._modalElem = modalContainer;

    const modalBody =
      this._modalElem.querySelector<HTMLDivElement>(".modal-body");
    if (!modalBody) throw new Error("modalBody not found in template");
    this._modalBody = modalBody;

    if (modalImageSrc && modalImageSrc.length > 0) {
      const image = document.createElement("img");
      image.setAttribute("alt", "");
      image.setAttribute("src", modalImageSrc);
      this._modalBody.prepend(image);
    }

    const title = this._modalElem.querySelector<HTMLHeadingElement>("h2");
    if (!title) throw new Error("title not found in template");
    this._modalTitle = title;

    const description =
      this._modalElem.querySelector<HTMLParagraphElement>("p");
    if (!description) throw new Error("description not found in template");
    this._modalDesc = description;

    const primaryBtn =
      this._modalElem.querySelector<HTMLButtonElement>(".button--prim");
    if (!primaryBtn) throw new Error("primaryBtn not found in template");
    primaryBtn.textContent = modalPrimBtnText;
    this._modalPrimBtn = primaryBtn;

    this._modalTitle.textContent = modalTitle;
    this._modalDesc.textContent = modalDesc;

    this._modalPrimBtn.addEventListener("click", () => {
      this.closeModal();
    });
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

  openModal() {
    setTimeout(() => {
      this._modalElem.classList.add("visible", "in-front");
    }, 10);
  }

  closeModal(): void {
    this._modalElem.classList.remove("visible");
    setTimeout(() => {
      this._modalElem.classList.remove("in-front");
    }, 200);
  }
}
