# backend/database.py - SIMPLIFIED MYSQL VERSION
import mysql.connector
from backend.config import Config

def get_db_connection():
    """Create and return a MySQL database connection"""
    try:
        conn = mysql.connector.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            port=Config.DB_PORT
        )
        return conn
    except Exception as e:
        print(f"MySQL connection error: {e}")
        raise

# Remove the automatic table creation for now
def init_database():
    print("Database already initialized manually")
    return True