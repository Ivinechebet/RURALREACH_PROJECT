import subprocess
import sys
import time
import os
import threading
import requests

def install_requirements():
    print("Installing requirements...")
    packages = ["flask==2.3.3", "mysql-connector-python==8.1.0", "python-dotenv==1.0.0", "requests==2.31.0"]
    for pkg in packages:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])
            print(f" {pkg}")
        except:
            print(f"{pkg} - may already be installed")

def check_ngrok_windows():
    """Check if ngrok is available on Windows"""
    try:
        result = subprocess.run(["ngrok", "--version"], capture_output=True, text=True, shell=True)
        if result.returncode == 0:
            print("Ngrok is installed")
            return True
        else:
            print("Ngrok is not working properly")
            return False
    except FileNotFoundError:
        print("Ngrok not found. Please install ngrok:")
        print("   Download from: https://ngrok.com/download")
        print("   Or install via chocolatey: choco install ngrok")
        return False

def start_ngrok_windows(port=5000):
    """Start ngrok on Windows"""
    try:
        subprocess.run(['taskkill', '/F', '/IM', 'ngrok.exe'], capture_output=True)
        time.sleep(2)
        
        print("Starting ngrok tunnel...")
    
        ngrok_process = subprocess.Popen(
            f'ngrok http {port}',
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=True
        )
        
        print("Waiting for ngrok to initialize (10 seconds)...")
        time.sleep(10)  
        max_retries = 5
        for i in range(max_retries):
            try:
                response = requests.get('http://localhost:4040/api/tunnels', timeout=10)
                if response.status_code == 200:
                    tunnels = response.json()['tunnels']
                    if tunnels:
                        https_tunnel = next((t for t in tunnels if t['proto'] == 'https'), None)
                        if https_tunnel:
                            public_url = https_tunnel['public_url']
                            print(f"Ngrok tunnel created: {public_url}")
                            return public_url
                time.sleep(3)
            except requests.exceptions.RequestException as e:
                print(f"Retry {i+1}/{max_retries}: {e}")
                time.sleep(3)
        
        print(" Failed to get ngrok URL. Please check ngrok manually.")
        print(" Try running this command in a separate Command Prompt:")
        print(f"ngrok http {port}")
        return None
        
    except Exception as e:
        print(f"Ngrok error: {e}")
        return None

def start_flask_app():
    """Start the Flask app"""
    try:
        print("Starting Flask application...")
        os.system(f'"{sys.executable}" backend/app.py')
    except Exception as e:
        print(f" Failed to start Flask app: {e}")

def test_webhook_windows(url):
    """Test if the webhook URL is accessible from Windows"""
    try:
        test_url = f"{url}/health"
        response = requests.get(test_url, timeout=10)
        if response.status_code == 200:
            print(f"Webhook test successful: {test_url}")
            return True
        else:
            print(f"Webhook test failed: Status {response.status_code}")
            return False
    except Exception as e:
        print(f" Webhook test error: {e}")
        return False

def main():
    print("RURALREACH - WINDOWS SETUP")
    print("=" * 60)
    
    install_requirements()
   
    ngrok_available = check_ngrok_windows()
    
    if not ngrok_available:
        print("\n Alternative: Use localhost.run (no installation needed)")
        print("   Run this in a separate Command Prompt:")
        print("   ssh -R 80:localhost:5000 nokey@localhost.run")
        print("   Then use the provided URL in Africa's Talking")
    
    print("\nStarting the application...")
    print("=" * 60)
    
    # Start Flask in a separate thread
    flask_thread = threading.Thread(target=start_flask_app)
    flask_thread.daemon = True
    flask_thread.start()
    
    # Wait for Flask to start
    time.sleep(5)
    
    if ngrok_available:
        public_url = start_ngrok_windows()
        
        if public_url:
            # Test the webhook
            webhook_working = test_webhook_windows(public_url)
            
            print(f"\n{'='*60}")
            if webhook_working:
                print("UCCESS! Your RuralReach is now LIVE!")
            else:
                print("WARNING: Ngrok started but webhook test failed")
            
            print(f"USSD Callback URL: {public_url}/ussd")
            print(f"Health Check: {public_url}/health")
            print(f" Ngrok Dashboard: http://localhost:4040")
            print(f"{'='*60}")
            
            if webhook_working:
                print("\n Next steps for Africa's Talking:")
                print("1. Go to Africa's Talking Dashboard")
                print("2. Update your USSD service callback URL to:")
                print(f"   {public_url}/ussd")
                print("3. Set HTTP Method: POST")
                print("4. Set Content Type: application/json")
                print("5. Test your USSD code!")
    else:
        print("\nManual setup required:")
        print("1. Ensure Flask app is running on http://localhost:5000")
        print("2. Start ngrok manually in a separate Command Prompt:")
        print("   ngrok http 5000")
        print("3. Use the ngrok URL in Africa's Talking")
        print("4. OR use localhost.run as mentioned above")
    
    print("\n Press Ctrl+C to stop the application\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n Stopping RuralReach...")

if __name__ == '__main__':
    main()