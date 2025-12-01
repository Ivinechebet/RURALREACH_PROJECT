# backend/ussd_handler.py - BILINGUAL VERSION
from backend.database import get_db_connection

# Session storage for user data during USSD flows
user_sessions = {}

def handle_ussd_navigation(text, phone_number, session_id):
    
    print(f" USSD DEBUG: text='{text}', phone='{phone_number}', session='{session_id}'")
    
    text_array = text.split('*') if text else []
    user_input = text_array[-1] if text_array else ""
    
    # Initialize session if new
    if session_id not in user_sessions:
        user_sessions[session_id] = {
            'language': 'english',  # Default to English
            'step': 'language_selection',
            'data': {}
        }
    
    session = user_sessions[session_id]
    language = session['language']
    
    # Handle navigation commands (0 and 00) first
    if user_input == "0":
        return handle_back(session, session_id, language)
    elif user_input == "00":
        return handle_main_menu(session, session_id, language)
    
    # Show language selection for new session
    if text == "":
        return show_language_selection()
    
    try:
        return handle_navigation(text_array, user_input, phone_number, session_id, language)
    except Exception as e:
        print(f" Navigation error: {e}")
        return "END System error. Please try again later.\nHitilafu ya mfumo. Tafadhali jaribu tena baadaye."

def handle_back(session, session_id, language):
    """Handle 0.Back navigation"""
    if session['step'] in ['project_categories', 'report_projects', 'rate_projects', 'help_menu']:
        session['step'] = 'main_menu'
        return show_main_menu(language)
    elif session['step'] in ['project_list', 'report_description', 'rate_rating']:
        session['step'] = session['data'].get('previous_step', 'main_menu')
        return show_menu_by_step(session['step'], session, language)
    else:
        session['step'] = 'main_menu'
        return show_main_menu(language)

def handle_main_menu(session, session_id, language):
    """Handle 00.Main Menu navigation"""
    session['step'] = 'main_menu'
    session['data'] = {}
    return show_main_menu(language)

def show_menu_by_step(step, session, language):
    """Show menu by step"""
    if step == 'main_menu':
        return show_main_menu(language)
    elif step == 'project_categories':
        return show_project_categories(language)
    elif step == 'project_list':
        return show_projects_list(session, language)
    elif step == 'report_projects':
        return show_projects_for_reporting(language)
    elif step == 'rate_projects':
        return show_projects_for_rating(language)
    elif step == 'help_menu':
        return show_help_menu(language)
    else:
        return show_main_menu(language)

def show_language_selection():
    """Show language selection menu"""
    response = "CON Choose Language / Chagua Lugha:\n"
    response += "1. English\n"
    response += "2. Kiswahili"
    return response

