const selected = {
  player: null,
  shot: null,
  result: null,
};

let selectedSubResult = null;

let currentMatchRecords = [];
let allMatches = [];

function setupSelection(groupId, key) {
  const buttons = document.querySelectorAll(`#${groupId} button`);
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      selected[key] = button.dataset.value;

      if (key === "result") {
        toggleSubResultButtons(selected.result === "×");
      }
    });
  });
}

function enablePlayerNameEditing() {
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
        let newName = input.value.trim();
        if (newName === "") newName = originalName;

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

setupSelection("player-buttons", "player");
setupSelection("shot-buttons", "shot");
setupSelection("result-buttons", "result");
enablePlayerNameEditing();

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
  selectedSubResult = null;
  document.querySelectorAll(".selected").forEach(btn => btn.classList.remove("selected"));
  toggleSubResultButtons(false);
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
    .then(response => {
      if (!response.ok) throw new Error('送信失敗: ' + response.status);
      return response.json();
    })
    .then(data => console.log('送信成功:', data))
    .catch(error => console.error('送信エラー:', error));

  currentMatchRecords = [];
  document.getElementById("record-list").innerHTML = "";

  alert("試合が保存されました。新しい試合を開始できます。");
});

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

const modal = document.getElementById("edit-modal");
const modalPlayerBtns = document.getElementById("modal-player-buttons");
const modalShotBtns = document.getElementById("modal-shot-buttons");
const modalResultBtns = document.getElementById("modal-result-buttons");
const modalSaveBtn = document.getElementById("modal-save-btn");
const modalCancelBtn = document.getElementById("modal-cancel-btn");
const subResultBtns = document.getElementById("sub-result-buttons");
const subResultOptions = ["ネ", "バ", "サ"];

let editIndex = null;
let editLi = null;

function toggleSubResultButtons(show) {
  subResultBtns.innerHTML = "";
  selectedSubResult = null;
  if (show) {
    subResultOptions.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        Array.from(subResultBtns.children).forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedSubResult = opt;
      });
      subResultBtns.appendChild(btn);
    });
    subResultBtns.classList.remove("hidden");
  } else {
    subResultBtns.classList.add("hidden");
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

createModalButtons(modalPlayerBtns, ["A", "B", "C", "D"], "player");
createModalButtons(modalShotBtns, ["F", "FR", "BR", "FS", "BS", "FV", "BV", "Sm", "HV", "NVZ", "other"], "shot");
createModalButtons(modalResultBtns, ["○", "×"], "result");

function createRecordLi(text, index) {
  const li = document.createElement("li");
  li.textContent = text;

  li.addEventListener("click", () => {
    editIndex = index;
    editLi = li;

    const parts = text.split(" ");
    if (parts.length !== 3) {
      alert("データ形式が不正です");
      return;
    }

    selected.player = parts[0];
    selected.shot = parts[1];
    const res = parts[2];
    if (["ネ×", "バ×", "サ×"].includes(res)) {
      selected.result = "×";
      selectedSubResult = res[0];
    } else {
      selected.result = res;
      selectedSubResult = null;
    }

    updateModalSelections();
    modal.classList.remove("hidden");
  });

  return li;
}

function updateModalSelections() {
  [modalPlayerBtns, modalShotBtns, modalResultBtns].forEach(container => {
    Array.from(container.children).forEach(btn => {
      const key = container.id.replace("modal-", "").replace("-buttons", "");
      btn.classList.toggle("selected", btn.dataset.value === selected[key]);
    });
  });

  toggleSubResultButtons(selected.result === "×");

  if (selected.result === "×" && selectedSubResult) {
    Array.from(subResultBtns.children).forEach(btn => {
      btn.classList.toggle("selected", btn.textContent === selectedSubResult);
    });
  }
}

modalSaveBtn.addEventListener("click", () => {
  if (!selected.player || !selected.shot || !selected.result) {
    alert("全て選択してください");
    return;
  }

  let newRecord = `${selected.player} ${selected.shot} ${selected.result}`;
  if (selected.result === "×" && selectedSubResult) {
    newRecord = `${selected.player} ${selected.shot} ${selectedSubResult}×`;
  }

  if (!/^[^ ]+ (F|FR|BR|FS|BS|FV|BV|Sm|HV|NVZ|other) ([○×]|[ネバサ]×)$/.test(newRecord)) {
    alert("入力形式が正しくありません（例: A FR ○ または A FR ネ×）");
    return;
  }

  currentMatchRecords[editIndex] = newRecord;
  editLi.textContent = newRecord;
  modal.classList.add("hidden");

  selected.player = selected.shot = selected.result = null;
  selectedSubResult = null;
});

modalCancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});
