export const selected = {
  player: null,
  shot: null,
  result: null,
};

let selectedSubResult = null;

export function getSelectedSubResult() {
  return selectedSubResult;
}

export function setSelectedSubResult(value) {
  selectedSubResult = value;
}

export function setupSelection(groupId, key) {
  const buttons = document.querySelectorAll(`#${groupId} button`);
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      selected[key] = button.dataset.value;

      if (key === "result") {
        const event = new CustomEvent("resultChanged", { detail: selected.result });
        document.dispatchEvent(event);
      }
    });
  });
}
