import random
from django.core.mail import send_mail

# 6자리 인증번호 생성
def generate_code():
    return str(random.randint(100000, 999999))

# 인증번호 메일 보내기
def send_verification_email(email, code):
    subject = "회원가입 인증번호 안내"
    message = f"인증번호는 {code}입니다."  # ✨ 사용자가 원한 깔끔한 메일 내용!
    from_email = "your_email@gmail.com"  # 설정한 발신자 이메일
    recipient_list = [email]  # 받는 사람

    send_mail(subject, message, from_email, recipient_list)
# signup/utils.py
import hashlib, random, string
from django.core.mail import send_mail
from django.conf import settings

def gen_code(n: int = 6) -> str:
    return "".join(random.choices(string.digits, k=n))

def hash_code(code: str) -> str:
    return hashlib.sha256(code.encode()).hexdigest()

def send_verification_email(to_email: str, code: str) -> None:
    """
    settings.py에 설정된 SMTP로 메일 발송 (지금은 Mailtrap).
    실제 외부로 나가지 않고 Mailtrap Inbox에서만 확인됨.
    """
    subj = "[푸드파인더] 이메일 인증코드"
    msg = f"인증번호는 {code} 입니다. 10분 내에 입력해주세요."
    send_mail(subj, msg, settings.DEFAULT_FROM_EMAIL, [to_email], fail_silently=False)
