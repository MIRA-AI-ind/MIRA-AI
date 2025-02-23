# AI Chat Interface

A modern chat interface powered by Cloudflare Workers AI and other AI services.

## Features and Roadmap

### Core Features
- ✅ Modern, responsive UI
- ✅ Dark/Light theme support
- ✅ Theme persistence
- ✅ Code syntax highlighting
- ✅ Copy code functionality
- ✅ Chat history
- ✅ Mobile-friendly design
- ✅ Local storage persistence
- ✅ Chat deletion
- ✅ Branded loading screen
- ✅ Fixed mobile navigation
- ✅ Markdown rendering
- ✅ Auto-save functionality
- ✅ Animated UI transitions
- ✅ Interactive details modal
- ✅ Typing indicator animation
- ✅ Multi-line message support
- ✅ Enhanced chat list UI
- ✅ Improved mobile accessibility
- ✅ Visual active chat indicators
- ✅ Chat renaming functionality
- ✅ Secure chat export/import (.mira files)
- ✅ End-to-end encrypted sharing
- ✅ Chat search functionality
- ✅ Most recent chats first
- ✅ Image generation support (/art command)
- 🚧 Enhanced .mira file format for images
- 🚧 Image export/import in chat history
- 🚧 Image preview and gallery view

### AI Commands
- ✅ Basic chat using Cloudflare Workers AI (Llama 2)
- 🚧 `/think` command using Hugging Face's DeepSeek R1 API (Coming Soon)
- 🚧 `/art` command using Cloudflare AI's image generation (Planned)
- 🚧 `/voice` command for voice messages (Planned)

### Upcoming Features
- 🚧 Message persistence using Cloudflare KV
- 🚧 User authentication
- 🚧 Cloud sync functionality
- 🚧 Multi-device chat history sync
- 🚧 Session management
- 🚧 Real-time collaboration
- 🚧 Custom system prompts
- 🚧 Multiple model support
- 🚧 Real-time streaming responses
- 🚧 File attachments
- 🚧 Code execution for supported languages
- 🚧 Chat renaming
- 🚧 Chat search/filter
- 🚧 Chat categories
- 🚧 Message reactions
- 🚧 Message editing
- 🚧 Message deletion

### Technical Improvements
- 🚧 Response streaming
- 🚧 Better error handling
- 🚧 Rate limiting
- 🚧 Message retry mechanism
- 🚧 Progressive Web App (PWA) support
- 🚧 Performance optimizations
- 🚧 Automated testing
- 🚧 Offline support
- 🚧 Better mobile animations
- 🚧 Voice input support
- 🚧 Accessibility improvements

## Setup

### Prerequisites
- Node.js >= 18.20.5
- npm >= 9.0.0

### Installation

1. Install dependencies:
```bash
# Clean install dependencies
npm clean-install

# Or if you encounter issues, use:
npm install --legacy-peer-deps
```

2. Fix vulnerabilities (if needed):
```bash
# Review and fix vulnerabilities
npm audit fix

# If issues persist, use with caution:
npm audit fix --force
```

3. Update Nuxt (if needed):
```bash
# Update Nuxt to latest stable version
npm update nuxt
```

### Troubleshooting Installation

If you encounter dependency conflicts:

1. Clear npm cache:
```bash
npm cache clean --force
```

2. Delete existing modules:
```bash
rm -rf node_modules
rm package-lock.json
```

3. Reinstall with:
```bash
npm install --legacy-peer-deps
```

## Development

Start the development server:

```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## Production

Build for production:

```bash
npm run build
```

## Deployment

Deploy to Cloudflare Pages:

```bash
npm run deploy
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - See LICENSE file for details

## Credits

Built with:
- Vue 3
- Nuxt 3
- Tailwind CSS
- DaisyUI
- Cloudflare Workers
- Marked
- Highlight.js