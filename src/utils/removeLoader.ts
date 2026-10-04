export const removeLoader = () => {
  document.querySelector<HTMLDivElement>("#loading-overlay")?.remove();
};