def handle_navigation(text_array, user_input, phone_number, session_id, language):
    """Handle main navigation flow"""
    
    level = len(text_array)
    session = user_sessions[session_id]
    
    print(f" Navigation: level={level}, input='{user_input}', step={session['step']}, language={language}")

    # LANGUAGE SELECTION
    if session['step'] == 'language_selection':
        if user_input == "1":
            session['language'] = 'english'
            session['step'] = 'main_menu'
            return show_main_menu('english')
        elif user_input == "2":
            session['language'] = 'swahili'
            session['step'] = 'main_menu'
            return show_main_menu('swahili')
        else:
            return "END Invalid option. Please try again.\nChaguo batili. Tafadhali jaribu tena."

    # MAIN MENU
    elif session['step'] == 'main_menu':
        if user_input == "1":
            session['step'] = 'project_categories'
            return show_project_categories(language)
        elif user_input == "2":
            session['step'] = 'report_projects'
            return show_projects_for_reporting(language)
        elif user_input == "3":
            session['step'] = 'rate_projects'
            return show_projects_for_rating(language)
        elif user_input == "4":
            session['step'] = 'help_menu'
            return show_help_menu(language)
        else:
            return f"END {get_text('invalid_option', language)}"

    # PROJECT CATEGORIES
    elif session['step'] == 'project_categories':
        if user_input in ["1", "2", "3", "4", "5"]:
            category_map = {
                "1": "education", "2": "health", "3": "roads", 
                "4": "water", "5": "other"
            }
            session['data']['category'] = category_map[user_input]
            session['data']['previous_step'] = 'project_categories'
            session['step'] = 'project_list'
            return show_projects_list(session, language)
        else:
            return f"END {get_text('invalid_option', language)}"

    # PROJECT LIST (from categories)
    elif session['step'] == 'project_list':
        if user_input.isdigit():
            projects = get_projects_by_category(session['data']['category'])
            project = get_project_by_index(user_input, projects)
            if project:
                session['data']['selected_project'] = project['id']
                session['data']['project_name'] = project['name']
                session['step'] = 'project_details'
                return show_project_details(project, language)
            else:
                return f"END {get_text('invalid_option', language)}"
        else:
            return f"END {get_text('invalid_option', language)}"

    # PROJECT DETAILS
    elif session['step'] == 'project_details':
        if user_input == "1":
            session['step'] = 'report_description'
            return ask_issue_description(session['data']['project_name'], language)
        elif user_input == "2":
            session['step'] = 'rate_rating'
            return ask_for_rating(session['data']['project_name'], language)
        else:
            return f"END {get_text('invalid_option', language)}"

    # REPORT PROJECTS (from main menu)
    elif session['step'] == 'report_projects':
        if user_input.isdigit():
            projects = get_all_projects()
            project = get_project_by_index(user_input, projects)
            if project:
                session['data']['selected_project'] = project['id']
                session['data']['project_name'] = project['name']
                session['data']['previous_step'] = 'report_projects'
                session['step'] = 'report_description'
                return ask_issue_description(project['name'], language)
            else:
                return f"END {get_text('invalid_option', language)}"
        else:
            return f"END {get_text('invalid_option', language)}"

    # REPORT DESCRIPTION
    elif session['step'] == 'report_description':
        session['data']['issue_description'] = user_input
        session['step'] = 'report_anonymity'
        return ask_anonymity(language)

    # REPORT ANONYMITY
    elif session['step'] == 'report_anonymity':
        if user_input in ["1", "2"]:
            project_id = session['data']['selected_project']
            description = session['data']['issue_description']
            anonymous = (user_input == "1")
            
            # Save report
            report_id = save_report(project_id, description, phone_number, anonymous)
            
            
            # Clear session
            session['step'] = 'main_menu'
            session['data'] = {}
            
            return f"END {get_text('report_submitted', language).format(report_id)}"
        else:
            return f"END {get_text('invalid_option', language)}"

    # RATE PROJECTS (from main menu)
    elif session['step'] == 'rate_projects':
        if user_input.isdigit():
            projects = get_all_projects()
            project = get_project_by_index(user_input, projects)
            if project:
                session['data']['selected_project'] = project['id']
                session['data']['project_name'] = project['name']
                session['data']['previous_step'] = 'rate_projects'
                session['step'] = 'rate_rating'
                return ask_for_rating(project['name'], language)
            else:
                return f"END {get_text('invalid_option', language)}"
        else:
            return f"END {get_text('invalid_option', language)}"

    # RATE RATING
    elif session['step'] == 'rate_rating':
        if user_input in ["1", "2", "3", "4", "5"]:
            session['data']['rating'] = user_input
            session['step'] = 'rate_comment'
            return ask_for_comment(language)
        else:
            return f"END {get_text('invalid_option', language)}"

    # RATE COMMENT
    elif session['step'] == 'rate_comment':
        project_id = session['data']['selected_project']
        rating = session['data']['rating']
        comment = user_input
        
        # Save rating
        save_rating(project_id, rating, comment, phone_number)
        
        # Clear session
        session['step'] = 'main_menu'
        session['data'] = {}
        
        return f"END {get_text('rating_thanks', language)}"

    # HELP MENU
    elif session['step'] == 'help_menu':
        if user_input == "1":
            return show_how_to_use(language)
        elif user_input == "2":
            return show_sms_commands(language)
        else:
            return f"END {get_text('invalid_option', language)}"

    return f"END {get_text('invalid_option', language)}"

