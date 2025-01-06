import pytest
from flask import json
import sys
sys.path.append('..')  
from app import app, db 

def test_delete_snippet(client, auth_token):
    # Create Snippet
    snippet_data = {'title': 'Delete Me', 'content': 'Content to delete'}
    headers = {'Authorization': f'Bearer {auth_token}'}
    create_response = client.post('/snippets/post', json=snippet_data, headers=headers)
    snippet_id = create_response.json['id']

    # Delete Snippet
    delete_response = client.delete(f'/snippets/delete/{snippet_id}', headers=headers)

    # Assertions 
    assert delete_response.status_code == 200
    assert delete_response.json['message'] == 'Snippet deleted successfully'

    # Optionally, verify the snippet is actually removed
    get_response = client.get('/snippets', headers=headers)
    assert all(snippet['id'] != snippet_id for snippet in get_response.json)
