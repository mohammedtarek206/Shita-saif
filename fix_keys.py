import os
import re

def fix_keys(content):
    # Fix key={item.id} or key={item._id}
    def replacer(m):
        var = m.group(1)
        prop = m.group(2)
        if prop in ['id', '_id', 'slug']:
            return f'key={{{var}?._id || {var}?.id || {var}?.slug || {var}?.name || {var}?.title?.en || {var}?.title?.ar || JSON.stringify({var}).substring(0, 20)}}'
        return m.group(0)
        
    content = re.sub(r'key=\{([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\}', replacer, content)
    
    # Fix key={i} or key={index} or key={idx}
    def index_replacer(m):
        val = m.group(1)
        if val in ['i', 'index', 'idx', 'step']:
            # Use backticks for template literal inside the React prop
            return f'key={{`item-${{{val}}}`}}'
        return m.group(0)
        
    content = re.sub(r'key=\{([a-zA-Z0-9_]+)\}', index_replacer, content)
    
    return content

for root, dirs, files in os.walk('src'):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            new_content = fix_keys(content)
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated {filepath}')
