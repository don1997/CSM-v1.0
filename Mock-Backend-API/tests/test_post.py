import pytest
from flask import json
import sys
sys.path.append('..')  
from app import app, db 

def test_create_snippet(client, auth_token):
    snippet_data = {
        'title': 'Test Snippet',
        'content': 'This is a test snippet content.'
    }

   
    headers = {'Authorization': f'Bearer {auth_token}'}
    response = client.post('/snippets/post', json=snippet_data, headers=headers)

    assert response.status_code == 201
    assert 'id' in response.json
    assert response.json['title'] == snippet_data['title']
    assert response.json['content'] == snippet_data['content']
