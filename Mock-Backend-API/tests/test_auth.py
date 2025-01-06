from app import User  

def test_new_user():

    user = User(username='testuser', password='password')
    assert user.username == 'testuser'
    assert user.password == 'password'


def test_registration(client):
    # Data to send to the registration endpoint
    user_data = {'username': 'newuser', 'password': 'newpassword'}
    response = client.post('/register', json=user_data)

    # Assertions to check the response
    assert response.status_code == 201
    assert response.json['msg'] == 'User created successfully'


def test_login(client):
    # Register a user first
    user_data = {'username': 'testuser', 'password': 'testpassword'}
    client.post('/register', json=user_data)

    # Attempt to log in with the same credentials
    login_response = client.post('/login', json=user_data)

    # Assertions to check the login was successful
    assert login_response.status_code == 200
    assert 'access_token' in login_response.json
