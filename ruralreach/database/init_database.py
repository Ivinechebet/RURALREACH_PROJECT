# database/init_database.py - WITH ALL REAL MAUCHE PROJECTS
from backend.database import get_db_connection

def add_real_mauche_data():
    """Add all real Mauche Ward projects with proper updates"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Clear existing data
    cursor.execute('DELETE FROM projects')
    cursor.execute('DELETE FROM project_updates')
    
    # REAL MAUCHE WARD PROJECTS - Complete list
    real_projects = [
        # WATER PROJECTS
        (1, 'Kusumek Water Project', 'water', 'in_progress', 90, 'Kusumek Village', 
         'Construction of 50,000-litre masonry water tank and pipe-laying extension. Serving 2,000+ residents in Kusumek, Chepitet, Basiriat, and Koilong''et villages.', 0, 'County Water Department',
         '2024-01-01', '2025-12-01', None),
        
        (2, 'Tach Asis Water Project', 'water', 'in_progress', 85, 'Tachasis Village', 
         'Borehole equipped and solarized, water kiosk constructed, control panel installed. Final stage involves pipe laying.', 0, 'FLLoCA Program',
         '2024-03-01', '2025-11-01', None),
        
        (3, 'Tachasis Village Water Project', 'water', 'completed', 100, 'Tachasis Village', 
         '10-cubic-meter tank installed with 1.3km piping. Serving 200+ households. Handed over May 2025.', 0, 'County Government',
         '2024-01-01', '2025-05-01', '2025-05-15'),
        
        (4, 'Kaplekwa Borehole Project', 'water', 'in_progress', 70, 'Teret Area', 
         'Bringing safe drinking water to 2,500+ residents in Teret area. Borehole development in progress.', 0, 'Climate Action Program',
         '2024-06-01', '2025-12-01', None),
        
        # HEALTH PROJECTS
        (5, 'Taita Mauche Dispensary', 'health', 'in_progress', 60, 'Mauche Ward', 
         'Construction of outpatient (OPD) block. KSh 18 million project with 28-week completion timeline from July 2024.', 18000000, 'Ministry of Health',
         '2024-07-01', '2025-02-01', None),
        
        # INFRASTRUCTURE PROJECTS
        (6, 'Mauche-Bombo-Olenguruone Road', 'infrastructure', 'in_progress', 45, 'Mauche Section', 
         'Strategic road network construction. KSh 69.57 million allocated for Mauche section in 2024/2025 budget.', 69570000, 'Roads Department',
         '2024-07-01', '2026-03-01', None),
        
        (7, 'Mauche Road Grading Program', 'infrastructure', 'planned', 0, 'Mauche Ward', 
         'General road grading, murraming and compacting. KSh 8.5 million allocated in 2025/2026 budget.', 8500000, 'Ward Development',
         '2025-07-01', '2026-06-01', None),
        
        (8, 'Likia Police-Chorwet Primary Road', 'infrastructure', 'planned', 0, 'Likia to Chorwet', 
         'Road grading, murraming and compacting. KSh 3 million budgeted for 2025/2026.', 3000000, 'County Government',
         '2025-07-01', '2026-03-01', None),
        
        (9, 'Mauche Culverts Installation', 'infrastructure', 'planned', 0, 'Mauche Ward', 
         'Installation of culverts across the ward. KSh 2.7 million allocated in 2025/2026 budget.', 2700000, 'Ward Administration',
         '2025-07-01', '2026-03-01', None),
        
        (10, 'Imarisha Barabara Program', 'infrastructure', 'in_progress', 30, 'Mauche Ward', 
         'Road rehabilitation using hired machinery. KSh 1.79 million allocated for 2025/2026.', 1790000, 'Roads Department',
         '2025-01-01', '2025-12-01', None),
        
        # OTHER PROJECTS
        (11, 'Boda-Boda Sheds Construction', 'other', 'in_progress', 75, 'Mauche Trading Center', 
         'Construction of boda-boda sheds for motorcycle taxi operators. Ongoing since 2023/2024.', 0, 'Ward Development',
         '2023-07-01', '2025-12-01', None)
    ]
    
    cursor.executemany('''
        INSERT INTO projects (id, name, type, status, progress, location, description, 
                             budget, contractor_name, start_date, expected_completion, actual_completion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', real_projects)
    
    # Add realistic project updates
    project_updates = [
        (1, 1, 'Tank Construction Complete', '50,000-litre masonry water tank construction completed successfully. Pipe laying extension work has commenced across Kusumek village.', 10, 'in_progress'),
        (2, 2, 'Solar System Operational', 'Borehole solarization completed and control panel now functional. Final pipe laying phase starting next week.', 15, 'in_progress'),
        (3, 3, 'Project Commissioned', 'Water project officially handed over to community. Now serving 200+ households with reliable water supply.', 0, 'completed'),
        (4, 4, 'Drilling Phase Complete', 'Borehole drilling completed at 150m depth. Water quality testing and pump installation in progress.', 20, 'in_progress'),
        (5, 5, 'Foundation Work Finished', 'OPD block foundation completed. Wall construction and roofing work currently underway.', 25, 'in_progress'),
        (6, 6, 'Earthworks Progress', 'Initial earthworks and grading completed for 5km section. Drainage works and culvert installation starting.', 15, 'in_progress'),
        (10, 10, 'Equipment Mobilized', 'Road rehabilitation equipment mobilized to site. Grading work commenced in central Mauche area.', 10, 'in_progress'),
        (11, 11, 'Structural Work Complete', 'Boda-boda shed structures completed. Roofing installation and finishing works in progress.', 25, 'in_progress')
    ]
    
    cursor.executemany('''
        INSERT INTO project_updates (id, project_id, title, description, progress_change, new_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', project_updates)
    
    conn.commit()
    conn.close()
    print("All  Mauche Ward projects added successfully!")
    print("Project Summary:")
    print("   - 4 Water projects")
    print("   - 1 Health project") 
    print("   - 5 Road projects")
    print("   - 1 Other project")
    print("   - 8 Project updates added")

if __name__ == '__main__':
    add_real_mauche_data()