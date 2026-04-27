from flask import Flask, jsonify
import os

app = Flask(__name__)

# غير المسار حسب عندك
FOLDER_PATH = "C:/nerf-data/test-proccesd"

@app.route('/check-folder', methods=['GET'])
def check_folder():
    try:
        files = [
            f for f in os.listdir(FOLDER_PATH)
            if os.path.isfile(os.path.join(FOLDER_PATH, f))
        ]

        if len(files) > 0:
            return jsonify({
                "status": "success",
                "message": "the output is served",
                "files_count": len(files)
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)