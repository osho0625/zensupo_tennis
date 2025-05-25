import { selected, getSelectedSubResult, setSelectedSubResult } from './selection.js';
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
    const subResult = getSelectedSubResult();
    if (result === "×" && subResult) {
      displayResult = `${subResult}×`;
    }

    const record = `${playerName} ${shot} ${displayResult}`;
    const index = currentMatchRecords.length;
    currentMatchRecords.push(record);

    const li = createRecordLi(record, index);
    document.getElementById("record-list").appendChild(li);

    Object.keys(selected).forEach(key => selected[key] = null);
    setSelectedSubResult(null);

    document.querySelectorAll(".selected").forEach(btn => btn.classList.remove("selected"));
    const event = new Event("clearSubResult");
    document.dispatchEvent(event);
  });
}
