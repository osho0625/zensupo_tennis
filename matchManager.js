import { currentMatchRecords } from './recordManager.js';

export let allMatches = [];

export function setupMatchManager() {
  setupFinishMatchButton();
  updateMatchList();
}

function setupFinishMatchButton() {
  document.getElementById("finish-match-btn").addEventListener("click", () => {
    if (currentMatchRecords.length === 0) {
      alert("まだ記録がありません");
      return;
    }

    allMatches.push([...currentMatchRecords]);
    updateMatchList();

    // API送信処理（省略）

    currentMatchRecords.length = 0;
    document.getElementById("record-list").innerHTML = "";
    alert("試合が保存されました。新しい試合を開始できます。");
  });
}

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

function showMatchDetail(index) {
  const detailListEl = document.getElementById("match-detail-list");
  detailListEl.innerHTML = "";

  const records = allMatches[index];
  if (!records) {
    detailListEl.textContent = "詳細データがありません";
    return;
  }

  records.forEach((record, i) => {
    const li = document.createElement("li");
    li.textContent = `ポイント ${i + 1}: ${record}`;
    detailListEl.appendChild(li);
  });
}
