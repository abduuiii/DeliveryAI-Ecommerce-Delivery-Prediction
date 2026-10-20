import requests

url = "http://127.0.0.1:5000/predict"

order = {
    "Warehouse_block": "A",
    "Mode_of_Shipment": "Flight",
    "Cost_of_the_Product": 200,
    "Prior_purchases": 3,
    "Product_importance": "high",
    "Gender": "M",
    "Discount_offered": 10,
    "Weight_in_gms": 2500
}

response = requests.post(url, json=order, timeout=10)

print("Status:", response.status_code)
print("Response:", response.json())