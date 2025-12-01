import mysql.connector
from backend.config import Config

def test_database():
    try:
        conn = mysql.connector.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            port=Config.DB_PORT
        )
        cursor = conn.cursor(dictionary=True)
        
        # Test counts
        cursor.execute("SELECT COUNT(*) as count FROM projects")
        total = cursor.fetchone()['count']
        print(f" Total projects: {total}")
        
        # Test categories
        cursor.execute("SELECT category, COUNT(*) as count FROM projects GROUP BY category")
        categories = cursor.fetchall()
        print(" Projects by category:")
        for cat in categories:
            print(f"   {cat['category']}: {cat['count']}")
        
        # Test exact names
        cursor.execute("SELECT name, category FROM projects ORDER BY category, name")
        projects = cursor.fetchall()
        print("\n Project list:")
        for project in projects:
            print(f"   {project['category']}: {project['name']}")
        
        cursor.close()
        conn.close()
        
        # Verify we have exactly 13 projects
        expected_categories = {'education': 1, 'health': 1, 'roads': 4, 'water': 5, 'other': 2}
        actual_categories = {cat['category']: cat['count'] for cat in categories}
        
        if total == 13 and actual_categories == expected_categories:
            print("\n Database is perfectly set up for USSD flow!")
            return True
        else:
            print("\n Database setup doesn't match USSD requirements")
            return False
            
    except Exception as e:
        print(f" Error: {e}")
        return False

if __name__ == "__main__":
    test_database()