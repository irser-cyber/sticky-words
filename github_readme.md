# Sticky Words - Movie & TV Edition

![Sticky Words Screenshot](https://img.shields.io/badge/Status-Ready%20for%20Deployment-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

A sophisticated vocabulary-building web app that teaches complex words from movies and TV shows. Features real script integration via the STANDS4 Scripts API.

## 🎬 Features

- **Curated Complex Words**: 12+ sophisticated words commonly found in movies and TV
- **Real Script Integration**: Connect to actual movie scripts via STANDS4 API
- **Interactive Learning**: Audio pronunciation, favorites, and progress tracking
- **Responsive Design**: Works perfectly on desktop and mobile
- **Progress Statistics**: Track learned words, favorites, and daily streaks
- **Modern UI**: Glassmorphism design with smooth animations

## 🚀 Live Demo

[View Live Demo](https://yourusername.github.io/sticky-words) *(Update with your GitHub Pages URL)*

## 📱 Screenshots

| Desktop View | Mobile View |
|--------------|-------------|
| ![Desktop](screenshots/desktop.png) | ![Mobile](screenshots/mobile.png) |

## 🛠️ Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" → main branch
4. Your app will be live at `https://yourusername.github.io/sticky-words`

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/sticky-words.git
cd sticky-words

# Serve locally (Python 3)
python -m http.server 8000

# Or with Node.js
npx serve .

# Visit http://localhost:8000
```

## 🔑 API Setup (Optional)

To connect real movie scripts:

1. **Get API Credentials**:
   - Visit [STANDS4 Scripts API](https://www.scripts.com/api.php)
   - Sign up for free (100 queries/day)
   - Get your User ID and Token ID

2. **Configure the App**:
   ```javascript
   // In js/app.js, update the API_CONFIG:
   const API_CONFIG = {
       uid: 'your_user_id_here',
       tokenid: 'your_token_id_here',
       baseUrl: 'https://www.stands4.com/services/v2/scripts.php',
       enabled: true
   };
   ```

3. **Deploy**: Push changes to GitHub and your live app will automatically update

## 📁 Project Structure

```
sticky-words/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styles and animations
├── js/
│   ├── app.js              # Main application logic
│   ├── words-database.js   # Curated word definitions
│   └── api-service.js      # STANDS4 API integration
├── assets/
│   ├── icons/              # App icons and favicons
│   └── screenshots/        # App screenshots
├── README.md               # This file
├── LICENSE                 # MIT License
└── .gitignore              # Git ignore rules
```

## 🎯 Usage

1. **Learn New Words**: Click "New Word" to discover sophisticated vocabulary
2. **Hear Pronunciation**: Use the "🔊 Pronounce" button for audio
3. **Save Favorites**: Mark words you want to remember with "♥ Favorite"
4. **Track Progress**: View your learning statistics at the bottom
5. **Real Scripts**: With API connected, see which actual movies/TV shows use these words

## 🔧 Customization

### Adding New Words
Edit `js/words-database.js`:
```javascript
{
    word: "Perspicacious",
    pronunciation: "/ˌpɜːrspɪˈkeɪʃəs/",
    definition: "Having keen insight and understanding.",
    example: "The detective's perspicacious observation solved the case.",
    source: "Common in crime dramas and mystery films",
    category: "detective"
}
```

### Styling Changes
Modify `css/styles.css` to customize:
- Color schemes
- Animations
- Layout
- Typography

### API Integration
Extend `js/api-service.js` to add:
- Additional APIs (TMDB, OMDb, etc.)
- Caching mechanisms
- Error handling improvements

## 📊 Technical Details

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **APIs**: STANDS4 Scripts API integration
- **Storage**: Browser memory (no localStorage for Claude.ai compatibility)
- **Performance**: Lazy loading, efficient DOM updates
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Browser Support**: Modern browsers (Chrome 60+, Firefox 55+, Safari 12+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test on multiple devices/browsers
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **STANDS4**: For providing the Scripts API
- **Movie Scripts**: Educational fair use of script metadata
- **Design Inspiration**: Modern glassmorphism and neumorphism trends
- **Typography**: Georgia serif font for readability

## 🐛 Known Issues

- API calls may occasionally timeout (automatic fallback included)
- Speech synthesis varies by browser
- Mobile Safari may require user interaction for audio

## 🗺️ Roadmap

- [ ] Daily word notifications
- [ ] Word difficulty levels
- [ ] Social sharing features
- [ ] Offline mode with service workers
- [ ] Multiple language support
- [ ] Word categories and filtering
- [ ] Backend user accounts
- [ ] Mobile app version

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/sticky-words/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/sticky-words/discussions)
- **Email**: your.email@example.com

---

**Made with ❤️ for vocabulary enthusiasts and movie lovers**