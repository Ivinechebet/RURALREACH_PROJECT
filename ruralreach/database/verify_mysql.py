import mysql.connector
from backend.config import Config

def verify_database():
    try:
        # Test connection
        conn = mysql.connector.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            port=Config.DB_PORT
        )
        print("✅ Connected to MySQL database")
        
        cursor = conn.cursor()
        
        # Check if projects table exists
        cursor.execute("SHOW TABLES LIKE 'projects'")
        result = cursor.fetchone()
        
        if result:
            print("✅ Projects table exists")
            
            # Count projects
            cursor.execute("SELECT COUNT(*) FROM projects")
            count = cursor.fetchone()[0]
            print(f" Found {count} projects in database")
            
            # Show projects by category
            cursor.execute("SELECT category, COUNT(*) FROM projects GROUP BY category")
            categories = cursor.fetchall()
            print("Projects by category:")
            for category, count in categories:
                print(f"   {category}: {count} projects")
                
        else:
            print(" Projects table does not exist. Please run the SQL commands above.")
            
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    verify_database()