from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from core.models import Role


class LoginManager(BaseUserManager):
    """Manager para o modelo Login"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Cria e retorna um usuário com email e senha"""
        if not email:
            raise ValueError('O email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Cria e retorna um superusuário"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True')
        
        return self.create_user(email, password, **extra_fields)


class Login(AbstractBaseUser, PermissionsMixin):
    """Modelo de usuário customizado usando email como username"""
    email = models.EmailField(unique=True, db_index=True)
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = LoginManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        db_table = 'login'
        ordering = ['-created_at']
        verbose_name = 'Login'
        verbose_name_plural = 'Logins'
    
    def __str__(self):
        return self.email


class Company(models.Model):
    name = models.CharField(max_length=255)
    # Adicione outros campos conforme necessário
    
    class Meta:
        db_table = 'company'


class Address(models.Model):
    street = models.CharField(max_length=255)
    number = models.CharField(max_length=50)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)
    zip_code = models.CharField(max_length=10)
    complement = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        db_table = 'address'


class User(models.Model):
    """Perfil do usuário - dados adicionais relacionados ao Login"""
    login = models.OneToOneField(Login, on_delete=models.CASCADE, related_name='user_profile')
    full_name = models.CharField(max_length=255, null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    address = models.OneToOneField(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name='user')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    roles = models.ManyToManyField(Role, through='UserRole', related_name='users')
    
    class Meta:
        db_table = 'user'
        ordering = ['-created_at']
        verbose_name = 'Perfil do Usuário'
        verbose_name_plural = 'Perfis dos Usuários'
    
    def __str__(self):
        return self.full_name or self.login.email


class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='user_roles')
    
    class Meta:
        db_table = 'user_role'
        unique_together = ['user', 'role']