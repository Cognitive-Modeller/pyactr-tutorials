#!/usr/bin/env python3
"""
Convert Jupyter notebooks to tutorial content format for the webapp
"""

import json
import os
import sys
from pathlib import Path

def extract_markdown_text(cell):
    """Extract text from markdown cell"""
    content = cell.get('source', [])
    if isinstance(content, list):
        return ''.join(content)
    return content

def extract_code(cell):
    """Extract code from code cell"""
    content = cell.get('source', [])
    if isinstance(content, list):
        return ''.join(content)
    return content

def is_explanation(text):
    """Check if text is an explanation block"""
    keywords = ['WHAT\'S HAPPENING?', 'WHY', 'NOTE:', 'IMPORTANT:']
    return any(keyword in text.upper() for keyword in keywords)

def convert_notebook(notebook_path):
    """Convert a single notebook to tutorial format"""
    with open(notebook_path, 'r') as f:
        notebook = json.load(f)

    sections = []
    current_section = None

    for cell in notebook['cells']:
        cell_type = cell['cell_type']

        if cell_type == 'markdown':
            text = extract_markdown_text(cell)

            # Check if it's a heading
            if text.startswith('#'):
                # Start a new section
                if current_section:
                    sections.append(current_section)

                # Extract heading level and text
                lines = text.split('\n')
                heading = lines[0].strip('#').strip()

                # Skip main title (# Tutorial X:)
                if not heading.startswith('Tutorial'):
                    current_section = {
                        'title': heading,
                        'content': []
                    }

                    # Add remaining text if any
                    remaining_text = '\n'.join(lines[1:]).strip()
                    if remaining_text:
                        current_section['content'].append({
                            'type': 'text',
                            'content': remaining_text
                        })
            else:
                # Regular markdown text
                if current_section:
                    if is_explanation(text):
                        current_section['content'].append({
                            'type': 'explanation',
                            'content': text.strip()
                        })
                    else:
                        current_section['content'].append({
                            'type': 'text',
                            'content': text.strip()
                        })

        elif cell_type == 'code':
            code = extract_code(cell)
            if current_section and code.strip():
                current_section['content'].append({
                    'type': 'code',
                    'content': code.strip()
                })

    # Add last section
    if current_section:
        sections.append(current_section)

    return sections

def main():
    """Convert all notebooks to tutorial format"""
    notebooks_dir = Path("../../notebooks")
    output_file = Path("../frontend/src/data/notebookContent.ts")

    tutorial_data = {}

    # Process each tutorial directory
    for i in range(1, 7):
        tutorial_dir = notebooks_dir / f"{i:02d}_*"
        dirs = list(notebooks_dir.glob(f"{i:02d}_*"))

        if dirs:
            tutorial_dir = dirs[0]
            # Find main notebook
            notebooks = list(tutorial_dir.glob("*.ipynb"))

            # Skip executed notebooks
            notebooks = [nb for nb in notebooks if 'executed' not in nb.name and 'test' not in nb.name]

            if notebooks:
                print(f"Processing Tutorial {i}: {notebooks[0]}")
                sections = convert_notebook(notebooks[0])
                tutorial_data[i] = {'sections': sections}

    # Generate TypeScript file
    output_content = """// Auto-generated from Jupyter notebooks
// Run scripts/convert_notebooks.py to regenerate

import { TutorialContent } from './tutorialContent'

export const notebookContent: Record<number, TutorialContent> = {
"""

    for tutorial_id, content in tutorial_data.items():
        output_content += f"  {tutorial_id}: {{\n    sections: [\n"

        for section in content['sections']:
            output_content += f"      {{\n"
            output_content += f"        title: {json.dumps(section['title'])},\n"
            output_content += f"        content: [\n"

            for item in section['content']:
                output_content += f"          {{\n"
                output_content += f"            type: {json.dumps(item['type'])},\n"
                output_content += f"            content: {json.dumps(item['content'])}\n"
                output_content += f"          }},\n"

            output_content += f"        ]\n"
            output_content += f"      }},\n"

        output_content += f"    ]\n  }},\n"

    output_content += "}\n"

    # Write output file
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, 'w') as f:
        f.write(output_content)

    print(f"\nGenerated {output_file}")

if __name__ == "__main__":
    main()