from flask import Flask, jsonify, request, render_template
from opanalysis import opanalysis
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins = ["http://127.0.0.1:5000", "http://localhost:4321"])

@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}

@app.route('/opa', methods=['POST'])
def opa():
    if request.method == 'POST':
        netlist = request.form['netlist']
        return jsonify(opanalysis(netlist))


if __name__ == '__main__' :
    app.run(debug=True)


