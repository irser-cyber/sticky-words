function savePrefs() {
  const prefs = document.getElementById('userPrefs').value;
  localStorage.setItem('userPrefs', prefs);
  document.getElementById('input-area').style.display = 'none';
  document.getElementById('word-box').style.display = 'block';
  getWord();
}

async function getWord() {
  const prefs = localStorage.getItem('userPrefs');
  const res = await fetch(`/api/quote?prefs=${encodeURIComponent(prefs)}`);
  const data = await res.json();

  document.getElementById('word').textContent = data.word;
  document.getElementById('definition').textContent = data.definition;
  document.getElementById('quote').textContent = `"${data.quote}"`;
  document.getElementById('source').textContent =
    `— ${data.character}, ${data.title}`;
}

window.onload = () => {
  const prefs = localStorage.getItem('userPrefs');
  if (prefs) {
    document.getElementById('input-area').style.display = 'none';
    document.getElementById('word-box').style.display = 'block';
    getWord();
  }
};
