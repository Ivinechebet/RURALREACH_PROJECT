import africastalking
from backend.config import Config

class SMSHandler:
    def __init__(self):
        try:
            africastalking.initialize(Config.AT_USERNAME, Config.AT_API_KEY)
            self.sms = africastalking.SMS
            print(" SMS Handler initialized")
        except Exception as e:
            print(f"SMS Handler init failed: {e}")
            self.sms = None
    
    def send_sms(self, phone_number, message):
        if not self.sms:
            print("SMS service not available")
            return False
            
        try:
            response = self.sms.send(message, [phone_number])
            print(f" SMS sent to {phone_number}")
            return True
        except Exception as e:
            print(f" SMS sending failed: {e}")
            return False
    
    def send_confirmation(self, phone_number, reference_id, action_type, language='english'):
        """Send confirmation SMS in selected language"""
        if language == 'swahili':
            if action_type == "report":
                message = f"Asante kwa kuripoti! Nambari ya kumbukumbu: RR{reference_id}. Tutachunguza."
            else:  # rating
                message = "Asante kwa kadirio lako! Maoni yako yanasaidia kuboresha huduma."
        else:  # english
            if action_type == "report":
                message = f"Thank you for reporting! Reference: RR{reference_id}. We'll investigate."
            else:  # rating
                message = "Thank you for your rating! Your feedback helps improve services."
        
        return self.send_sms(phone_number, message)