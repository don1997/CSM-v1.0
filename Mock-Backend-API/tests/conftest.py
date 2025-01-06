import pytest
from app import app, db
import sys
sys.path.append('..')  

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  
    app.config['JWT_SECRET_KEY'] = 'test_jwt_secret_key'  

    with app.app_context():
        db.create_all()
    with app.test_client() as testing_client:
        with app.app_context():
            yield testing_client  
    with app.app_context():
        db.drop_all()

@pytest.fixture
def auth_token(client):
    # Create 
    test_user = {"username": "testuser", "password": "testpassword"}
    client.post('/register', json=test_user)

    # Login to get tauth token
    response = client.post('/login', json=test_user)
    token = response.json['access_token']
    return token
