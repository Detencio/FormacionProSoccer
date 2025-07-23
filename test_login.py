#!/usr/bin/env python3

import requests
import json

def test_login():
    url = "http://localhost:8000/auth/login"
    data = {
        "email": "admin@prosoccer.com",
        "password": "123456"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"✅ Login exitoso!")
            print(f"Token: {token_data.get('access_token', 'No token')}")
        else:
            print(f"❌ Login falló")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login() 