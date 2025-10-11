# Azeez Adewale Hamzat - Personal Academic Website

Professional personal website for Azeez Adewale Hamzat, PhD student in AI-facilitated Collective Intelligence at TU Dublin.

## 🌐 Live Site
[azeezhamzat.com](https://azeezhamzat.com)

## 📋 Overview

This is a modern, responsive academic website built with pure HTML, CSS, and JavaScript (no frameworks). The site features:

- **Home** - Introduction and research highlights
- **Research** - Detailed research interests and projects
- **Publications** - Academic publications and works in progress
- **Blog** - Academic blog with easy-to-update system
- **Contact** - Contact form and information

## ✨ Features

- 🎨 Modern, professional design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast loading and optimized performance
- ♿ WCAG 2.1 AA accessibility compliant
- 🔍 SEO-optimized with proper meta tags
- 📝 Easy blog post management (Markdown + JSON)
- 🎯 Clean, maintainable code
- 🚀 Ready for deployment on GitHub Pages, Netlify, or Vercel

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **JavaScript** - Vanilla JS (no frameworks)
- **Marked.js** - Markdown parser for blog posts
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Poppins, Inter)

## 📁 File Structure

```
website/
├── index.html              # Homepage
├── research.html           # Research page
├── publications.html       # Publications page
├── blog.html              # Blog index
├── contact.html           # Contact page
├── 404.html               # Error page
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine instructions
├── feed.xml               # RSS feed
│
├── css/
│   ├── variables.css      # CSS custom properties
│   ├── main.css          # Main styles
│   ├── blog.css          # Blog-specific styles
│   └── responsive.css    # Media queries
│
├── js/
│   ├── main.js           # Core functionality
│   ├── blog.js           # Blog system
│   └── animations.js     # Scroll effects
│
├── blog/
│   ├── posts.json        # Blog metadata (easy to update!)
│   ├── post.html         # Blog post template
│   └── posts/            # Markdown blog posts
│
├── images/               # All images
├── docs/                 # Downloadable files (CV)
│
└── Documentation files:
    ├── README.md
    ├── BLOG_GUIDE.md
    ├── UPDATE_GUIDE.md
    └── DEPLOYMENT_GUIDE.md
```

## 🚀 Quick Start

### Local Development

1. **Clone or download** this repository
2. **Open `index.html`** in your browser
3. **Done!** No build process or dependencies needed

### Adding Blog Posts

See [BLOG_GUIDE.md](BLOG_GUIDE.md) for detailed instructions.

**Quick version:**
1. Create a markdown file in `blog/posts/`
2. Add an entry to `blog/posts.json`
3. Add a featured image to `images/blog/`

## 📝 Updating Content

### Personal Information
- Edit text directly in HTML files
- Update CV by replacing `docs/CV_Azeez_Hamzat.pdf`

### Images
- Replace images in the `images/` folder
- Keep the same filenames or update references in HTML

### Contact Form
- Configure Formspree: https://formspree.io
- Replace `YOUR_FORM_ID` in `contact.html`

See [UPDATE_GUIDE.md](UPDATE_GUIDE.md) for comprehensive update instructions.

## 🌐 Deployment

This site can be deployed to:
- **GitHub Pages** (Free)
- **Netlify** (Free)
- **Vercel** (Free)
- Any static hosting service

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step deployment instructions.

## ✅ Performance & Optimization

- ⚡ Optimized images (WebP with fallbacks)
- 🎯 Lazy loading for below-fold images
- 📦 Minified assets
- 🔍 SEO-optimized markup
- ♿ WCAG 2.1 AA compliant
- 📱 Mobile-first responsive design

## 📊 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 🔒 Security

- HTTPS required
- Form spam protection (honeypot + Formspree)
- No inline JavaScript
- Content Security Policy headers recommended

## 📖 Documentation

- **[BLOG_GUIDE.md](BLOG_GUIDE.md)** - How to add and manage blog posts
- **[UPDATE_GUIDE.md](UPDATE_GUIDE.md)** - How to update content
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - How to deploy the site

## 🤝 Support

For issues or questions:
- Check the documentation files
- Review the code comments
- Test in browser console for errors

## 📄 License

© 2025 Azeez Adewale Hamzat. All rights reserved.

## 🎯 Key Design Decisions

### Why No Framework?
- **Simplicity**: Easy to understand and modify
- **Performance**: No framework overhead
- **Longevity**: Won't break when frameworks update
- **Learning**: Clear code structure for anyone to understand

### Blog System
- **Markdown**: Easy to write content
- **JSON**: Simple metadata management
- **No Database**: Fast, secure, easy to backup

### Styling Approach
- **CSS Custom Properties**: Easy to customize colors/spacing
- **BEM-inspired**: Clear, maintainable class names
- **Mobile-First**: Designed for mobile, enhanced for desktop

## 🔄 Future Enhancements (Optional)

Potential additions you might consider:
- Dark mode toggle
- Search functionality across all content
- Comment system for blog posts
- Newsletter signup
- More interactive visualizations
- Project showcase section

## 📞 Contact

**Azeez Adewale Hamzat**
- Email: azeezhamzat@yahoo.com
- Website: azeezhamzat.com
- LinkedIn: [linkedin.com/in/azeezhamzat](https://linkedin.com/in/azeezhamzat)
- Twitter: [@Azeez_A_Hamzat](https://twitter.com/Azeez_A_Hamzat)

---

Built with ❤️ using HTML, CSS, and JavaScript