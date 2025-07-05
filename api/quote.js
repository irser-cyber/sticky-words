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
  const params = new URLSearchParams({
    uid: STANDS4_UID,
    tokenid: STANDS4_API_KEY,
    search: prefs,
    format: 'json'
  });

  const url = `https://www.stands4.com/services/v2/quotes.php?${params.toString()}`;

  try {
    const apiRes = await fetch(url);
    if (!apiRes.ok) throw new Error(`API error ${apiRes.status}`);

    const data = await apiRes.json();
    let item = data.result || data.results?.result || {};
    if (Array.isArray(item)) item = item[0];

    const quote = item.quote || item.line || '';
    const character = item.author || item.character || '';
    const title = item.title || item.script || '';
    const word = extractComplexWord(quote);
    const definition = await lookupDefinition(word);

    res.status(200).json({ word, definition, quote, character, title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
};

function extractComplexWord(text) {
  const words = text.split(/[^A-Za-z]+/).filter(Boolean);
  return words.find(w => w.length >= 7) || words[0] || '';
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
