import urllib.request
import urllib.parse

# Create multipart form data manually
boundary = '----WebKitFormBoundary'
body = f'--{boundary}\r\nContent-Disposition: form-data; name="files"; filename="README.md"\r\nContent-Type: text/markdown\r\n\r\n'.encode()

with open('README.md', 'rb') as f:
    content = f.read()
    
body += content + f'\r\n--{boundary}--\r\n'.encode()

req = urllib.request.Request(
    'http://127.0.0.1:5000/upload',
    data=body,
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.status, response.read().decode())
except urllib.error.HTTPError as e:
    print(e.code, e.read().decode())