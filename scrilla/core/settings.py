import os, dotenv


SECRET_KEY = os.environ.setdefault('SECRET_KEY', 'changeme')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_DIR = os.path.dirname(BASE_DIR)
APP_ENV = str(os.environ.setdefault('APP_ENV', 'local')).strip()

if APP_ENV == 'local':
    dotenv.load_dotenv(os.path.join(PROJECT_DIR, 'env','.env'))

if APP_ENV=='local':
    DEBUG = True
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'db.sqlite3',
        }
    }
    ALLOWED_HOSTS = [ '*' ]
    CORS_ALLOW_ALL_ORIGINS = True

elif APP_ENV=='container':
    DEBUG = True
    DATABASES = {
        'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': str(os.getenv('POSTGRES_HOST')).strip(),
        'NAME': str(os.getenv('POSTGRES_DB')).strip(),
        'USER': str(os.getenv('POSTGRES_USER')).strip(),
        'PASSWORD': str(os.getenv('POSTGRES_PASSWORD')).strip(),
        'PORT': str(os.getenv('POSTGRES_PORT')).strip()
        }
    }
    ALLOWED_HOSTS = [ '*' ]
    CORS_ALLOW_ALL_ORIGINS = True

else: 
    DEBUG = True
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'db.sqlite3',
        }
    }
    ALLOWED_HOSTS = [ '*' ]
    CORS_ALLOW_ALL_ORIGINS = True


SUPERUSER_USERNAME = str(os.getenv('DJANGO_SUPERUSER_USERNAME')).strip()
SUPERUSER_PASSWORD = str(os.getenv('DJANGO_SUPERUSER_PASSWORD')).strip()
SUPERUSER_EMAIL = str(os.getenv('DJANGO_SUPERUSER_EMAIL')).strip()

OPTIMIZE_MODES = {
    'sharpe': 'maximizeSharpeRatio',
    'vol': 'minimizeVolatility',
    'cvar': 'minimizeConditionalValueAtRisk'
}

INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'api.apps.APIConfig'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]


# Internationalization
LANGUAGE_CODE, TIME_ZONE = 'en-us', 'UTC'
USE_I18N, USE_L10N, USE_TZ = True, True, True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')