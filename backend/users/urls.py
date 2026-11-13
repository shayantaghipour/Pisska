from django.urls import path

from .views import RegisterView, EmailLoginView, ProfileView


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", EmailLoginView.as_view(), name="login"),
    path("me/", ProfileView.as_view(), name="my-profile"),
]