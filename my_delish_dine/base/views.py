from rest_framework.decorators import api_view
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .utils import connect_to_database
from django.core.validators import validate_email
import bcrypt
from google.auth.transport import requests
from .utils import connect_to_database
import requests
from django.core.mail import send_mail
import random
from pymongo import MongoClient
import os
from datetime import datetime, timedelta

from django.utils import timezone
from datetime import timedelta

from rest_framework.response import Response

from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
import json


from django.views.decorators.http import require_GET
from django.views.decorators.http import require_POST

load_dotenv()

_,client = connect_to_database()
db = client["Test_group_project"]
userbase = db["userbase"]
carts = db["carts"]
restaurants_collection = db["Restaurants"]


def options(request, *args, **kwargs):
    response = JsonResponse({"status": "ok"})
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response["Access-Control-Allow-Credentials"] = "true"
    return response


db, client = connect_to_database()




@csrf_exempt
@api_view(["POST"])
def SignIn(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if userbase.count_documents({"username": data["username"]}) == 0:
            return JsonResponse(
                {"error": "User does not exist!!", "success": False}, status=400
            )
        user = userbase.find_one({"username": data["username"]})
        username = user.get("username")
        password = user.get("password")
        object_id = str(user.get("_id"))
        print(object_id)
        if bcrypt.checkpw(data["password"].encode("utf-8"), password.encode("utf-8")):
            return JsonResponse(
                {"message": f"Welcome {username}", "success": True, "id": object_id, 'name':username},
                status=200,
            )
        return JsonResponse(
            {"error": "Invalid login credentails!!", "success": False}, status=400
        )


@csrf_exempt
@api_view(["POST"])
def SignUp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            if userbase.count_documents({"username": data["username"]}) != 0:
                return JsonResponse(
                    {"error": "Username already exists!!", "success": False}, status=400
                )
            if userbase.count_documents({"email": data["email"]}) != 0:
                return JsonResponse(
                    {"error": "Email already registered with us!!!", "success": False},
                    status=400,
                )
            username = data["username"]
            email = data["email"]
            fullname = data["fullName"]
            phone = data["phone"]
            confpass = data["confPassword"]
            if len(phone) != 10 or not phone.isdigit() or phone[0] == "0":
                return JsonResponse(
                    {"error": "Invalid phone number!!", "success": False},
                    status=400,
                )
            try:
                validate_email(email)
            except:
                return JsonResponse(
                    {"error": "Invalid email!!", "success": False}, status=400
                )
            password = data["password"]
            if password != confpass:
                return JsonResponse(
                    {"error": "Passwords don't match!!", "success": False}, status=400
                )
            enc_pass = password.encode("utf-8")
            salt = bcrypt.gensalt()
            hashed_pw = bcrypt.hashpw(enc_pass, salt)

            userbase.insert_one(
                {
                    "fullname": fullname,
                    "username": username,
                    "email": email,
                    "password": hashed_pw.decode("utf-8"),
                    "phone": phone,
                }
            )
            response_data = {"message": "User created successfully!!", "success": True}
            return JsonResponse(response_data, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON", "success": False}, status=400)
    return JsonResponse(
        {"error": "Invalid request method", "success": False}, status=405
    )


@csrf_exempt
@api_view(["POST"])
def google_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        google_id = data.get("google_id")  # This is now the user's Google ID
        email = data.get("email")
        name = data.get("name")
        if not google_id:
            return JsonResponse(
                {"success": False, "error": "User ID not provided"}, status=400
            )

        try:
            # Check if the user exists in the database
            user = userbase.find_one({"google_id": google_id})

            if not user:
                # If not, create a new user
                new_user = {
                    "google_id": google_id,
                    "email": email,
                    "name": name,
                }
                userbase.insert_one(new_user)
                created = True
            else:
                # Update the existing user's information
                userbase.update_one(
                    {"google_id": google_id},
                    {
                        "$set": {
                            "email": email,
                            "name": name,
                        }
                    },
                )
                created = False

            # Return success response
            return JsonResponse(
                {
                    "success": True,
                    "user": {"created": created},
                    "id": str(user.get("_id")),
                    'name': name,
                }
            )

        except Exception as e:
            # Log error for debugging
            print(f"Error during Google login: {e}")
            return JsonResponse(
                {"success": False, "error": "Error during login"}, status=400
            )

    return JsonResponse(
        {"success": False, "error": "Invalid request method"}, status=405
    )


@csrf_exempt
@api_view(["POST"])
def facebook_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            token = data.get("token")

            if not token:
                return JsonResponse(
                    {"success": False, "error": "No token provided"}, status=400
                )

            # Validate token with Facebook API
            url = f"https://graph.facebook.com/me?access_token={token}&fields=id,name,email"
            response = requests.get(url)
            user_info = response.json()

            if "error" in user_info:
                return JsonResponse(
                    {
                        "success": False,
                        "error": user_info.get("error", "Invalid token"),
                    },
                    status=400,
                )

            user_id = user_info["id"]
            email = user_info.get("email", "")
            name = user_info.get("name", "")

            # Handle user creation or update
            try:
                user = userbase.find_one({"facebook_id": user_id})

                if user:
                    # User exists, update information if necessary
                    userbase.update_one(
                        {"facebook_id": user_id},
                        {"$set": {"email": email, "name": name}},
                    )
                else:
                    # Create a new user
                    userbase.insert_one(
                        {"facebook_id": user_id, "email": email, "name": name}
                    )

                return JsonResponse(
                    {"success": True, "data": user_info, "id": str(user.get("_id")),'name':name}
                )

            except Exception as e:
                return JsonResponse(
                    {"success": False, "error": f"Database error: {str(e)}"}, status=500
                )

        except json.JSONDecodeError:
            return JsonResponse(
                {"success": False, "error": "Invalid JSON format"}, status=400
            )
        except Exception as e:
            return JsonResponse(
                {"success": False, "error": f"Unexpected error: {str(e)}"}, status=500
            )

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


def generate_otp():
    return int(random.randint(100000, 999999))


@csrf_exempt
@api_view(["POST"])
def forgot_password(request):
    # print("Email Host User:", settings.EMAIL_HOST_USER)
    # print("Email Host Password:", settings.EMAIL_HOST_PASSWORD)
    email_host_user = os.getenv("EMAIL_HOST_USER")
    email_host_password = os.getenv("EMAIL_HOST_PASSWORD")

    try:
        data = json.loads(request.body)
        email = data.get("email")
        print("Email:", email)
        user = userbase.find_one({"email": email})
        print(f"Email Host User: {email_host_user}")
        print(f"Email Host Password: {email_host_password}")
        if user:
            otp = generate_otp()
            expiry_time = timezone.now() + timedelta(minutes=2)
            userbase.update_one(
                {"_id": user["_id"]}, {"$set": {"otp": otp, "otp_expiry": expiry_time}}
            )
            try:
                send_mail(
                    "Password Reset OTP",
                    f"Your OTP is: {otp}. It will expire in 2 minutes.",
                    email_host_user,
                    [email],
                    fail_silently=False,
                )
                return Response(
                    {"success": True, "message": "OTP sent successfully"}, status=200
                )
            except Exception as e:
                print(f"Email sending error: {str(e)}")
                return Response(
                    {"success": False, "error": "Failed to send OTP email"}, status=500
                )
        else:
            return Response({"success": False, "error": "User not found"}, status=404)
    except Exception as e:
        print(f"Unexpected error in forgot_password: {str(e)}")
        return Response(
            {"success": False, "error": "An unexpected error occurred"}, status=500
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        otp = data.get("otp")
        print(otp, email)
        otp = int(otp)
        user = userbase.find_one({"email": email})

        if (
            user
            and user.get("otp") == int(otp)
            and user.get("otp_expiry") > datetime.utcnow()
        ):
            return JsonResponse({"success": True, "id": str(user.get("_id"))})
        else:
            return JsonResponse({"success": False})


@csrf_exempt
@api_view(["POST"])
def get_cart(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data["id"]
        user_cart = carts.find_one({"user_id": user_id}, {"items": 1, "_id": 0})[
            "items"
        ]
        return JsonResponse(
            {
                "success": True,
                "message": "Test view",
                "cart": list(user_cart)
            },
            status=200,
        )


@csrf_exempt
@api_view(["POST"])
def add_dish(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            restaurant = data["name"]
            dishName = data["dishName"]
            price = data["price"]
            user_id = data["id"]
            image = data["image"]
            cart_item = {
                "image": image,
                "restaurant": restaurant,
                "dish": dishName,
                "price": price,
                "quantity": 1,
            }
            cart = carts.find_one({"user_id": user_id}, {"items": 1, "_id": 0}) or []
            if cart:
                cart = cart["items"]
                cart.append(cart_item)
                carts.update_one({"user_id": user_id}, {"$set": {"items": cart}})
            else:
                cart.append(cart_item)
                carts.insert_one({"user_id": user_id, "items": cart, "conf_orders": []})
            return JsonResponse(
                {"success": True, "message": f"Added {dishName} to {user_id} cart!!!"},
                status=200,
            )
        except Exception as e:
            return JsonResponse(
                {"success": False, "error": f"{e}"},
                status=500,
            )


@csrf_exempt
@api_view(["POST"])
def remove_dish(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            all_dishes = data["all"]
            user_id = data["id"]

            if all_dishes:
                # Clear the entire cart
                carts.update_one({"user_id": user_id}, {"$set": {"items": []}})
                return JsonResponse(
                    {
                        "success": True,
                        "message": f"Cart cleared successfully!!!",
                        "all": True,
                    },
                    status=200,
                )
            else:
                # Remove a specific dish from the user's cart
                dish_name = data["dish"]
                restaurant = data["restaurant"]
                
                # Find the user's cart
                cart = carts.find_one({"user_id": user_id}, {"items": 1, "_id": 0})["items"]
                
                # Filter the cart to remove only the specific dish from the specific restaurant
                new_cart = [
                    cart_item for cart_item in cart
                    if not (cart_item["dish"] == dish_name and cart_item["restaurant"] == restaurant)
                ]
                
                # Update the cart with the filtered list
                carts.update_one({"user_id": user_id}, {"$set": {"items": new_cart}})
                
                return JsonResponse(
                    {
                        "success": True,
                        "message": f"Successfully removed {dish_name} from {user_id}'s cart!!",
                        "all": False,
                    },
                    status=200,
                )
        except Exception as e:
            return JsonResponse(
                {"success": False, "error": f"{e}"},
                status=500,
            )

@csrf_exempt
@api_view(["POST"])
def update_quantity(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            dish = data["dish"]
            newQuantity = data["newQuantity"]
            user_id = data["id"]
            user_cart = carts.find_one({"user_id": user_id})["items"]
            for item in user_cart:
                if (
                    item["dish"] == dish["dish"]
                    and item["restaurant"] == dish["restaurant"]
                ):
                    item["quantity"] = newQuantity
                    break
            carts.update_one({"user_id": user_id}, {"$set": {"items": user_cart}})
            return JsonResponse(
                {
                    "success": True,
                    "message": f"Updated quantity for {dish["dish"]}!!!!",
                },
                status=200,
            )
        except Exception as e:
            return JsonResponse(
                {"success": False, "error": f"{e}"},
                status=500,
            )



@csrf_exempt
@require_POST
def book_table(request, name):
    data = json.loads(request.body)
    # Process the booking data and save it to the database
    # (you'll need to implement this logic)
    return JsonResponse({"message": "Table booked successfully!"}, status=201)


@require_GET
def get_restaurant_by_name(request, name, user_id):
    cart = carts.find_one({"user_id": user_id}, {"items": 1, "_id": 0}) or []
    if cart:
        cart = cart["items"]
        items = [
            cart_item["dish"] for cart_item in cart if cart_item["restaurant"] == name
        ]
    else:
        items = []
    restaurant = restaurants_collection.find_one(
        {"Name": {"$regex": f"^{name}$", "$options": "i"}}
    )
    if restaurant:
        restaurant["_id"] = str(restaurant["_id"])
        return JsonResponse(
            {
                "restaurant": restaurant,
                "items": items,
                "message": "Fetched successfully!!!",
            },
            status=200,
        )
    else:
        return JsonResponse({"error": "Restaurant not found"}, status=404)


@require_GET
def get_restaurants(request):
    restaurants = list(restaurants_collection.find({}))
    for restaurant in restaurants:
        restaurant["_id"] = str(restaurant["_id"])
    return JsonResponse(restaurants, safe=False)
