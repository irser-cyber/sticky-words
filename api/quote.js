const STANDS4_UID = process.env.STANDS4_UID || '13417';
const STANDS4_API_KEY = process.env.STANDS4_API_KEY || 'q8KPbOrZpfu2Rfxz';

/**
 * Serverless function to fetch a quote from STANDS4 and return
 * a complex word with its definition.
 */
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const prefs = req.query.prefs || '';
  const terms = prefs
    .split(/[,\n]+/)
    .map(t => t.trim())
    .filter(Boolean);

  try {
    let found = null;
    for (const term of terms.length ? terms : ['']) {
      found = await queryStands4(term);
      if (found) break;
    }
    if (!found) {
      res.status(404).json({ error: 'No quote found' });
      return;
    }

    const { quote, character, title } = found;
    const phrase = extractComplexPhrase(quote);
    const definition = await lookupDefinition(phrase.split(' ')[0]);

    res.status(200).json({ word: phrase, definition, quote, character, title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
};

async function queryStands4(term) {
  const params = new URLSearchParams({
    uid: STANDS4_UID,
    tokenid: STANDS4_API_KEY,
    search: term,
    format: 'json'
  });
  const url = `https://www.stands4.com/services/v2/quotes.php?${params.toString()}`;
  const apiRes = await fetch(url);
  if (!apiRes.ok) return null;
  const data = await apiRes.json();
  let item = data.result || data.results?.result || null;
  if (Array.isArray(item)) item = item[0];
  if (!item) return null;
  return {
    quote: item.quote || item.line || '',
    character: item.author || item.character || '',
    title: item.title || item.script || ''
  };
}

function extractComplexPhrase(text) {
  const words = text.split(/[^A-Za-z]+/).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    if (words[i].length >= 7) return words[i];
    if (i + 1 < words.length) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      if (phrase.length >= 10) return phrase;
    }
  }
  return words[0] || '';
}

async function lookupDefinition(word) {
  if (!word) return '';
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) return '';
    const json = await res.json();
    return json[0]?.meanings?.[0]?.definitions?.[0]?.definition || '';
  } catch {
    return '';
  }
}
