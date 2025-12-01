import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add the project root to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.insert(0, project_root)

from flask import Flask, request, jsonify
from backend.database import get_db_connection
import africastalking

print("Debug: Starting imports...")

try:
    from backend.config import Config
    print(" Imported Config")
except ImportError as e:
    print(f" Config import failed: {e}")
    try:
        from .config import Config
        print(" Imported Config (relative)")
    except ImportError as e2:
        print(f"Relative import failed: {e2}")
        class Config:
            AT_USERNAME = "sandbox"
            AT_API_KEY = os.getenv('AT_API_KEY', 'atsk_5db70e47dbe5af821f18d83706184bb854ace058fa79bee408c2a8c8378c0d1b1b5ac612')
            DATABASE_PATH = "database/ruralreach.db"
            FLASK_PORT = 5000
            DEBUG = True
            USSD_CODE = "*384*70840#"
        print("Using fallback Config")

try:
    from backend.database import init_database, get_db_connection
    print(" Imported database functions")
except ImportError as e:
    print(f" Database import failed: {e}")
    # We'll define fallback functions
    def init_database():
        print(" Database already initialized")
    
    def get_db_connection():
        import sqlite3
        return sqlite3.connect("database/ruralreach.db")

try:
    from backend.ussd_handler import handle_ussd_navigation
    print(" Imported USSD handler")
except ImportError as e:
    print(f" USSD handler import failed: {e}")
    # Fallback USSD handler
    def handle_ussd_navigation(text, phone_number, session_id):
        if not text:
            return "CON Welcome to RuralReach!\\n1. View Projects\\n2. Report Issue\\n0. Exit"
        return "END Thank you for using RuralReach!"

try:
    from backend.sms_handler import SMSHandler
    sms_handler = SMSHandler()
    print(" Imported SMS handler")
except ImportError as e:
    print(f"SMS handler import failed: {e}")
    sms_handler = None

# Initialize Africa's Talking
try:
    africastalking.initialize(Config.AT_USERNAME, Config.AT_API_KEY)
    print(" Africa's Talking initialized")
except Exception as e:
    print(f" Africa's Talking init: {e}")
    

app = Flask(__name__)

CORS(app, resources={r"/api/*"}, origins=["http://localhost:8080"])

@app.route('/')
def home():
    return "RuralReach USSD Service is running! "

@app.route('/ussd', methods=['POST'])
def ussd():
    try:
        session_id = request.form.get("sessionId")
        service_code = request.form.get("serviceCode")
        phone_number = request.form.get("phoneNumber")
        text = request.form.get("text", "")
        
        print(f" USSD: {phone_number} - {text}") # This is the line we are watching for!
        response = handle_ussd_navigation(text, phone_number, session_id)
        return response
        
    except Exception as e:
        print(f" USSD Error: {e}")
        return "END Service error. Please try again."
# In backend/app.py, add this route

@app.route('/api/test-counter')
def test_counter():
    """A simple endpoint that increments to test polling"""
    # This is a simple in-memory counter, not a database call
    if not hasattr(test_counter, 'value'):
        test_counter.value = 0
    test_counter.value += 1
    return jsonify({"count": test_counter.value})

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "RuralReach"})

@app.route('/test-db')
def test_db():
    try:
        conn = get_db_connection()
        count = conn.execute("SELECT COUNT(*) FROM projects").fetchone()[0]
        conn.close()
        return jsonify({"projects": count, "database": "working"})
    except Exception as e:
        return jsonify({"error": str(e)})
   

# In backend/app.py, replace the dashboard_stats function with this

