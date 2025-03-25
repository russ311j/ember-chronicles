"""
Simple script to install Bark dependencies
"""
import subprocess
import sys
import os

def install_dependencies():
    """Install the dependencies for Bark from requirements.txt"""
    print("Installing Bark and dependencies...")
    
    # Get the path to the requirements.txt file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    requirements_path = os.path.join(current_dir, 'requirements.txt')
    
    # Check if requirements.txt exists
    if not os.path.exists(requirements_path):
        print(f"Error: Could not find requirements.txt at {requirements_path}")
        return False
    
    # Install dependencies using pip
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', requirements_path])
        print("Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError:
        print("Error: Failed to install dependencies.")
        return False

if __name__ == "__main__":
    success = install_dependencies()
    sys.exit(0 if success else 1) 