import subprocess, sys

result = subprocess.run(
    [
        "C:/Users/Kaustubh/AppData/Local/Programs/Python/Python313/python.exe",
        r"C:\Users\Kaustubh\Desktop\Encode\backend\Speech_model\inference.py",
        r"C:\Users\Kaustubh\Desktop\Encode\backend\uploads\6627e510-5d2a-40f7-9f36-5bd9ed8864b6_1772822799087_CliffRichard_3.wav",
        r"C:\Users\Kaustubh\Desktop\Encode\backend\Speech_model",
    ],
    capture_output=True,
    text=True,
)

print("STDOUT:", result.stdout)
print("STDERR:", result.stderr)
print("CODE:", result.returncode)
