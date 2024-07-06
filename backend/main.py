from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# AWS PostgreSQL RDS credentials
db_host = 'produp-db-instance.c9sa4sw6iw2n.us-east-1.rds.amazonaws.com'
db_name = 'produp_db'
db_user = 'dvacy'
db_password = 'notyet91011'
db_port = '5432'

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(
            dbname=db_name,
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port
        )

        # Create a cursor
        cur = conn.cursor()

        # Query to check if username and password match
        cur.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
        user = cur.fetchone()

        # Close cursor and connection
        cur.close()
        conn.close()

        if user:
            # Return success response
            return jsonify({'message': 'Login successful'}), 200
        else:
            # Return error response
            return jsonify({'message': 'Invalid username or password'}), 401

    except psycopg2.Error as e:
        print("Error connecting to PostgreSQL database:", e)
        return jsonify({'message': 'Database connection error'}), 500

if __name__ == '__main__':
    app.run(debug=True)