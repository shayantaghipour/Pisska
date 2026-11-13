import uuid

from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import UserProfile

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)

    phone_number = serializers.CharField(
        max_length=20,
        required=False,
        allow_blank=True
    )

    def validate_email(self, value):
        value = value.lower().strip()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        phone_number = validated_data.pop("phone_number", "")

        user = User.objects.create_user(
            username=uuid.uuid4().hex,
            email=email,
            password=password,
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        UserProfile.objects.create(
            user=user,
            phone_number=phone_number,
        )

        return user
    
def create(self, validated_data):
    email = validated_data.pop("email")
    password = validated_data.pop("password")
    phone_number = validated_data.pop("phone_number", "")

    user = User.objects.create_user(
        username=uuid.uuid4().hex,
        email=email,
        password=password,
        first_name=validated_data["first_name"],
        last_name=validated_data["last_name"],
    )

    UserProfile.objects.create(
        user=user,
        phone_number=phone_number,
    )

    return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):

    username_field = "email"

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email", "").lower().strip()
        password = attrs.get("password")

        user = User.objects.filter(email__iexact=email).first()

        if not user:
            raise AuthenticationFailed("Invalid email or password.")

        authenticated_user = authenticate(
            request=self.context.get("request"),
            username=user.username,
            password=password,
        )

        if not authenticated_user or not authenticated_user.is_active:
            raise AuthenticationFailed("Invalid email or password.")

        refresh = self.get_token(authenticated_user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

class ProfileSerializer(serializers.ModelSerializer):


    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    first_name = serializers.CharField(
        source="user.first_name"
    )

    last_name = serializers.CharField(
        source="user.last_name"
    )

    class Meta:
        model = UserProfile
        fields = [
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "date_of_birth",
            "gender",
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        instance.phone_number = validated_data.get(
            "phone_number",
            instance.phone_number
        )

        instance.date_of_birth = validated_data.get(
            "date_of_birth",
            instance.date_of_birth
        )

        instance.gender = validated_data.get(
            "gender",
            instance.gender
        )

        instance.save()

        user = instance.user

        user.first_name = user_data.get(
            "first_name",
            user.first_name
        )

        user.last_name = user_data.get(
            "last_name",
            user.last_name
        )

        user.save()

        return instance


