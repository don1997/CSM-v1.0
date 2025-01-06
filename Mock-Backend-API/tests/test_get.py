import pytest
from flask import json
import sys
sys.path.append('..')  
from app import app, db 

@pytest.fixture
def auth_token(client):
    # Create 
    test_user = {"username": "testuser", "password": "testpassword"}
    client.post('/register', json=test_user)

    # Login to get tauth token
    response = client.post('/login', json=test_user)
    token = response.json['access_token']
    return token


def test_get_snippets(client, auth_token):
    # First, create a snippet
    snippet_data = {'title': 'Test Title', 'content': 'Test content'}
    headers = {'Authorization': f'Bearer {auth_token}'}
    client.post('/snippets/post', json=snippet_data, headers=headers)

    # Now, retrieve the snippets
    get_response = client.get('/snippets', headers=headers)

    # Assertions to ensure the snippet was retrieved correctly
    assert get_response.status_code == 200
    assert any(snippet['title'] == 'Test Title' and snippet['content'] == 'Test content' for snippet in get_response.json)
