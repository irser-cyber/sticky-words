
# Word-a-Day from Your Favorite Movies, Shows, or Songs 🎬🎵📺

This app fetches a daily complex word from quotes in your favorite movies, TV shows, or songs — and tells you what it means.

## Features
- Personalized input (movies, shows, artists)
- Daily random quote from STANDS4
- Complex word extraction
- Dictionary definition lookup
- Stylish retro UI

## Setup & Deploy
1. Add your `.env` file with:
```
STANDS4_API_KEY=q8KPbOrZpfu2Rfxz
STANDS4_UID=13417
```
2. Deploy to [Vercel](https://vercel.com) — works out of the box.

### How it Works
1. Enter one or more movie titles, TV series, or musicians separated by commas.
2. The backend searches each item for a matching quote and picks the first result.
3. From that quote we extract a complex word or short phrase, look up its meaning, and display the quote with its source.
