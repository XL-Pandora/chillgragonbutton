from flask_cors import CORS
from flask import Flask, request, jsonify
import json
import os
import threading

app = Flask(__name__)
CORS(app)

# 数据存储文件路径
DATA_FILE = 'click_data.json'

# 初始化线程锁
lock = threading.Lock()

# 初始化数据文件
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump({}, f)

# 从文件加载数据
def load_data():
    with lock:  # 确保线程安全
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        finally:
            print("Lock released after loading data.")

# 将数据保存到文件
def save_data(data):
    with lock:  # 确保线程安全
        try:
            with open(DATA_FILE, 'w') as f:
                json.dump(data, f)
        finally:
            print("Lock released after saving data.")

# 获取点击数据 (GET /click-data)
@app.route('/click-data', methods=['GET'])
def get_click_data():
    try:
        data = load_data()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 推送点击数据 (POST /click-data)
@app.route('/click-data', methods=['POST'])
def post_click_data():
    try:
        raw_data = request.data.decode('utf-8')
        new_data = json.loads(raw_data)

        if not isinstance(new_data, dict):
            return jsonify({'error': 'Invalid data format, expected a JSON object'}), 400

        # 合并新数据到现有数据
        data = load_data()  # 加载数据

        with lock:  # 确保线程安全
            for key, value in new_data.items():
                data[key] = data.get(key, 0) + value
            
        save_data(data)  # 保存数据

        return jsonify({'message': 'Data successfully saved'}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500)