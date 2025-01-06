import pytest
from flask import json
import sys
sys.path.append('..')  
from app import app, db 

def test_update_snippet(client, auth_token):
    # Create Snippet
    snippet_data = {'title': 'Original Title', 'content': 'Original content'}
    headers = {'Authorization': f'Bearer {auth_token}'}
    create_response = client.post('/snippets/post', json=snippet_data, headers=headers)
    snippet_id = create_response.json['id']

    # Update
    update_data = {'title': 'Updated Title', 'content': 'Updated content', 'language': 'Python', 'description': 'Updated description'}
    update_response = client.patch(f'/snippets/update/{snippet_id}', json=update_data, headers=headers)

    # Assertions 
    assert update_response.status_code == 200
    assert update_response.json['title'] == 'Updated Title'
    assert update_response.json['content'] == 'Updated content'
    assert update_response.json['language'] == 'Python'
    assert update_response.json['description'] == 'Updated description'
    # Optionally, verify the snippet's updated state
    get_response = client.get('/snippets', headers=headers)
    updated_snippet = next((snippet for snippet in get_response.json if snippet['id'] == snippet_id), None)
    assert updated_snippet['title'] == 'Updated Title'
    assert updated_snippet['content'] == 'Updated content'