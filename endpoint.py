from flask import Flask, request, jsonify, send_from_directory, send_file
import os
import shutil
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder='home')
CORS(app)
UPLOAD_FOLDER = "C:/nerf-data/test-proccesd"
FOLDER = "C:/nerf-data/test"
PREVIEW_DIR = os.path.join(BASE_DIR, "home", "model-3d", "preview")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PREVIEW_DIR, exist_ok=True)

@app.route('/')
def root():
    return send_from_directory('home/create', 'index.html')


@app.route('/home/<path:filename>')
def serve_home_static(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'home'), filename)

@app.route('/upload', methods=['POST'])
def upload_files():
    files = request.files.getlist("files")
    saved_files = []
    for file in files:
        filepath = os.path.join(FOLDER, file.filename)
        file.save(filepath)
        saved_files.append(file.filename)
    return jsonify({"message": "Files uploaded successfully", "files": saved_files})



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


def _pick_output_file(files):
    """Prefer .glb, then .gltf; otherwise newest by mtime."""
    full = [(f, os.path.join(UPLOAD_FOLDER, f)) for f in files]
    for ext in (".glb", ".gltf"):
        gl = [f for f, p in full if f.lower().endswith(ext)]
        if gl:
            gl.sort(key=lambda f: os.path.getmtime(os.path.join(UPLOAD_FOLDER, f)), reverse=True)
            return gl[0]
    full.sort(key=lambda t: os.path.getmtime(t[1]), reverse=True)
    return full[0][0]


@app.route("/prepare-preview", methods=["GET"])
def prepare_preview():
    """
    When UPLOAD_FOLDER has output files, copy the best candidate into
    home/model-3d/preview for same-origin preview via /home/...
    """
    try:
        files = [
            f for f in os.listdir(UPLOAD_FOLDER)
            if os.path.isfile(os.path.join(UPLOAD_FOLDER, f))
        ]
        if not files:
            return jsonify({"status": "empty", "message": "folder is still empty"})

        chosen = _pick_output_file(files)
        src = os.path.join(UPLOAD_FOLDER, chosen)
        ext = os.path.splitext(chosen)[1] or ".glb"
        dest_name = f"current{ext}"
        dest = os.path.join(PREVIEW_DIR, dest_name)
        shutil.copy2(src, dest)
        preview_url = f"/home/model-3d/preview/{dest_name}"
        return jsonify({
            "status": "success",
            "filename": chosen,
            "preview_url": preview_url,
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)  