from django.urls import path
from .views import (
    SignIn,
    SignUp,
    google_login,
    facebook_login,
    forgot_password,
    verify_otp,
    get_cart,
    get_restaurants,
    get_restaurant_by_name,
    book_please,
    add_dish,
    remove_dish,
    update_quantity,
    get_images_for_restaurants,
    get_user_by_id,
    check_availability,
    get_bookings,
    update_orders,
    update_user,
    get_cart_conf_ord,
    get_bookings
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
    path("api/restaurants/", get_restaurants, name="get_restaurants"),
    path(
        "api/get_restaurant_by_name/<str:name>/<str:user_id>",
        get_restaurant_by_name,
        name="get_restaurant_by_name",
    ),
    path("add_dish/", add_dish, name="add-dish"),
    path("removeDish/", remove_dish, name="remove-dish"),
    path("update_quantity/", update_quantity, name="update-quantity"),
    path("get_images_for_restaurants", get_images_for_restaurants, name="get_images_for_restaurants"),
    path('api/get_user_by_id/<str:id>/', get_user_by_id, name='get_user_by_id'),


    path("api/restaurants/", get_restaurants, name="get_restaurants"),
    path(
        "api/get_restaurant_by_name/<str:name>/<str:user_id>",
        get_restaurant_by_name,
        name="get_restaurant_by_name",
    ),
    path("check_availability/", check_availability, name="check_availability"),
    path('book_please/', book_please, name='book_please'),
    path('api/get_bookings/<str:restaurant_name>/', get_bookings, name='get_bookings'),
    path("update_orders/", update_orders, name="update_orders"),
    path("update_user/", update_user, name="update_user"),
    path("get_bookings/", get_bookings, name="get_bookings"),
    path("get_cart_conf_ord/", get_cart_conf_ord, name="get_cart_conf_ord")
]

