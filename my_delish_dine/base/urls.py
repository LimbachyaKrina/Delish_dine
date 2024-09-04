from django.urls import path
from .views import (
    SignIn,
    SignUp,
    google_login,
    facebook_login,
    forgot_password,
    verify_otp,
    get_cart,get_restaurants,get_restaurant_by_name,book_table
)

# ,send_message

urlpatterns = [
    path("SignUp/", SignUp, name="sign-up"),
    path("SignIn/", SignIn, name="sign-in"),
    path("google_login/", google_login, name="google_login"),
    path("facebook_login/", facebook_login, name="facebook_login"),
    path("forgot-password/", forgot_password, name="forgot_password"),
    path("verify-otp/", verify_otp, name="verify_otp"),
    path("getCart/", get_cart, name="get_cart"),
    # path('SendMessage/',send_message,name="send-message")
    path('api/restaurants/', get_restaurants, name='get_restaurants'),
    path('api/get_restaurant_by_name/<str:name>/', get_restaurant_by_name, name='get_restaurant_by_name'),
    path('api/book_table/<str:name>/', book_table, name='book_table'),
]
