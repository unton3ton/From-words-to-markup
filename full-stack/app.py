'''
pip install markdown bottle
python app.py
# Откройте http://localhost:8080

md-editor/
├── app.py
├── bottle.py
├── index.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
'''


from bottle import route, run, static_file
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@route('/')
def index():
    return static_file('index.html', root=BASE_DIR)

@route('/render', method='POST')
def render_md():
    """Опционально: серверный рендеринг"""
    from bottle import request
    import markdown
    md_text = request.json.get('text', '')
    html = markdown.markdown(md_text, extensions=['tables', 'fenced_code'])
    return {'html': html}

@route('/static/<filepath:path>')
def static(filepath):
    return static_file(filepath, root=os.path.join(BASE_DIR, 'static'))

if __name__ == '__main__':
    run(host='localhost', port=8080, debug=True, reloader=True)