const selected = {
  player: null,
  shot: null,
  result: null
};

const playerOptions = ['A', 'B', 'C', 'D'];
const shotOptions = [
  { value: 'FS', label: 'フォア (FS)' },
  { value: 'BS', label: 'バック (BS)' },
  { value: 'SV', label: 'サーブ (SV)' },
  { value: 'NT', label: 'ネット (NT)' }
];
const resultOptions = ['○', '×'];

function createButton(value, label = value) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.setAttribute('data-value', value);
  return btn;
}

function setupGroup(containerId, options, key, useLabel = false) {
  const container = document.getElementById(containerId);
  options.forEach(opt => {
    const value = typeof opt === 'string' ? opt : opt.value;
    const label = typeof opt === 'string' ? opt : opt.label;
    const btn = createButton(value, label);
    btn.addEventListener('click', () => {
      container.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selected[key] = value;
    });
    container.appendChild(btn);
  });
}

setupGroup('player-group', playerOptions, 'player');
setupGroup('shot-group', shotOptions, 'shot');
setupGroup('result-group', resultOptions, 'result');

document.getElementById('submit-button').addEventListener('click', () => {
  const { player, shot, result } = selected;
  if (!player || !shot || !result) {
    alert('すべての項目を選択してください。');
    return;
  }

  const li = document.createElement('li');
  li.textContent = `${player} - ${shot} - ${result}`;
  document.getElementById('record-list').appendChild(li);

  // 選択解除
  Object.keys(selected).forEach(k => selected[k] = null);
  document.querySelectorAll('.selected').forEach(btn => btn.classList.remove('selected'));
});
