from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['JWT_SECRET_KEY'] = 'jwt_secret_key'


CORS(app)
db = SQLAlchemy(app)
jwt = JWTManager(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    snippets = db.relationship('Snippet', backref='author', lazy=True)


class Snippet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(20), nullable=True)  # New field for language
    description = db.Column(db.Text, nullable=True)  # New field for markdown descriptions
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


@app.before_first_request
def create_tables():
    db.create_all()


@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already taken"}), 409
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"msg": "Bad username or password"}), 401


@app.route('/snippets', methods=['GET'])
@jwt_required()
def get_snippets():
    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()
    snippets = Snippet.query.filter_by(user_id=user.id).all()
    snippets_list = [
        {
            "id": snippet.id,
            "title": snippet.title,
            "content": snippet.content,
            "language": snippet.language,
            "description": snippet.description,
            "date_posted": snippet.date_posted,
            "user_id": snippet.user_id
        }
        for snippet in snippets
    ]
    return jsonify(snippets_list)


@app.route('/snippets/post', methods=['POST'])
@jwt_required()
def create_snippet():
    data = request.get_json()
    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()
    new_snippet = Snippet(
        title=data['title'],
        content=data['content'],
        language=data.get('language'),  # Include language when creating a snippet
        description=data.get('description', ''),  # Default to empty string if not provided
        user_id=user.id
    )
    db.session.add(new_snippet)
    db.session.commit()
    return jsonify({
        "id": new_snippet.id,
        "title": new_snippet.title,
        "content": new_snippet.content,
        "language": new_snippet.language,  # Return language in the response
        "description": new_snippet.description,
        "date_posted": new_snippet.date_posted,
        "user_id": new_snippet.user_id
    }), 201


@app.route('/snippets/update/<int:snippet_id>', methods=['PATCH', 'OPTIONS'])
@jwt_required()
@cross_origin()  # Ensure CORS is handled for this route if needed
def update_snippet(snippet_id):
    print(f"Received snippet ID: {snippet_id}")

    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()
    snippet = Snippet.query.filter_by(id=snippet_id, user_id=user.id).first()

    if not snippet:
        return jsonify({'message': 'Snippet not found'}), 404

    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    language = data.get('language')
    description = data.get('description')  # Get description from the request

    if title:
        snippet.title = title
    if content:
        snippet.content = content
    if language:
        snippet.language = language  # Update language if provided
    if description:
        snippet.description = description  # Update description if provided

    db.session.commit()
    return jsonify({
        'id': snippet.id,
        'title': snippet.title,
        'content': snippet.content,
        'language': snippet.language,  # Return updated language
        'description': snippet.description,  # Include description in the response
        'date_posted': snippet.date_posted.isoformat(),  # Assuming date_posted is a datetime object
        'user_id': snippet.user_id
    }), 200


@app.route('/snippets/delete/<int:snippet_id>', methods=['DELETE'])
@jwt_required()
@cross_origin()
def delete_snippet(snippet_id):
    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()
    snippet = Snippet.query.filter_by(id=snippet_id, user_id=user.id).first()

    if snippet:
        db.session.delete(snippet)
        db.session.commit()
        return jsonify({'message': 'Snippet deleted successfully'}), 200
    else:
        return jsonify({'message': 'Snippet not found'}), 404


if __name__ == '__main__':
    app.run(port=5000)
