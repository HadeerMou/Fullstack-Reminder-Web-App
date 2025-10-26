from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db():
    conn = sqlite3.connect('reminders.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/reminders', methods=['GET'])
def get_reminders():
    conn = get_db()
    reminders = conn.execute('SELECT * FROM reminders').fetchall()
    conn.close()
    return jsonify([dict(row) for row in reminders])

@app.route('/api/reminders', methods=['POST'])
def add_reminder():
    data = request.get_json()
    title = data.get('title')
    time = data.get('time')

    conn = get_db()
    conn.execute('INSERT INTO reminders (title, time) VALUES (?, ?)', (title, time))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Reminder added successfully!'})

@app.route('/api/reminders/<int:id>', methods=['DELETE'])
def delete_reminder(id):
    conn = get_db()
    conn.execute('DELETE FROM reminders WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Reminder deleted'})

if __name__ == '__main__':
    conn = sqlite3.connect('reminders.db')
    conn.execute('CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY, title TEXT, time TEXT)')
    conn.close()
    app.run(debug=True)
