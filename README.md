# YAMLens

Visualize Docker Compose files as interactive architecture diagrams.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://yamlens.akbardhia.me)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Live Demo](https://yamlens.akbardhia.me) • [Report Bug](https://github.com/akbrdhia/YAMLens/issues) • [Request Feature](https://github.com/akbrdhia/YAMLens/issues)

---

## Overview

YAMLens transforms your `docker-compose.yml` into beautiful, interactive architecture diagrams. No more scrolling through hundreds of lines trying to understand service dependencies.

**Key Features:**
- Instant YAML parsing and visualization
- Automatic dependency mapping
- Display ports, volumes, and environment variables
- 100% client-side (your data stays in your browser)
- Dark mode support
- Export capabilities (coming soon)

## Quick Start

### Online
Visit [yamlens.akbardhia.me](https://yamlens.akbardhia.me) and paste your docker-compose.yml

### Local Development

```bash
git clone https://github.com/akbrdhia/yamlens.git
cd yamlens
npm install
npm run dev
```

## Tech Stack

- React + TypeScript + Vite
- React Flow (visualization)
- js-yaml (parser)
- Tailwind CSS (styling)

## Roadmap

**Current (v1.0)**
- Basic visualization
- Dependency mapping
- Service details display
- Export to PNG/SVG

**Next (v1.1)**
- URL sharing
- Search/filter services
- Network visualization

**Future (v2.0)**
- Live Docker integration
- Resource monitoring
- Multi-file support
- VS Code extension

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m 'Add some feature'
git push origin feature/your-feature
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**Akbar**
- Website: [akbardhia.me](https://akbardhia.me)
- GitHub: [@akbrdhia](https://github.com/akbrdhia)

---

Built with React Flow • Powered by js-yaml
