import { setupSelection } from './selection.js';
import { enablePlayerNameEditing } from './editPlayerName.js';
import { setupRecordHandler } from './recordManager.js';
import { setupMatchManager } from './matchManager.js';
import { setupModalEditor } from './modalEditor.js';

// グローバル選択状態
export const selected = {
  player: null,
  shot: null,
  result: null,
};

export let selectedSubResult = null;
export function setSelectedSubResult(value) {
  selectedSubResult = value;
}
export function getSelectedSubResult() {
  return selectedSubResult;
}

// 現在の試合と全試合データ
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
