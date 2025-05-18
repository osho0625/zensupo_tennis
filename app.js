const form = document.getElementById('record-form');
const list = document.getElementById('record-list');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const player = document.getElementById('player').value;
  const shot = document.getElementById('shot').value;
  const result = document.getElementById('result').value;

  const item = document.createElement('li');
  item.textContent = `${player} - ${shot} - ${result}`;
  list.appendChild(item);

  form.reset();
});
