import random #랜덤숫자(인증번호) 생성할때 사용
import json #JSON문자열 파이썬 딕셔너리로 변환
from django.core.mail import send_mail #이메일 보내는 함수
from django.http import JsonResponse #응답을 JSON형태로 반환
from django.views.decorators.csrf import csrf_exempt #crsf검증 비활성화 (API)
from django.conf import settings #settings.py값 불러오기
from .models import EmailVerification #emailverification 모델 (인증코드 저장)
from django.contrib.auth.models import User #Django 기본 user저장
from django.contrib.auth.hashers import make_password #비밀번호 암호화 함수
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
#로그인
@csrf_exempt #CSRF 검사 생략
def login_user(request): #로그인 요청이 들어오면 실행할 함수/ reuqest는 프론트가 보낸 요청 전체가 들어있는 객체
    if request.method != "POST": #로그인은 데이터(아이디,비번)를 보내야하니까 post, get이나 다른요청은 에러반환
        return JsonResponse({"error": "POST 요청만 지원됩니다."}, status=405)

    data = get_request_data(request) #요청본문에서 데이터 꺼냄
    username = data.get("username")  # username 값 꺼냄
    password = data.get("password") # 패스워드 값 써냄

    if not username or not password: #입력값 하나라도 없으면 에러
        return JsonResponse({"error": "아이디와 비밀번호를 모두 입력해주세요."}, status=400)

    # Django 인증 시스템으로 해당 유저가 있는지 확인, username일치하는 유저 찾고 비번 맞는지 비교함
    #맞으면 USER객체 반환 틀리면 None반환
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)  # 유저 있으면 login()으로 세션에 사용자 정보 저장
        return JsonResponse({"message": "로그인 성공"})
    else:
        return JsonResponse({"error": "아이디 또는 비밀번호가 올바르지 않습니다."}, status=400)

@csrf_exempt
def logout_user(request):
    if request.method != "POST":  # 로그아웃도 POST 방식으로 처리
        return JsonResponse({"error": "POST 요청만 지원됩니다."}, status=405)

    # 로그아웃 처리: 세션에서 로그인 정보 제거
    logout(request)

    return JsonResponse({"message": "로그아웃 성공"})       


def get_request_data(request): 
    """
    POST 요청에서 데이터를 가져오는 헬퍼 함수
    - application/json → request.body에서 읽음
    - form-data / x-www-form-urlencoded → request.POST에서 읽음
    """
    if request.content_type == "application/json": #JSON형식일때
        try:
            return json.loads(request.body) #JSON 을 파이썬 dict으로 변환
        except json.JSONDecodeError:
            return {} #JSON 잘못됐으면 빈 dict 반환
    return request.POST #그외 형식이면 request.post사용


@csrf_exempt# CSRF 토큰 검증 비활성화 (프론트와 통신하기 쉽게)
def send_verification_code(request):
    if request.method != "POST": # POST 요청이 아니면
        return JsonResponse({"error": "POST 요청만 지원됩니다."}, status=405)

    data = get_request_data(request) # 요청 데이터 꺼내기
    email = data.get("email") # 이메일 값 가져오기

    if not email:
        return JsonResponse({"error": "이메일을 입력해주세요."}, status=400)

    # 6자리 인증번호 생성
    code = str(random.randint(100000, 999999))
    # EmailVerification 테이블에 (email, code) 저장 (이미 있으면 업데이트)
    EmailVerification.objects.update_or_create(email=email, defaults={"code": code})

    # 이메일 발송
    send_mail(
    subject="[회원가입] 인증번호", # 메일 제목
    message=f"인증번호는 {code}입니다", # 메일 내용
    from_email=settings.DEFAULT_FROM_EMAIL,  # EMAIL_HOST_USER와 동일보내는 사람 (settings.py)
    recipient_list=[email],# 받는 사람 리스트
    fail_silently=False# 오류 발생 시 예외 발생
)

    return JsonResponse({"message": "인증번호 발송 완료"})


@csrf_exempt
def verify_code(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST 요청만 지원됩니다."}, status=405)

    data = get_request_data(request)
    email = data.get("email")
    code = data.get("code")

    if not email or not code:
        return JsonResponse({"error": "이메일과 인증번호를 모두 입력해주세요."}, status=400)

    try:
        verification = EmailVerification.objects.get(email=email)
    except EmailVerification.DoesNotExist:
        return JsonResponse({"error": "인증 기록이 없습니다."}, status=400)

    if verification.code == code: # 코드 일치하면
        request.session['email_verified'] = email # 세션에 이메일 인증 기록 저장
        return JsonResponse({"message": "인증 성공"})
    else:
        return JsonResponse({"error": "인증번호 불일치"}, status=400)


@csrf_exempt
def signup_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST 요청만 지원됩니다."}, status=405)

    data = get_request_data(request)
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirm_password")
# 이메일 인증 확인
    if request.session.get('email_verified') != email:
        return JsonResponse({"error": "이메일 인증 필요"}, status=400)
 # 비밀번호 일치 확인
    if password != confirm_password:
        return JsonResponse({"error": "비밀번호 불일치"}, status=400)
# 중복 username 확인
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "이미 사용 중인 사용자명입니다."}, status=400)
 # 중복 email 확인
    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "이미 가입된 이메일입니다."}, status=400)
 # 새 유저 생성 (비밀번호는 암호화해서 저장)
    User.objects.create(
        username=username,
        email=email,
        password=make_password(password)
    )
    return JsonResponse({"message": "회원가입 완료"})
