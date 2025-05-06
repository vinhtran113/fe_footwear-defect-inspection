import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'login_project.settings')
django.setup()

from django.contrib.auth.models import User

def create_admin_user():
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Admin user created successfully!")
    else:
        print("Admin user already exists!")

if __name__ == '__main__':
    create_admin_user() 