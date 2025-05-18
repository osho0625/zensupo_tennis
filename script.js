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
  currentMatchRecords.push(record);

  const li = document.createElement("li");
  li.textContent = record;
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

  // 画面の試合一覧に追加表示
  updateMatchList();

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
    const li = document.createElement("li");
    li.textContent = `試合 ${index + 1}：${matchRecords.length} ポイント`;
    matchListEl.appendChild(li);
  });
}
