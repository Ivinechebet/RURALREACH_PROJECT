import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MySQL Database Configuration
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '#IVINEchebet3305')
    DB_NAME = os.getenv('DB_NAME', 'ruralreach')
    DB_PORT = os.getenv('DB_PORT', '3306')
    
    # Africa's Talking Configuration
    AT_USERNAME = os.getenv('AT_USERNAME', 'sandbox')
    AT_API_KEY = os.getenv('AT_API_KEY', 'atsk_5db70e47dbe5af821f18d83706184bb854ace058fa79bee408c2a8c8378c0d1b1b5ac612')
    
    # Flask Configuration
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    USSD_CODE = "*384*70840#"