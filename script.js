const selected = { player: null, shot: null, result: null };
let currentMatchRecords = [];
let allMatches = [];

function setupSelection(groupId, key) {
  const buttons = document.querySelectorAll(`#${groupId} button`);
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      selected[key] = button.dataset.value;
    });
  });
}

setupSelection("player-buttons", "player");
setupSelection("shot-buttons", "shot");
setupSelection("result-buttons", "result");

document.getElementById("record-btn").addEventListener("click", () => {
  const { player, shot, result } = selected;
  if (!player || !shot || !result) {
    alert("全て選択してください");
    return;
  }

  const record = `${player} ${shot} ${result}`;
  const index = currentMatchRecords.length;
  currentMatchRecords.push(record);

  const li = createRecordLi(record, index);
  document.getElementById("record-list").appendChild(li);

  Object.keys(selected).forEach(k => selected[k] = null);
  document.querySelectorAll(".selected").forEach(btn => btn.classList.remove("selected"));
});

document.getElementById("finish-match-btn").addEventListener("click", () => {
  if (currentMatchRecords.length === 0) {
    alert("まだ記録がありません");
    return;
  }

  allMatches.push([...currentMatchRecords]);
  updateMatchList();

  const apiUrl = 'https://tennis-api.onrender.com/api/matches';
  const matchData = {
    matchNumber: allMatches.length,
    records: currentMatchRecords
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(matchData),
  })
  .then(res => {
    if (!res.ok) throw new Error('送信失敗');
    return res.json();
  })
  .then(data => console.log("送信成功:", data))
  .catch(err => console.error("送信エラー:", err));

  currentMatchRecords = [];
  document.getElementById("record-list").innerHTML = "";
  alert("試合が保存されました。新しい試合を開始できます。");
});

function updateMatchList() {
  const matchListEl = document.getElementById("match-list");
  matchListEl.innerHTML = "";
  allMatches.forEach((match, idx) => {
    const btn = document.createElement("button");
    btn.textContent = `試合 ${idx + 1}：${match.length} ポイント`;
    btn.addEventListener("click", () => showMatchDetail(idx));
    matchListEl.appendChild(btn);
  });
}

function showMatchDetail(index) {
  const detailListEl = document.getElementById("match-detail-list");
  detailListEl.innerHTML = "";
  allMatches[index].forEach((rec, i) => {
    const li = document.createElement("li");
    li.textContent = `ポイント ${i + 1}: ${rec}`;
    detailListEl.appendChild(li);
  });
}

// モーダル関連
const modal = document.getElementById("edit-modal");
const modalPlayerBtns = document.getElementById("modal-player-buttons");
const modalShotBtns = document.getElementById("modal-shot-buttons");
const modalResultBtns = document.getElementById("modal-result-buttons");
const modalSaveBtn = document.getElementById("modal-save-btn");
const modalCancelBtn = document.getElementById("modal-cancel-btn");

const modalSelected = { player: null, shot: null, result: null };
let editIndex = null;
let editLi = null;

function createModalButtons(container, options, type) {
  container.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.dataset.value = opt;
    btn.addEventListener("click", () => {
      container.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      modalSelected[type] = opt;
    });
    container.appendChild(btn);
  });
}

function openEditModal(index, liElement) {
  const [p, s, r] = currentMatchRecords[index].split(" ");
  modalSelected.player = p;
  modalSelected.shot = s;
  modalSelected.result = r;

  createModalButtons(modalPlayerBtns, ["A", "B", "C", "D"], "player");
  createModalButtons(modalShotBtns, ["FS", "BS", "SV", "NT"], "shot");
  createModalButtons(modalResultBtns, ["○", "×"], "result");

  modalPlayerBtns.querySelector(`button[data-value="${p}"]`)?.classList.add("selected");
  modalShotBtns.querySelector(`button[data-value="${s}"]`)?.classList.add("selected");
  modalResultBtns.querySelector(`button[data-value="${r}"]`)?.classList.add("selected");

  editIndex = index;
  editLi = liElement;
  modal.classList.remove("hidden");
}

modalSaveBtn.addEventListener("click", () => {
  const { player, shot, result } = modalSelected;
  if (!player || !shot || !result) {
    alert("すべて選択してください");
    return;
  }
  const updated = `${player} ${shot} ${result}`;
  currentMatchRecords[editIndex] = updated;
  editLi.textContent = updated;
  editLi.addEventListener("dblclick", () => openEditModal(editIndex, editLi));
  modal.classList.add("hidden");
});

modalCancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

function createRecordLi(record, index) {
  const li = document.createElement("li");
  li.textContent = record;
  li.addEventListener("dblclick", () => openEditModal(index, li));
  return li;
}
