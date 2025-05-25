import { selected, selectedSubResult } from './selection.js';
import { createRecordLi } from './utils.js';

export let currentMatchRecords = [];

export function setupRecordHandler() {
  document.getElementById("record-btn").addEventListener("click", () => {
    const { player, shot, result } = selected;
    if (!player || !shot || !result) {
      alert("全て選択してください");
      return;
    }

    const playerName = [...document.querySelectorAll("#player-buttons button")].find(
      btn => btn.dataset.value === player
    )?.textContent || player;

    let displayResult = result;
    if (result === "×" && selectedSubResult) {
      displayResult = `${selectedSubResult}×`;
    }

    const record = `${playerName} ${shot} ${displayResult}`;
    const index = currentMatchRecords.length;
    currentMatchRecords.push(record);

    const li = createRecordLi(record, index);
    document.getElementById("record-list").appendChild(li);

    Object.keys(selected).forEach(key => selected[key] = null);
    document.querySelectorAll(".selected").forEach(btn => btn.classList.remove("selected"));
    const event = new Event("clearSubResult");
    document.dispatchEvent(event);
  });
}
