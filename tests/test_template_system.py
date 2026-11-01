"""Package resources must be usable without setuptools at runtime."""

import os
import subprocess
import sys


def test_standalone_figures_without_site_packages():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    subprocess.check_call([sys.executable, '-S', '-c', '''
import gravis

data = {'graph': {'nodes': [{'id': 'a'}], 'edges': []}}
for backend in (gravis.d3, gravis.vis, gravis.three):
    figure = backend(data)
    assert '<html' in figure.to_html_standalone()
    assert '<script' in figure.to_html_partial()
'''], cwd=root)
