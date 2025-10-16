// cspell:ignore segoe

import { NextResponse } from 'next/server'

export function GET() {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Magicsky API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      #api-reference {
        height: 100vh;
      }
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div id="api-reference">
      <div class="loading">Loading API Documentation...</div>
    </div>
    
    <!-- Load the Scalar API Reference script -->
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    
    <!-- Initialize the API Reference -->
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        if (typeof Scalar !== 'undefined' && Scalar.createApiReference) {
          Scalar.createApiReference('#api-reference', {
            url: '/api/openapi/spec',
            theme: 'purple',
            layout: 'modern',
            defaultHttpClient: {
              targetKey: 'javascript',
              clientKey: 'fetch'
            },
            customCss: \`
              .scalar-app {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              }
            \`
          });
        } else {
          console.error('Scalar API Reference library failed to load');
          document.getElementById('api-reference').innerHTML = 
            '<div style="padding: 20px; text-align: center; color: #e74c3c;">' +
            '<h2>Failed to Load API Documentation</h2>' +
            '<p>Please refresh the page or check your internet connection.</p>' +
            '</div>';
        }
      });
    </script>
  </body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
