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
