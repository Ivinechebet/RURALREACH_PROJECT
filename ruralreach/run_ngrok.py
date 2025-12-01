# run_ngrok.py - UPDATED VERSION
import subprocess
import time
import requests
import threading
from backend.app import app

def start_ngrok(port=5000):
    """Start ngrok tunnel with better error handling"""
    try:
        # Kill any existing ngrok processes
        subprocess.run(['pkill', 'ngrok'], capture_output=True)
        time.sleep(2)
        
        print("🚀 Starting ngrok tunnel...")
        
        # Start ngrok with specific configuration
        ngrok_process = subprocess.Popen(
            ['ngrok', 'http', str(port), '--log=stdout'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        print("⏳ Waiting for ngrok to initialize...")
        time.sleep(8)  # Give ngrok more time to start
        
        # Get ngrok public URL
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
                            print(f"✅ Ngrok tunnel created: {public_url}")
                            return public_url
                time.sleep(2)
            except requests.exceptions.RequestException as e:
                print(f"⚠️  Retry {i+1}/{max_retries}: {e}")
                time.sleep(3)
        
        print("❌ Failed to get ngrok URL after multiple attempts")
        return None
        
    except Exception as e:
        print(f"❌ Ngrok error: {e}")
        return None

def start_flask_app():
    """Start Flask application"""
    try:
        print("🌐 Starting Flask application...")
        app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
    except Exception as e:
        print(f"❌ Flask app error: {e}")

def test_webhook(url):
    """Test if the webhook URL is accessible"""
    try:
        test_url = f"{url}/health"
        response = requests.get(test_url, timeout=10)
        if response.status_code == 200:
            print(f"✅ Webhook test successful: {test_url}")
            return True
        else:
            print(f"❌ Webhook test failed: Status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Webhook test error: {e}")
        return False

if __name__ == '__main__':
    print("🚀 Starting RuralReach with Ngrok...")
    print("=" * 60)
    
    # Start Flask in a separate thread
    flask_thread = threading.Thread(target=start_flask_app)
    flask_thread.daemon = True
    flask_thread.start()
    
    # Wait for Flask to start
    time.sleep(3)
    
    # Start ngrok
    public_url = start_ngrok()
    
    if public_url:
        # Test the webhook
        webhook_working = test_webhook(public_url)
        
        print(f"\n{'='*60}")
        if webhook_working:
            print("🎉 SUCCESS! Your RuralReach is now LIVE!")
        else:
            print("⚠️  WARNING: Ngrok started but webhook test failed")
        
        print(f"📞 USSD Callback URL: {public_url}/ussd")
        print(f"🩺 Health Check: {public_url}/health")
        print(f"🔍 Ngrok Dashboard: http://localhost:4040")
        print(f"{'='*60}")
        
        if webhook_working:
            print("\n📝 Next steps:")
            print("1. Go to Africa's Talking Dashboard")
            print("2. Update your USSD service callback URL to:")
            print(f"   {public_url}/ussd")
            print("3. Set HTTP Method: POST")
            print("4. Set Content Type: application/json")
            print("5. Test your USSD code!")
        else:
            print("\n❌ Troubleshooting needed:")
            print("   - Check if port 5000 is available")
            print("   - Check firewall settings")
            print("   - Try different ngrok region")
        
        print("\n Press Ctrl+C to stop the application\n")
        
        # Keep the main thread alive
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n Stopping RuralReach...")
    else:
        print(" Failed to start ngrok. Please check:")
        print("   - Is ngrok installed? (run: ngrok --version)")
        print("   - Is ngrok authenticated? (run: ngrok authtoken YOUR_TOKEN)")
        print("   - Check ngrok status: ngrok status")