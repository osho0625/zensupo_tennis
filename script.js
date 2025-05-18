const selected = {
  player: null,
  shot: null,
  result: null,
};

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
  const li = document.createElement("li");
  li.textContent = record;
  document.getElementById("record-list").appendChild(li);

  // 選択リセット
  Object.keys(selected).forEach(key => selected[key] = null);
  document.querySelectorAll(".selected").forEach(btn => btn.classList.remove("selected"));
});
