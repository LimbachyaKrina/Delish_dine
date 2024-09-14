from rest_framework.decorators import api_view
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .utils import connect_to_database
from django.core.validators import validate_email
import bcrypt
from google.oauth2 import id_token
from google.auth.transport import requests
from .utils import connect_to_database
import requests
from django.conf import settings
from django.core.mail import send_mail
import random
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from datetime import datetime, timedelta

from django.utils import timezone
from datetime import timedelta
from django.views.decorators.http import require_http_methods

from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
import json


from dotenv import load_dotenv
from django.views.decorators.http import require_GET
from django.views.decorators.http import require_POST

from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from datetime import datetime
import json
from django.conf import settings
from pymongo import MongoClient


from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from pymongo import MongoClient



client = MongoClient(
    "mongodb+srv://krashmeh:krish1407%3F%3F@cluster0.kesohfj.mongodb.net/"
)
db = client["Test_group_project"]
userbase = db["userbase"]
carts = db["carts"]
restaurants_collection = db["Restaurants"]
bookings_collection = db['bookings']

import logging

# Initialize logger
logger = logging.getLogger(__name__)
@csrf_exempt
@require_POST
def check_availability(request):
    try:
        # Log request body
        logger.info(f"Received check availability request: {request.body}")

        data = json.loads(request.body)
        restaurant_name = data.get('restaurant_name')
        date = data.get('date')
        time = data.get('time')
        people = int(data.get('people'))

        # Log extracted data
        logger.info(f"Checking availability for {restaurant_name} on {date} at {time} for {people} people.")

        if not restaurant_name or not date or not time or not people:
            logger.error("Missing required fields in the request")
            return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

        # Check for existing bookings for that time slot
        existing_bookings = bookings_collection.find({
            'restaurant_name': restaurant_name,
            'date': date,
            'time': time
        })

        total_tables = 10  # Assuming 10 tables in the restaurant
        booked_tables = sum([booking['people'] for booking in existing_bookings])

        available_tables = total_tables - booked_tables
        logger.info(f"Available tables: {available_tables}")

        if available_tables > 0:
            return JsonResponse({'success': True, 'available_tables': available_tables})
        else:
            logger.info("No tables available")
            return JsonResponse({'success': False, 'message': 'No tables available'}, status=400)

    except Exception as e:
        logger.error(f"Error in check_availability: {str(e)}")
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

# @csrf_exempt
# @require_POST
# def book_table(request):
#     try:
#         data = json.loads(request.body)
#         restaurant_name = data.get('restaurant_name')
#         date = data.get('date')
#         time = data.get('time')
#         people = int(data.get('people'))
#         name = data.get('name')  # Retrieve customer name from request

#         if not restaurant_name or not date or not time or not people or not name:
#             return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

#         # Log the booking
#         logger.info(f"Booking table for {restaurant_name} on {date} at {time} for {people} people. Customer: {name}")

#         # Add booking to MongoDB
#         booking = {
#             'restaurant_name': restaurant_name,
#             'date': date,
#             'time': time,
#             'people': people,
#             'name': name  # Include customer name in booking data
#         }

#         bookings_collection.insert_one(booking)
#         return JsonResponse({'success': True, 'message': 'Booking successful'})
    
#     except Exception as e:
#         logger.error(f"Error in book_table: {str(e)}")
#         return JsonResponse({'success': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_POST
def book_table(request):
    try:
        data = json.loads(request.body)
        restaurant_name = data.get('restaurant_name')
        date = data.get('date')
        time = data.get('time')
        people = int(data.get('people'))
        user_id = data.get('userId')  # Get userId from the request
        customer_name = data.get('name')  # Get the customer name

        if not restaurant_name or not date or not time or not people or not user_id:
            return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

        # Add booking to MongoDB
        booking = {
            'restaurant_name': restaurant_name,
            'date': date,
            'time': time,
            'people': people,
            'user_id': user_id,  # Include userId in the booking
            'customer_name': customer_name  # Store customer name
        }

        bookings_collection.insert_one(booking)
        return JsonResponse({'success': True, 'message': 'Booking successful'})
    
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@require_GET
def get_bookings(request, restaurant_name):
    try:
        # Query the MongoDB database for bookings by restaurant name
        bookings_cursor = bookings_collection.find({"restaurant_name": restaurant_name})

        bookings_list = list(bookings_cursor)
        
        if len(bookings_list) == 0:
            return JsonResponse({'success': True, 'bookings': []})

        # Convert MongoDB ObjectId to string and prepare for JSON response
        for booking in bookings_list:
            booking['_id'] = str(booking['_id'])

        return JsonResponse({'success': True, 'bookings': bookings_list})

    except Exception as e:
        # Return error in case of an exception
        logger.error(f"Error in get_bookings: {str(e)}")
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@require_GET
def get_restaurant_by_name(request, name, user_id):
    cart = carts.find_one({"user_id": user_id}, {"items": 1, "_id": 0}) or []

    if cart:
        cart = cart["items"]
        items = [cart_item["dish"] for cart_item in cart]
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


def options(request, *args, **kwargs):
    response = JsonResponse({"status": "ok"})
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response["Access-Control-Allow-Credentials"] = "true"
    return response


db, client = connect_to_database()

# Create your views here.


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
                {"message": f"Welcome {username}", "success": True, "id": object_id},
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
                    {"success": True, "data": user_info, "id": str(user.get("_id"))}
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
        user_cart = carts.find_one({"user_id": user_id}, {"items": 1, "_id": 0})["items"]
        return JsonResponse(
            {
                "success": True,
                "message": "Test view",
                "cart": list(user_cart)
                or [
                    {
                        "dish": "Margherita Pizza",
                        "restaurant": "Pizza Palace",
                        "price": 499,
                        "quantity": 2,
                    },
                    {
                        "dish": "Pasta Alfredo",
                        "restaurant": "Italiano Bistro",
                        "price": 299,
                        "quantity": 1,
                    },
                    {
                        "dish": "Caesar Salad",
                        "restaurant": "Salad Stop",
                        "price": 199,
                        "quantity": 3,
                    },
                ],
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
                "image":image,
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
