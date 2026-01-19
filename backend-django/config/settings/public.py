from .base import *

# Apps que ficam no schema público (compartilhado)
SHARED_APPS = (
    'django_tenants',  
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.admin',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'tenants',  # App de tenants
    'core',
    'accounts',
)

# Apps que ficam nos schemas dos tenants
TENANT_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.admin',
    'rest_framework',
    # Seus apps tenant-aware vão aqui
    # 'products',
    # 'orders',
    # etc...
)

INSTALLED_APPS = list(SHARED_APPS) + [app for app in TENANT_APPS if app not in SHARED_APPS]

# Router para sincronizar migrations
DATABASE_ROUTERS = (
    'django_tenants.routers.TenantSyncRouter',
)

# Modelo de Tenant
TENANT_MODEL = "tenants.Client"  # Nome do app.nome do modelo
TENANT_DOMAIN_MODEL = "tenants.Domain"  # Nome do app.nome do modelo

# Configuração de domínio
PUBLIC_SCHEMA_URLCONF = 'config.urls_public'