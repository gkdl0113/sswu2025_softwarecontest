# signup/serializers.py
from rest_framework import serializers

class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    # 실제 회원가입 연동은 이후 단계에서 이어서 구현; 지금은 메일 인증 흐름만 먼저 테스트
