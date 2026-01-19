
from django.contrib.auth import get_user_model
from django.db import IntegrityError

import accounts.models


class User:
    def __init__(self, username, email, user_id=None):
        self.user_id = user_id
        self.username = username
        self.email = email

    def get_user_info(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email
        }

    def create(self, email, password, is_superuser=True, full_name=None):
        """
        Cria um usuário Django. Por padrão usa create_superuser se is_superuser=True,
        caso contrário usa create_user. Atualiza o objeto BO.User e retorna a instância Django.
        """
        UserModel = get_user_model()
        try:
            if is_superuser:
                django_user = UserModel.objects.create_superuser(email=email, password=password)
            else:
                django_user = UserModel.objects.create_user(email=email, password=password)
        except IntegrityError:
            # Usuário já existe; tenta recuperar
            django_user = UserModel.objects.filter(email=email).first()
            if not django_user:
                raise

        user = accounts.models.User(login_id=django_user.pk)
        user.full_name = full_name
        user.save()
        # Atualiza atributos do objeto BO.User.
        self.user_id = getattr(django_user, 'pk', None)
        self.username = getattr(django_user, 'email', None)
        self.email = getattr(django_user, 'email', None)

        return django_user