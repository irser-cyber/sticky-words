
export default async function handler(req, res) {
  const STANDS4_API_KEY = process.env.STANDS4_API_KEY;
  const STANDS4_UID = process.env.STANDS4_UID;
  const prefs = decodeURIComponent(req.query.prefs || '');

  const prefsList = prefs.split(',').map(p => p.trim()).filter(Boolean);
  const query = prefsList[Math.floor(Math.random() * prefsList.length)];

  const quoteRes = await fetch(`https://www.stands4.com/services/v2/quotes.php?uid=${STANDS4_UID}&tokenid=${STANDS4_API_KEY}&search=${query}&format=json`);
  const quoteData = await quoteRes.json();

  if (!quoteData.result || !quoteData.result.quote) {
    return res.status(404).json({ error: 'No quote found.' });
  }

  const quote = quoteData.result.quote;
  const words = quote.split(' ').filter(w => w.length > 7);
  const chosenWord = words[Math.floor(Math.random() * words.length)].replace(/[^a-zA-Z]/g, '');

  const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${chosenWord}`);
  const dictData = await dictRes.json();
  const definition = dictData[0]?.meanings[0]?.definitions[0]?.definition || "Definition not found";

  res.status(200).json({
    word: chosenWord,
    definition,
    quote,
    character: quoteData.result.author,
    title: quoteData.result.title
  });
}
