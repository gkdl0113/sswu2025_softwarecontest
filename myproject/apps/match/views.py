from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.db.models import Prefetch
from .models import Restaurant, MenuWishPost, Comment, DirectMessage, haversine_km
from .forms import MenuWishPostForm, CommentForm, DirectMessageForm

# ---- 서버 렌더링 페이지 뷰 ----

def home(request):
    posts = (MenuWishPost.objects
             .select_related('user','restaurant')
             .prefetch_related('tags')
             .order_by('-created_at')[:50])
    return render(request, 'match/home.html', {'posts': posts})

def post_detail(request, pk):
    post = get_object_or_404(MenuWishPost.objects.select_related('user','restaurant'), pk=pk)
    cform = CommentForm()
    return render(request, 'match/post_detail.html', {'post': post, 'cform': cform})

@login_required
def post_create(request):
    if request.method == 'POST':
        form = MenuWishPostForm(request.POST)
        if form.is_valid():
            post = form.save(user=request.user)
            return redirect('post_detail', pk=post.pk)
    else:
        form = MenuWishPostForm()
    return render(request, 'match/post_form.html', {'form': form})

@login_required
def add_comment(request, pk):
    post = get_object_or_404(MenuWishPost, pk=pk)
    form = CommentForm(request.POST)
    if form.is_valid():
        c = form.save(commit=False)
        c.post = post
        c.user = request.user
        c.save()
    return redirect('post_detail', pk=pk)

@login_required
def send_dm(request, user_id, post_id=None):
    # post.user에게 보내는 경우를 주로 사용
    from django.contrib.auth.models import User
    to_user = get_object_or_404(User, pk=user_id)
    if request.method == 'POST':
        form = DirectMessageForm(request.POST)
        if form.is_valid():
            dm = form.save(commit=False)
            dm.sender = request.user
            dm.recipient = to_user
            dm.save()
            if post_id:
                return redirect('post_detail', pk=post_id)
            return redirect('inbox')
    else:
        form = DirectMessageForm()
    return render(request, 'match/dm_form.html', {'form': form, 'to_user': to_user})

@login_required
def inbox(request):
    threads = (DirectMessage.objects
               .filter(recipient=request.user)
               .select_related('sender')
               .order_by('-created_at')[:50])
    return render(request, 'match/inbox.html', {'threads': threads})

def recommend_matches(request, pk):
    """태그 최소 1개 겹치고, 식당 거리 2km 이내인 글 추천(간단 버전)"""
    base = get_object_or_404(MenuWishPost.objects.select_related('restaurant').prefetch_related('tags'), pk=pk)
    base_tags = set(base.tags.values_list('id', flat=True))
    recs = []
    qs = MenuWishPost.objects.exclude(pk=pk).select_related('restaurant').prefetch_related('tags')
    for p in qs:
        if not base_tags.intersection(set(p.tags.values_list('id', flat=True))):
            continue
        if base.restaurant and p.restaurant:
            d = haversine_km(base.restaurant.lat, base.restaurant.lng, p.restaurant.lat, p.restaurant.lng)
            if d > 2.0:
                continue
        recs.append(p)
        if len(recs) >= 10:
            break
    return render(request, 'match/recommend.html', {'base': base, 'recs': recs})

# ---- 지도용 간단 JSON (템플릿에서 fetch로 사용 가능) ----
def restaurants_json(request):
    data = list(Restaurant.objects.all().values('id','name','category','address','lat','lng'))
    return JsonResponse(data, safe=False)
