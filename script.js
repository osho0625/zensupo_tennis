const selected = {
  player: null,
  shot: null,
  result: null,
};

let currentMatchRecords = [];  // 今の試合の記録
let allMatches = [];           // 保存した試合のリスト

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

// 記録するボタン
document.getElementById("record-btn").addEventListener("click", () => {
  const { player, shot, result } = selected;
  if (!player || !shot || !result) {
    alert("全て選択してください");
    return;
  }

  const record = `${player} ${shot} ${result}`;
  const index = currentMatchRecords.length; // 今の位置を記録
  currentMatchRecords.push(record);

  const li = document.createElement("li");
  li.textContent = record;

  // ダブルクリックで修正できるように
  li.addEventListener("dblclick", () => {
    const newRecord = prompt("修正内容を入力してください（例: A FS ○）", li.textContent);
    if (newRecord) {
      if (!/^[ABCD] (FS|BS|SV|NT) [○×]$/.test(newRecord)) {
        alert("入力形式が正しくありません（例: A FS ○）");
        return;
      }
      currentMatchRecords[index] = newRecord;
      li.textContent = newRecord;
    }
  });

  document.getElementById("record-list").appendChild(li);

  // 選択リセット
  Object.keys(selected).forEach(key => selected[key] = null);
  document.querySelectorAll(".selected").forEach(btn => btn.classList.remove("selected"));
});

// 試合終了ボタン
document.getElementById("finish-match-btn").addEventListener("click", () => {
  if (currentMatchRecords.length === 0) {
    alert("まだ記録がありません");
    return;
  }

  // 試合データをallMatchesに追加
  allMatches.push([...currentMatchRecords]);

  // 試合一覧に表示
  updateMatchList();

  // APIへ送信
  const apiUrl = 'https://tennis-api.onrender.com/api/matches'; // ご自身のURLに
  const matchData = {
    matchNumber: allMatches.length,
    records: currentMatchRecords
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(matchData),
  })
    .then(response => {
      if (!response.ok) throw new Error('送信失敗: ' + response.status);
      return response.json();
    })
    .then(data => console.log('送信成功:', data))
    .catch(error => console.error('送信エラー:', error));

  // 今の試合記録リセット
  currentMatchRecords = [];
  document.getElementById("record-list").innerHTML = "";

  alert("試合が保存されました。新しい試合を開始できます。");
});

// 試合一覧を画面に表示
function updateMatchList() {
  const matchListEl = document.getElementById("match-list");
  matchListEl.innerHTML = "";

  allMatches.forEach((matchRecords, index) => {
    const btn = document.createElement("button");
    btn.textContent = `試合 ${index + 1}：${matchRecords.length} ポイント`;
    btn.style.display = "block";
    btn.style.marginBottom = "5px";
    btn.addEventListener("click", () => {
      showMatchDetail(index);
    });
    matchListEl.appendChild(btn);
  });
}

// 詳細表示
function showMatchDetail(matchIndex) {
  const detailListEl = document.getElementById("match-detail-list");
  detailListEl.innerHTML = "";

  const matchRecords = allMatches[matchIndex];
  if (!matchRecords) {
    detailListEl.textContent = "詳細データがありません";
    return;
  }

  matchRecords.forEach((record, i) => {
    const li = document.createElement("li");
    li.textContent = `ポイント ${i + 1}: ${record}`;
    detailListEl.appendChild(li);
  });
}

// モーダル要素取得
const modal = document.getElementById("edit-modal");
const modalPlayerBtns = document.getElementById("modal-player-buttons");
const modalShotBtns = document.getElementById("modal-shot-buttons");
const modalResultBtns = document.getElementById("modal-result-buttons");
const modalSaveBtn = document.getElementById("modal-save-btn");
const modalCancelBtn = document.getElementById("modal-cancel-btn");

let editIndex = null; // 編集対象インデックス
let editLi = null;    // 編集対象の <li>

// モーダル用の選択肢を生成
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

const modalSelected = {
  player: null,
  shot: null,
  result: null,
};

// モーダルを開く関数
function openEditModal(index, liElement) {
  const record = currentMatchRecords[index]; // 例: "A FS ○"
  const [p, s, r] = record.split(" ");

  modalSelected.player = p;
  modalSelected.shot = s;
  modalSelected.result = r;

  createModalButtons(modalPlayerBtns, ["A", "B", "C", "D"], "player");
  createModalButtons(modalShotBtns, ["FS", "BS", "SV", "NT"], "shot");
  createModalButtons(modalResultBtns, ["○", "×"], "result");

  // 初期選択状態にする
  modalPlayerBtns.querySelector(`button[data-value="${p}"]`)?.classList.add("selected");
  modalShotBtns.querySelector(`button[data-value="${s}"]`)?.classList.add("selected");
  modalResultBtns.querySelector(`button[data-value="${r}"]`)?.classList.add("selected");

  editIndex = index;
  editLi = liElement;
  modal.classList.remove("hidden");
}

// 保存ボタン処理
modalSaveBtn.addEventListener("click", () => {
  const { player, shot, result } = modalSelected;
  if (!player || !shot || !result) {
    alert("すべて選択してください");
    return;
  }

  const updated = `${player} ${shot} ${result}`;
  currentMatchRecords[editIndex] = updated;
  editLi.textContent = updated;

  // 再びダブルクリックで編集可能にする
  editLi.addEventListener("dblclick", () => openEditModal(editIndex, editLi));

  modal.classList.add("hidden");
});

// キャンセルボタン処理
modalCancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// li 生成時のイベント変更（元のprompt形式のものを以下で置き換え）
function createRecordLi(record, index) {
  const li = document.createElement("li");
  li.textContent = record;
  li.addEventListener("dblclick", () => openEditModal(index, li));
  return li;
}

// 記録時の処理（既存の記録ボタンの中身のli生成部分をこれに変更）
const li = createRecordLi(record, index);
document.getElementById("record-list").appendChild(li);
