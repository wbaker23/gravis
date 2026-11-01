"""Template system for using HTML template files and inserting data into them."""

import json as _json

import pkgutil as _pkgutil


def load(resource_path):
    """Load a file in the same directory as the template system module."""
    resource_package = __package__
    binary_data = _pkgutil.get_data(resource_package, resource_path)
    string = binary_data.decode('utf-8')
    return string


def insert(template, data):
    """Insert data into a template."""
    for key, val in data.items():
        tag = '§' + key + '§'
        template = template.replace(tag, val)
    return template


def to_json(data):
    """Convert data to JSON."""
    return _json.dumps(data)