def show_main_menu(language):
    """Main menu in selected language"""
    response = f"CON {get_text('welcome', language)}\n"
    response += f"1. {get_text('view_projects', language)}\n"
    response += f"2. {get_text('report_issue', language)}\n"
    response += f"3. {get_text('rate_project', language)}\n"
    response += f"4. {get_text('help', language)}\n"
    response += f"0. {get_text('exit', language)}"
    return response

def show_project_categories(language):
    """Show project categories in selected language"""
    response = f"CON {get_text('select_project_type', language)}\n"
    response += f"1. {get_text('education', language)}\n"
    response += f"2. {get_text('health', language)}\n"
    response += f"3. {get_text('roads', language)}\n"
    response += f"4. {get_text('water', language)}\n"
    response += f"5. {get_text('other', language)}\n"
    response += f"0. {get_text('back', language)}\n"
    response += f"00. {get_text('main_menu', language)}"
    return response

def show_projects_list(session, language):
    """Show projects within a specific category"""
    category = session['data']['category']
    projects = get_projects_by_category(category)
    
    if not projects:
        response = f"CON {get_text('no_projects', language)}\n"
        response += f"0. {get_text('back', language)}\n"
        response += f"00. {get_text('main_menu', language)}"
        return response
    
    response = f"CON {get_category_display(category, language)}:\n"
    for i, project in enumerate(projects, 1):
        status_icon = "✅" if project['status'] == 'completed' else "🔄" if project['status'] == 'ongoing' else "⚠️"
        response += f"{i}. {project['name']} - {project['progress']}% {status_icon}\n"
    
    response += f"0. {get_text('back', language)}\n"
    response += f"00. {get_text('main_menu', language)}"
    return response

def show_projects_for_reporting(language):
    """Show all projects for reporting issues"""
    projects = get_all_projects()
    if not projects:
        return f"END {get_text('no_projects_available', language)}"
    
    response = f"CON {get_text('select_project_report', language)}:\n"
    for i, project in enumerate(projects, 1):
        response += f"{i}. {project['name']}\n"
    
    response += f"0. {get_text('back', language)}\n"
    response += f"00. {get_text('main_menu', language)}"
    return response

def show_projects_for_rating(language):
    """Show all projects for rating"""
    projects = get_all_projects()
    if not projects:
        return f"END {get_text('no_projects_available', language)}"
    
    response = f"CON {get_text('select_project_rate', language)}:\n"
    for i, project in enumerate(projects, 1):
        response += f"{i}. {project['name']}\n"
    
    response += f"0. {get_text('back', language)}\n"
    response += f"00. {get_text('main_menu', language)}"
    return response

