from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='home')

UPLOAD_FOLDER = "C:/nerf-data/test"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def root():
    return send_from_directory('home/create', 'index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    files = request.files.getlist("files")
    saved_files = []
    for file in files:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        saved_files.append(file.filename)
    return jsonify({"message": "Files uploaded successfully", "files": saved_files})

@app.route('/<path:path>')
def static_proxy(path):
    # Serve any file in the home directory
    return send_from_directory('home', path)

if __name__ == "__main__":
    app.run(port=5000, debug=True)  