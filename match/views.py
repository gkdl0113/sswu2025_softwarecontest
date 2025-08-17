from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello, Django! 여기는 match 앱입니다.")

# Create your views here.