def show_project_details(project, language):
    """Show detailed project information with action options"""
    response = f"CON {project['name']}\n"
    response += f"{get_text('project_status', language)}: {project['status'].replace('_', ' ').title()}\n"
    response += f"{get_text('project_progress', language)}: {project['progress']}%\n"
    response += f"{get_text('project_location', language)}: {project['location']}\n"
    
    if project.get('contractor_name'):
        response += f"{get_text('contractor', language)}: {project['contractor_name']}\n"
    
    # Get latest update
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT description FROM project_updates 
        WHERE project_id = %s 
        ORDER BY created_at DESC 
        LIMIT 1
    ''', (project['id'],))
    
    latest_update = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if latest_update:
        short_desc = latest_update['description'][:60] + "..." if len(latest_update['description']) > 60 else latest_update['description']
        response += f"{get_text('latest_update', language)}: {short_desc}\n"
    
    response += f"\n1. {get_text('report_issue', language)}\n"
    response += f"2. {get_text('rate_project', language)}\n"
    response += f"0. {get_text('back', language)}\n"
    response += f"00. {get_text('main_menu', language)}"
    return response

def ask_issue_description(project_name, language):
    """Ask user to describe the issue"""
    response = f"CON {get_text('reporting_for', language).format(project_name)}\n"
    response += f"{get_text('describe_issue', language)}\n"
    response += f"0. {get_text('back', language)}\n"
    response += f"00. {get_text('main_menu', language)}"
    return response

def ask_anonymity(language):
    """Ask user about anonymity preference"""
    response = f"CON {get_text('anonymous', language)}\n"
    response += f"0. {get_text('back', language)}\n"
    response += f"00. {get_text('main_menu', language)}"
    return response

def ask_for_rating(project_name, language):
    """Ask user to rate the project"""
    response = f"CON {get_text('rating_prompt', language).format(project_name)}\n"
    response += f"0. {get_text('back', language)}\n"
    response += f"00. {get_text('main_menu', language)}"
    return response

def ask_for_comment(language):
    """Ask for optional comment"""
    response = f"CON {get_text('comment_prompt', language)}\n"
    response += f"0. {get_text('back', language)}\n"
    response += f"00. {get_text('main_menu', language)}"
    return response

def show_help_menu(language):
    """Show help menu"""
    response = f"CON {get_text('help_menu', language)}\n"
    response += f"0. {get_text('back', language)}\n"
    response += f"00. {get_text('main_menu', language)}"
    return response

def show_how_to_use(language):
    """Show how to use instructions"""
    response = f"END {get_text('how_to_use', language)}"
    return response

def show_sms_commands(language):
    """Show SMS commands"""
    response = f"END {get_text('sms_commands', language)}"
    return response

# ============================================================================
# BILINGUAL TEXT SYSTEM
# ============================================================================

def get_text(key, language='english'):
    """Get text in the specified language"""
    texts = {
        'english': {
            'welcome': "Welcome to RuralReach",
            'view_projects': "View Project Updates",
            'report_issue': "Report Project Issue",
            'rate_project': "Rate Project",
            'help': "Help",
            'exit': "Exit",
            'thank_you': "Thank you for using RuralReach!",
            'invalid_option': "Invalid option. Please try again.",
            'select_project_type': "Select project type",
            'education': "Education",
            'health': "Health",
            'roads': "Roads/Infrastructure",
            'water': "Water",
            'other': "Other",
            'back': "Back",
            'main_menu': "Main Menu",
            'no_projects': "No projects found in this category",
            'project_status': "Status",
            'project_progress': "Progress",
            'project_location': "Location",
            'contractor': "Contractor",
            'latest_update': "Latest Update",
            'select_project_report': "Select project to report",
            'select_project_rate': "Select project to rate",
            'describe_issue': "Briefly describe the issue and add location",
            'anonymous': "Submit anonymously?\n1. Yes - No contact details\n2. No - Share my number",
            'report_submitted': "Thank you! Your report has been submitted.\nReference: RR{}\nOfficials will be notified.",
            'rating_prompt': "Rate {}:\n1. 1 - Very Poor\n2. 2 - Poor\n3. 3 - Average\n4. 4 - Good\n5. 5 - Excellent",
            'comment_prompt': "Add optional comment (Press 0 to skip)",
            'rating_thanks': "Thank you! Your rating has been submitted.",
            'help_menu': "Help:\n1. How to use\n2. SMS commands",
            'how_to_use': "How to use RuralReach:\n- Dial USSD code anytime\n- View project updates\n- Report issues anonymously\n- Rate project quality\nNo internet needed!",
            'sms_commands': "SMS Commands:\nUPDATE - View projects\nREPORT - Report problem\nRATE - Rate project\nSend to 33050",
            'project_not_found': "Project not found",
            'no_projects_available': "No projects available",
            'reporting_for': "Reporting issue for: {}"
        },
        'swahili': {
            'welcome': "Karibu RuralReach",
            'view_projects': "Angalia Maelezo ya Miradi",
            'report_issue': "Ripoti Tatizo la Mradi",
            'rate_project': "Kadirisha Mradi",
            'help': "Usaidizi",
            'exit': "Toka",
            'thank_you': "Asante kwa kutumia RuralReach!",
            'invalid_option': "Chaguo batili. Tafadhali jaribu tena.",
            'select_project_type': "Chagua aina ya mradi",
            'education': "Elimu",
            'health': "Afya",
            'roads': "Barabara/Miundombinu",
            'water': "Maji",
            'other': "Nyingine",
            'back': "Rudi",
            'main_menu': "Menu Kuu",
            'no_projects': "Hakuna miradi katika kategoria hii",
            'project_status': "Hali",
            'project_progress': "Maendeleo",
            'project_location': "Eneo",
            'contractor': "Mkandarasi",
            'latest_update': "Sasisho la Mwisho",
            'select_project_report': "Chagua mradi wa kuripoti",
            'select_project_rate': "Chagua mradi wa kadirisha",
            'describe_issue': "Elezea tatizo kwa ufupi na ongeza eneo",
            'anonymous': "Wasilisha bila kujulikana?\n1. Ndio - Bila mawasiliano\n2. Hapana - Shiriki nambari yangu",
            'report_submitted': "Asante! Ripoti yako imewasilishwa.\nNambari ya kumbukumbu: RR{}\nTaarifa itafika kwa wadhamini.",
            'rating_prompt': "Kadirisha {}:\n1. 1 - Duni Sana\n2. 2 - Duni\n3. 3 - Wastani\n4. 4 - Vizuri\n5. 5 - Bora Sana",
            'comment_prompt': "Ongeza maoni ya hiari (Bonyeza 0 kukwepa)",
            'rating_thanks': "Asante! Kadirio lako limehifadhiwa.",
            'help_menu': "Usaidizi:\n1. Jinsi ya kutumia\n2. Amri za SMS",
            'how_to_use': "Jinsi ya kutumia RuralReach:\n- Piga nambari ya USSD wakati wowote\n- Angalia maelezo ya miradi\n- Ripoti matatizo bila kujulikana\n- Kadirisha ubora wa mradi\nHaitaji intaneti!",
            'sms_commands': "Amri za SMS:\nUPDATE - Pata maelezo ya miradi\nREPORT - Ripoti tatizo\nRATE - Kadirisha mradi\nTumia kwa 33050",
            'project_not_found': "Mradi haupatikani",
            'no_projects_available': "Hakuna miradi inayopatikana",
            'reporting_for': "Inaripotiwa tatizo la: {}"
        }
    }
    return texts.get(language, {}).get(key, key)

def get_category_display(category, language):
    """Get category display name"""
    categories = {
        'education': {'english': 'Education Projects', 'swahili': 'Miradi ya Elimu'},
        'health': {'english': 'Health Projects', 'swahili': 'Miradi ya Afya'},
        'roads': {'english': 'Roads/Infrastructure Projects', 'swahili': 'Miradi ya Barabara/Miundombinu'},
        'water': {'english': 'Water Projects', 'swahili': 'Miradi ya Maji'},
        'other': {'english': 'Other Projects', 'swahili': 'Miradi Mengine'}
    }
    return categories.get(category, {}).get(language, 'Projects')

# ============================================================================
# DATABASE HELPER FUNCTIONS
# ============================================================================

def get_projects_by_category(category):
    """Get projects by category"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    if category == "all":
        cursor.execute("SELECT id, name, status, progress, location FROM projects")
    else:
        cursor.execute("SELECT id, name, status, progress, location FROM projects WHERE category = %s", (category,))
    
    projects = cursor.fetchall()
    cursor.close()
    conn.close()
    return projects

def get_all_projects():
    """Get all projects for reporting and rating"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT id, name FROM projects ORDER BY category, name")
    projects = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return projects

def get_project_by_index(index_str, projects):
    """Get project by menu index"""
    try:
        index = int(index_str) - 1
        if 0 <= index < len(projects):
            return projects[index]
    except (ValueError, IndexError):
        pass
    return None

# In backend/ussd_handler.py, replace the save_report function with this

def save_report(project_id, description, phone_number, anonymous):
    """Save project report to database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # --- FIX: Add a status to the INSERT statement ---
    cursor.execute(
        'INSERT INTO project_reports (project_id, description, phone_number, is_anonymous, status) VALUES (%s, %s, %s, %s, %s)',
        (project_id, description, phone_number if not anonymous else None, anonymous, 'pending')
    )
    report_id = cursor.lastrowid
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print(f" Report saved: ID={report_id}, Project={project_id}, Anonymous={anonymous}")
    return report_id

def save_rating(project_id, rating, comment, phone_number):
    """Save project rating to database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        'INSERT INTO project_ratings (project_id, rating, comment, phone_number) VALUES (%s, %s, %s, %s)',
        (project_id, rating, comment, phone_number)
    )
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print(f" Rating saved: Project={project_id}, Rating={rating}")