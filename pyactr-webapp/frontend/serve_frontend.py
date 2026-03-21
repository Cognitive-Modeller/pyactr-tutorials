#!/usr/bin/env python3
"""Simple development server for the PyACT-R Tutorial Frontend"""

import os
import sys
import http.server
import socketserver
import subprocess
from pathlib import Path

# Build the frontend first
print("Building frontend...")
build_dir = Path(__file__).parent / "dist"

# Create a minimal HTML file to serve
html_content = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PyACT-R Tutorial</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .info {
            background: #f0f0f0;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .links {
            display: flex;
            gap: 20px;
            justify-content: center;
        }
        .link {
            background: #3b82f6;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
        }
        .link:hover {
            background: #2563eb;
        }
        iframe {
            width: 100%;
            height: 600px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PyACT-R Tutorial WebApp</h1>
        <p>Interactive tutorials for learning ACT-R cognitive modeling</p>
    </div>

    <div class="info">
        <h2>Backend Status</h2>
        <p>The Flask backend is running on <a href="http://localhost:8000" target="_blank">http://localhost:8000</a></p>
        <p>Test the backend: <a href="http://localhost:8000/api/health" target="_blank">/api/health</a></p>
    </div>

    <div class="info">
        <h2>Tutorial Content</h2>
        <p>While we work around the npm permission issues, here's a preview of the tutorial structure:</p>
        <ul>
            <li><strong>Tutorial 1:</strong> Introduction to ACT-R - Basic concepts and first model</li>
            <li><strong>Tutorial 2:</strong> Declarative Memory - Working with chunks and retrieval</li>
            <li><strong>Tutorial 3:</strong> Production Rules - Building intelligent behavior</li>
            <li><strong>Tutorial 4:</strong> Complete Models - Putting it all together</li>
            <li><strong>Tutorial 5:</strong> Advanced Modeling - Subsymbolic processing</li>
            <li><strong>Tutorial 6:</strong> Real-World Application - N-back task implementation</li>
        </ul>
    </div>

    <div class="info">
        <h2>Quick Test</h2>
        <p>Test the backend by running this Python code:</p>
        <pre style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 6px;">
import pyactr as actr

model = actr.ACTRModel()
model.goal.add(actr.makechunk(state="test"))

model.productionstring('''
    =g>
        state test
    ==>
        !output! Hello from PyACT-R!
        =g>
        state done
''')

sim = model.simulation()
sim.run()
        </pre>
    </div>

    <script>
        // Test backend connectivity
        fetch('http://localhost:8000/api/health')
            .then(response => response.json())
            .then(data => {
                console.log('Backend health check:', data);
            })
            .catch(error => {
                console.error('Backend connection error:', error);
            });
    </script>
</body>
</html>
"""

# Create the HTML file
with open("index.html", "w") as f:
    f.write(html_content)

# Start the server
PORT = 5173
Handler = http.server.SimpleHTTPRequestHandler

print(f"Starting frontend server on http://localhost:{PORT}")
print("The React app would normally be served here, but due to npm permission issues,")
print("we're serving a simple HTML interface instead.")
print("\nBackend API is available at http://localhost:8000")
print("\nPress Ctrl+C to stop the server")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()