@app.route('/api/dashboard-stats')
def dashboard_stats():
    """API endpoint to get statistics for the dashboard (Fixed and Enhanced)"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get total projects
        cursor.execute("SELECT COUNT(*) as count FROM projects")
        total_projects = cursor.fetchone()['count']
        
        # --- FIX: Look in the CORRECT table for reports ---
        # Get active reports from 'project_reports' table
        active_reports = 0
        cursor.execute("SHOW TABLES LIKE 'project_reports'")
        if cursor.fetchone():
            cursor.execute("SELECT COUNT(*) as count FROM project_reports WHERE status='pending'") # Assuming new reports are 'pending'
            active_reports = cursor.fetchone()['count']

        # --- ENHANCEMENT: Calculate average rating from ratings ---
        # Get average rating from 'project_ratings' table
        avg_rating = 0.0
        cursor.execute("SHOW TABLES LIKE 'project_ratings'")
        if cursor.fetchone():
            cursor.execute("SELECT AVG(rating) as avg_rating FROM project_ratings")
            result = cursor.fetchone()
            if result and result['avg_rating'] is not None:
                avg_rating = round(result['avg_rating'], 1)
            
        # Placeholder for USSD sessions
        ussd_sessions = 1247 # You can make this dynamic later if needed
        
        return jsonify({
            "totalProjects": total_projects,
            "activeReports": active_reports,
            "avgRating": avg_rating, # This is now dynamic
            "ussdSessions": ussd_sessions
        })
        
    except Exception as e:
        print(f"!!! DASHBOARD STATS ERROR !!!")
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Could not fetch dashboard stats", "details": str(e)}), 500
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

      # In backend/app.py

# In backend/app.py, replace the get_ratings function with this

@app.route('/api/ratings')
def get_ratings():
    """API endpoint to get a list of all project ratings (SAFE VERSION)"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # This query is much simpler and only uses tables that exist
        query = """
            SELECT 
                ra.rating,
                ra.comment,
                ra.created_at,
                ra.phone_number
            FROM project_ratings ra
            ORDER BY ra.created_at DESC
            LIMIT 50
        """
        cursor.execute(query)
        
        ratings = cursor.fetchall()
        
        return jsonify(ratings)
        
    except Exception as e:
        print(f"!!! GET RATINGS ERROR !!!")
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Could not fetch ratings", "details": str(e)}), 500
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()
@app.route('/api/projects', methods=['GET'])
def get_projects_api():
    """API endpoint to get a list of all projects (Safer Version)"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True) # This is important for getting dicts

        # Use SELECT * for now to avoid column name issues
        query = "SELECT * FROM projects ORDER BY id DESC"
        cursor.execute(query)
        
        projects = cursor.fetchall()
        
        # Let's also print what we got to the terminal for debugging
        print(f"Successfully fetched {len(projects)} projects from DB.")
        
        return jsonify(projects)
        
    except Exception as e:
        print(f"!!! GET PROJECTS ERROR !!!")
        print(f"Error: {e}")
        import traceback
        traceback.print_exc() # This prints the full error to your terminal
        return jsonify({"error": "Could not fetch projects", "details": str(e)}), 500
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()
# In backend/app.py

# ... (keep your existing imports)

@app.route('/api/activities')
def get_activities():
    """API endpoint to get a list of all activities"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # This query assumes you have an 'activity_log' table.
        # It joins reports, ratings, and projects to create a unified activity feed.
        query = """
            SELECT 
                'New Report' as title, 
                CONCAT('User reported an issue on ', p.name) as description,
                r.created_at as time, 
                'reports' as category, 
                'info' as type
            FROM project_reports r
            JOIN projects p ON r.project_id = p.id
            
            UNION ALL
            
            SELECT 
                'Project Rated' as title, 
                CONCAT('User rated ', p.name) as description,
                ra.created_at as time, 
                'ratings' as category, 
                'success' as type
            FROM project_ratings ra
            JOIN projects p ON ra.project_id = p.id
            
            ORDER BY time DESC
            LIMIT 50
        """
        cursor.execute(query)
        
        activities = cursor.fetchall()
        
        return jsonify(activities)
        
    except Exception as e:
        print(f"!!! GET ACTIVITIES ERROR !!!")
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Could not fetch activities", "details": str(e)}), 500
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/projects', methods=['POST'])
def create_project():
    """API endpoint to create a new project"""
    conn = None
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Adjust column names to match your 'projects' table
        query = """
            INSERT INTO projects (name, description, type, status, progress, location, contractor, start_date, expected_completion)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data['name'], data['description'], data['type'], data['status'],
            data.get('progress', 0), data['location'], data['contractor'],
            data['startDate'], data['expectedCompletion']
        ))
        conn.commit()
        
        return jsonify({"message": "Project created successfully", "id": cursor.lastrowid}), 201

    except Exception as e:
        print(f"!!! CREATE PROJECT ERROR !!!")
        print(f"Error: {e}")
        return jsonify({"error": "Could not create project", "details": str(e)}), 500
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    """API endpoint to update an existing project"""
    conn = None
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Adjust column names to match your 'projects' table
        query = """
            UPDATE projects SET name=%s, description=%s, type=%s, status=%s, progress=%s, location=%s, contractor=%s, start_date=%s, expected_completion=%s
            WHERE id=%s
        """
        cursor.execute(query, (
            data['name'], data['description'], data['type'], data['status'],
            data.get('progress', 0), data['location'], data['contractor'],
            data['startDate'], data['expectedCompletion'], project_id
        ))
        conn.commit()
        
        return jsonify({"message": "Project updated successfully"})

    except Exception as e:
        print(f"!!! UPDATE PROJECT ERROR !!!")
        print(f"Error: {e}")
        return jsonify({"error": "Could not update project", "details": str(e)}), 500
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """API endpoint to delete a project"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM projects WHERE id = %s", (project_id,))
        conn.commit()
        
        return jsonify({"message": "Project deleted successfully"})

    except Exception as e:
        print(f"!!! DELETE PROJECT ERROR !!!")
        print(f"Error: {e}")
        return jsonify({"error": "Could not delete project", "details": str(e)}), 500
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

    
if __name__ == '__main__':
    print(" Starting RuralReach Server...")
    print(f" Port: {Config.FLASK_PORT}")
    print(f" USSD: {Config.USSD_CODE}")
    
    # Ensure database is initialized
    init_database()
    
    app.run(host='0.0.0.0', port=Config.FLASK_PORT, debug=Config.DEBUG)