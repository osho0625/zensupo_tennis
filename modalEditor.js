import { selected, getSelectedSubResult, setSelectedSubResult } from './selection.js';
import { currentMatchRecords } from './recordManager.js';

let editIndex = null;
let editLi = null;

const modal = document.getElementById("edit-modal");
const modalPlayerBtns = document.getElementById("modal-player-buttons");
const modalShotBtns = document.getElementById("modal-shot-buttons");
const modalResultBtns = document.getElementById("modal-result-buttons");
const modalSaveBtn = document.getElementById("modal-save-btn");
const modalCancelBtn = document.getElementById("modal-cancel-btn");
const subResultBtns = document.getElementById("sub-result-buttons");
const subResultOptions = ["ネ", "バ", "サ"];

export function setupModalEditor() {
  createModalButtons(modalPlayerBtns, ["A", "B", "C", "D"], "player");
  createModalButtons(modalShotBtns, ["F", "SA", "FR", "BR", "FS", "BS", "FV", "BV", "Sm", "HV", "NVZ", "other"], "shot");
  createModalButtons(modalResultBtns, ["○", "×"], "result");

  modalSaveBtn.addEventListener("click", saveEdit);
  modalCancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  document.addEventListener("clearSubResult", () => {
    subResultBtns.innerHTML = "";
    subResultBtns.classList.add("hidden");
  });

  document.addEventListener("resultChanged", (e) => {
    toggleSubResultButtons(e.detail === "×");
  });
}

export function attachEditListenerToLi(li, index) {
  li.addEventListener("click", () => {
    editIndex = index;
    editLi = li;

    const parts = li.textContent.split(" ");
    if (parts.length !== 3) {
      alert("データ形式が不正です");
      return;
    }

    selected.player = parts[0];
    selected.shot = parts[1];
    const res = parts[2];
    if (["ネ×", "バ×", "サ×"].includes(res)) {
      selected.result = "×";
      setSelectedSubResult(res[0]);
    } else {
      selected.result = res;
      setSelectedSubResult(null);
    }

    updateModalSelections();
    modal.classList.remove("hidden");
  });
}

function toggleSubResultButtons(show) {
  subResultBtns.innerHTML = "";
  if (show) {
    subResultOptions.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        Array.from(subResultBtns.children).forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        setSelectedSubResult(opt);
      });
      subResultBtns.appendChild(btn);
    });
    subResultBtns.classList.remove("hidden");
  } else {
    subResultBtns.classList.add("hidden");
    setSelectedSubResult(null);
  }
}

function createModalButtons(container, options, type) {
  container.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.dataset.value = opt;
    btn.addEventListener("click", () => {
      Array.from(container.children).forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selected[type] = btn.dataset.value;
      if (type === "result") {
        toggleSubResultButtons(selected.result === "×");
      }
    });
    container.appendChild(btn);
  });
}

function updateModalSelections() {
  [modalPlayerBtns, modalShotBtns, modalResultBtns].forEach(container => {
    const key = container.id.replace("modal-", "").replace("-buttons", "");
    Array.from(container.children).forEach(btn => {
      btn.classList.toggle("selected", btn.dataset.value === selected[key]);
    });
  });

  toggleSubResultButtons(selected.result === "×");

  if (selected.result === "×" && getSelectedSubResult()) {
    Array.from(subResultBtns.children).forEach(btn => {
      btn.classList.toggle("selected", btn.textContent === getSelectedSubResult());
    });
  }
}

function saveEdit() {
  if (!selected.player || !selected.shot || !selected.result) {
    alert("全て選択してください");
    return;
  }

  let subRes = getSelectedSubResult();

  let newRecord = `${selected.player} ${selected.shot} ${selected.result}`;
  if (selected.result === "×" && subRes) {
    newRecord = `${selected.player} ${selected.shot} ${subRes}×`;
  }

  if (!/^[^ ]+ (F|SA|FR|BR|FS|BS|FV|BV|Sm|HV|NVZ|other) ([○×]|[ネバサ]×)$/.test(newRecord)) {
    alert("入力形式が正しくありません（例: A FR ○ または A FR ネ×）");
    return;
  }

  currentMatchRecords[editIndex] = newRecord;
  editLi.textContent = newRecord;
  modal.classList.add("hidden");

  selected.player = selected.shot = selected.result = null;
  setSelectedSubResult(null);
}
