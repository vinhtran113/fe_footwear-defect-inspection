from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import UserProfile

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password')
    
    return render(request, 'login.html')

@login_required
def home_view(request):
    # Get or create user profile
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    return render(request, 'home.html', {'profile': profile})

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def upload_image_view(request):
    # Get or create user profile
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST' and request.FILES.get('image'):
        # Update profile picture
        profile.profile_picture = request.FILES['image']
        profile.save()
        messages.success(request, 'Profile picture updated successfully!')
        return redirect('upload_image')
    
    return render(request, 'upload.html', {'profile': profile}) 