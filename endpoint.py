from flask import Flask, request, jsonify, send_from_directory, send_file
import os

app = Flask(__name__, static_folder='home')

UPLOAD_FOLDER = "C:/nerf-data/test-proccesd"
FOLDER = "C:/nerf-data/test"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def root():
    return send_from_directory('home/create', 'index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    files = request.files.getlist("files")
    saved_files = []
    for file in files:
        filepath = os.path.join(FOLDER, file.filename)
        file.save(filepath)
        saved_files.append(file.filename)
    return jsonify({"message": "Files uploaded successfully", "files": saved_files})

@app.route('/download/<filename>')
def download_file(filename):
    try:
        return send_file(os.path.join(UPLOAD_FOLDER, filename), as_attachment=True)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 404

@app.route('/check-folder', methods=['GET'])
def check_folder():
    try:
        files = [
            f for f in os.listdir(UPLOAD_FOLDER)
            if os.path.isfile(os.path.join(UPLOAD_FOLDER, f))
        ]

        if len(files) > 0:
            file_details = []
            for filename in files:
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file_info = {
                    "name": filename,
                    "size": os.path.getsize(filepath),
                    "modified": os.path.getmtime(filepath),
                    "path": filepath,
                    "url": f"/download/{filename}"
                }
                file_details.append(file_info)

            return jsonify({
                "status": "success",
                "message": "the output is served",
                "files_count": len(files),
                "files": file_details
            })
        else:
            return jsonify({
                "status": "empty",
                "message": "folder is still empty"
            })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })

if __name__ == "__main__":
    app.run(port=5000, debug=True)  