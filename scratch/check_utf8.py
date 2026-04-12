
import sys

def find_invalid_utf8(filename):
    with open(filename, 'rb') as f:
        data = f.read()
    
    try:
        data.decode('utf-8')
        print("File is valid UTF-8")
    except UnicodeDecodeError as e:
        print(f"UnicodeDecodeError: {e}")
        print(f"Index: {e.start}")
        print(f"Bytes: {data[e.start:e.start+5]}")

if __name__ == "__main__":
    find_invalid_utf8(r"c:\Users\RollandTech\Desktop\bizzAI\BizAI\app\terms\page.tsx")
