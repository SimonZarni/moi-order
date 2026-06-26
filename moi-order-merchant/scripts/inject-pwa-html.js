// Post-build: inject PWA tags that Expo Metro omits from its generated dist/index.html.
// Expo Metro with web.output:"single" generates its own HTML and ignores web/index.html,
// so manifest, apple-touch-icon, favicons, and SW registration must be injected here.

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const inject = `
    <!-- PWA manifest -->
    <link rel="manifest" href="/manifest.json" />

    <!-- iOS Add to Home Screen -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Moi Merchant" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" href="/favicon.ico" />

    <!-- Register SW on load so Chrome qualifies the page for the PWA install prompt -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function (err) {
            console.warn('[SW] Registration failed:', err);
          });
        });
      }
    </script>
`;

html = html.replace('</head>', inject + '\n  </head>');
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('[inject-pwa-html] PWA tags injected into dist/index.html');
