import requests

payload = {
  "mission": "TESS",
  "period": 4.32,
  "duration": 2.5,
  "depth": 850,
  "snr": 12.7
}
r = requests.post("http://localhost:8000/predict", json=payload)
print(r.json())