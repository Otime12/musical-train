const KEY_TO_NOTE = {
  a: { name: 'C4', frequency: 261.63 },
  s: { name: 'D4', frequency: 293.66 },
  d: { name: 'E4', frequency: 329.63 },
  f: { name: 'F4', frequency: 349.23 },
  g: { name: 'G4', frequency: 392.0 },
  h: { name: 'A4', frequency: 440.0 },
  j: { name: 'B4', frequency: 493.88 },
  k: { name: 'C5', frequency: 523.25 },
};

let audioContext;
const keysContainer = document.getElementById('keys');
const keyElements = new Map();

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function renderKeys() {
  Object.entries(KEY_TO_NOTE).forEach(([key, note]) => {
    const keyElement = document.createElement('article');
    keyElement.className = 'key';
    keyElement.dataset.key = key;
    keyElement.innerHTML = `<kbd>${key.toUpperCase()}</kbd><div class="note">${note.name}</div>`;
    keysContainer.appendChild(keyElement);
    keyElements.set(key, keyElement);
  });
}

function setActiveKey(key, isActive) {
  const keyElement = keyElements.get(key);
  if (!keyElement) {
    return;
  }
  keyElement.classList.toggle('active', isActive);
}

function playNote(frequency) {
  const context = ensureAudioContext();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.25, context.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.35);
}

window.addEventListener('keydown', (event) => {
  if (event.repeat) {
    return;
  }

  const key = event.key.toLowerCase();
  const note = KEY_TO_NOTE[key];
  if (!note) {
    return;
  }

  setActiveKey(key, true);
  playNote(note.frequency);
});

window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  if (!KEY_TO_NOTE[key]) {
    return;
  }
  setActiveKey(key, false);
});

renderKeys();
