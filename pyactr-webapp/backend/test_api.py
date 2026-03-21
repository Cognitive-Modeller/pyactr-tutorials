#!/usr/bin/env python3
"""Test the PyACT-R API backend"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_execute_simple():
    """Test simple code execution"""
    print("Testing simple code execution...")
    code = """
print("Hello from PyACT-R!")
x = 5 + 3
print(f"5 + 3 = {x}")
"""

    response = requests.post(
        f"{BASE_URL}/api/execute",
        json={"code": code}
    )

    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Output:\n{result['output']}")
    if result.get('error'):
        print(f"Error: {result['error']}")
    print()

def test_execute_pyactr():
    """Test PyACT-R code execution"""
    print("Testing PyACT-R code execution...")
    code = """
import pyactr as actr

# Create model
model = actr.ACTRModel()
print(f"Model created: {model}")

# Define chunk type
actr.chunktype("fact", "name value")

# Create chunk
chunk = actr.makechunk(chunktype="fact", name="test", value="success")
print(f"Chunk created: {chunk}")
"""

    response = requests.post(
        f"{BASE_URL}/api/execute",
        json={"code": code}
    )

    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Output:\n{result['output']}")
    if result.get('error'):
        print(f"Error: {result['error']}")
    print()

if __name__ == "__main__":
    print("PyACT-R API Backend Test\n")

    try:
        test_health()
        test_execute_simple()
        test_execute_pyactr()
        print("✅ All tests completed!")
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to backend.")
        print("Make sure the backend is running: cd backend && uvicorn main:app")
    except Exception as e:
        print(f"❌ Error: {e}")