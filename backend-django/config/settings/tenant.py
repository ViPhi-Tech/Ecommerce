from .public import *

# Configurações específicas para os schemas dos tenants
# Herda tudo do public.py, mas pode ter configurações específicas

# Apps que devem estar nos tenants
# IMPORTANTE: core precisa estar aqui também para importar Role (mesmo que Role esteja no schema público)
INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.admin',  # Admin do Django
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'core',  # Necessário para importar Role nos models dos tenants
    'accounts',  # Login, User, Company, Address (dados do cliente)
    # Adicione outros apps tenant-aware aqui quando criar:
    # 'ecommerce',
    # 'admin',
    # 'products',
    # 'orders',
]