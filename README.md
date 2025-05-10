# footwear-defect-inspection
Detects common footwear defects like stitching and knitting errors
Hướng dẫn cài đặt
Mở Command Prompt:

1. Clone repository
  git clone <repo_url>
  cd fe_footwear-defect-inspection
  cd frontend

3. Tạo và kích hoạt môi trường ảo
Tạo môi trường ảo (Windows)
  python -m venv env

Kích hoạt môi trường ảo
  env\Scripts\activate

3. Cài đặt các thư viện cần thiết
  pip install -r requirements.txt

4. Chạy migrate database
  python manage.py makemigrations
  python manage.py migrate

6. Chạy server
  python manage.py runserver

  Truy cập tại: http://127.0.0.1:8000/
