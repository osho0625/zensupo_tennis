import { attachEditListenerToLi } from './modalEditor.js';

export function createRecordLi(text, index) {
  const li = document.createElement("li");
  li.textContent = text;

  attachEditListenerToLi(li, index); // 編集機能を追加

  return li;
}
