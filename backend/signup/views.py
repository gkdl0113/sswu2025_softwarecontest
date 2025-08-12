# backend/signup/views.py
from datetime import timedelta

from django.utils import timezone
from django.contrib.auth.models import User

from rest_framework.views import APIView            # ✅ 반드시 위쪽에서 import
from rest_framework import status, permissions
from rest_framework.response import Response

from .models import EmailVerification
from .serializers import SignupSerializer
from .utils import gen_code, hash_code, send_verification_email


class RequestCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get("student_email") or "").strip()
        if "@" not in email:
            return Response({"detail": "이메일 형식이 아닙니다."}, status=400)

        code = gen_code()
        ev = EmailVerification.objects.create(
            student_email=email,
            code_hash=hash_code(code),
            expires_at=timezone.now() + timedelta(minutes=10),
            purpose="signup",
        )
        send_verification_email(email, code)

        return Response({"verification_id": str(ev.id), "expires_in": 600}, status=200)


class VerifyCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        verification_id = request.data.get("verification_id")
        code = request.data.get("code")

        if not verification_id or not code:
            return Response({"detail": "verification_id와 code가 필요합니다."}, status=400)

        try:
            ev = EmailVerification.objects.get(pk=verification_id, purpose="signup")
        except EmailVerification.DoesNotExist:
            return Response({"detail": "잘못된 요청입니다."}, status=400)

        if ev.consumed or timezone.now() >= ev.expires_at:
            return Response({"detail": "만료되었거나 이미 사용된 코드입니다."}, status=400)

        if ev.code_hash != hash_code(code):
            return Response({"detail": "코드가 일치하지 않습니다."}, status=400)

        ev.consumed = True
        ev.save()
        return Response({"verified_token": str(ev.id), "student_email": ev.student_email}, status=200)


class SignupView(APIView):   # ✅ 여기서 APIView가 NameError 나면 import 순서가 문제인 것
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        verified_token = request.data.get("verified_token")
        if not verified_token:
            return Response({"detail": "이메일 인증이 필요합니다."}, status=400)

        try:
            ev = EmailVerification.objects.get(pk=verified_token, purpose="signup", consumed=True)
        except EmailVerification.DoesNotExist:
            return Response({"detail": "이메일 인증이 완료되지 않았습니다."}, status=400)

        ser = SignupSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        username = ser.validated_data["username"]
        password = ser.validated_data["password"]

        if User.objects.filter(username=username).exists():
            return Response({"detail": "이미 존재하는 사용자명입니다."}, status=400)

        user = User.objects.create_user(   # ✅ objects 붙어야 함
            username=username,
            email=ev.student_email,
            password=password,
        )
        return Response({"message": "회원가입 완료", "username": user.username, "email": user.email}, status=201)
