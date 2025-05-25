import { setupSelection } from './selection.js';

export function enablePlayerNameEditing() {
  const buttons = document.querySelectorAll("#player-buttons button");
  buttons.forEach(button => {
    button.addEventListener("dblclick", () => {
      const originalName = button.textContent;
      const originalValue = button.dataset.value;

      const input = document.createElement("input");
      input.type = "text";
      input.value = originalName;
      input.className = "player-name-input";
      input.style.width = "3em";

      button.replaceWith(input);
      input.focus();
      input.select();

      function confirmEdit() {
        let newName = input.value.trim() || originalName;

        const newButton = document.createElement("button");
        newButton.textContent = newName;
        newButton.dataset.value = originalValue;
        input.replaceWith(newButton);

        setupSelection("player-buttons", "player");
        enablePlayerNameEditing();
      }

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") confirmEdit();
        if (e.key === "Escape") {
          input.value = originalName;
          input.blur();
        }
      });

      input.addEventListener("blur", confirmEdit);
    });
  });
}
