import os
import glob
import json
import mistune
from datetime import datetime
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import html

here = os.path.dirname(__file__)

class HighlightRenderer(mistune.Renderer):
    def block_code(self, code, lang):
        if not lang:
            return '\n<pre><code>%s</code></pre>\n' % mistune.escape(code)
        lexer = get_lexer_by_name(lang, stripall=True)
        formatter = html.HtmlFormatter()
        return highlight(code, lexer, formatter)

renderer = HighlightRenderer()
markdown = mistune.Markdown(renderer=renderer)  # Cache the parser

def process_file(f):
    parse_meta = lambda line: line.split(':').pop().strip()
    to_timestamp = lambda parsed: datetime.strptime(parsed, "%Y-%m-%d").timestamp()

    f.readline() # ---
    title = parse_meta(f.readline())
    tags = parse_meta(f.readline()).split(' ')
    created = to_timestamp(parse_meta(f.readline()))
    f.readline() # ---

    # Returns an estimate of the number of words in a Markdown entry
    def count_words(content):
        blocks = content.split("```")
        filtered = [block for (i, block) in enumerate(blocks) if i % 2 == 0]
        count = sum(len(block.strip().split(' ')) for block in filtered)
        return count

    body = ''
    for line in f:
        body += line

    return (title, markdown(body), count_words(body), created, tags)

def process_files():
    posts = {}
    paths = glob.glob(os.path.join(here, './*.md'))
    for path in paths:
        with open(path, 'r') as infile:
            base = os.path.basename(infile.name)
            slug, _ = os.path.splitext(base)
            (title, body, word_count, created, tags) = process_file(infile)
            posts[slug] = {'title': title, 'body': body, 'wordCount': word_count, 'created': created, 'tags': tags}
    return posts

# Writes the posts as a JSON file to be fed as React props
def write_props(posts):
    dest = os.path.join(here, '../src/posts.json')
    with open(dest, 'w') as outfile:
        json.dump(posts, outfile)

def main():
    posts = process_files()
    write_props(posts)

if __name__ == '__main__':
    main()
