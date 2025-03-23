from flask import Flask, jsonify, request, render_template
from opanalysis import opanalysis
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins = ["http://127.0.0.1:5000", "http://localhost:4321"])

@app.route('/opa', methods=['POST'])
def opa():
    data = request.get_json()  # Proper way to parse JSON data
    if not data or 'netlist' not in data:
        return jsonify({"error": "Invalid request, 'netlist' not found"}), 400
    
    netlist = data['netlist']
    return jsonify(opanalysis(netlist))


if __name__ == '__main__' :
    app.run(debug=True)


