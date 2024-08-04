from django.urls import path
from .views import SignIn,SignUp,google_login, facebook_login, forgot_password, verify_otp

# ,send_message

urlpatterns = [
    path('SignUp/',SignUp,name="sign-up"),
    path('SignIn/',SignIn,name="sign-in"),
    path('google_login/', google_login, name='google_login'),
    path('facebook_login/', facebook_login, name='facebook_login'),
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('verify-otp/', verify_otp, name='verify_otp'),
    # path('SendMessage/',send_message,name="send-message")
]
