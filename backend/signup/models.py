# signup/models.py
from django.db import models
from django.utils import timezone
import uuid

class EmailVerification(models.Model):
    PURPOSE_CHOICES = (("signup","signup"),)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_email = models.EmailField()
    code_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    consumed = models.BooleanField(default=False)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES, default="signup")

    def is_valid(self) -> bool:
        return (not self.consumed) and timezone.now() < self.expires_at
