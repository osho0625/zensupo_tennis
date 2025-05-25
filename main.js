import { setupSelection } from './selection.js';
import { getSelectedSubResult, setSelectedSubResult } from './selection.js';
import { enablePlayerNameEditing } from './editPlayerName.js';
import { setupRecordHandler } from './recordManager.js';
import { setupMatchManager } from './matchManager.js';
import { setupModalEditor } from './modalEditor.js';

export let currentMatchRecords = [];
export let allMatches = [];

export function getCurrentMatchRecords() {
  return currentMatchRecords;
}
export function setCurrentMatchRecords(newRecords) {
  currentMatchRecords = newRecords;
}
export function getAllMatches() {
  return allMatches;
}
export function setAllMatches(newAllMatches) {
  allMatches = newAllMatches;
}

// 初期化処理
function init() {
  setupSelection("player-buttons", "player");
  setupSelection("shot-buttons", "shot");
  setupSelection("result-buttons", "result");
  enablePlayerNameEditing();
  setupRecordHandler();
  setupMatchManager();
  setupModalEditor();
}

// 実行
init();
