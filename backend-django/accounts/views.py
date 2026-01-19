from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from BO.authenticate.authenticate import Authenticate
from BO.user.user import User

class Login(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = self.request.data.get('username')
        password = self.request.data.get('password')

        # Autenticar usuário
        auth = Authenticate(email=username, password=password)
        user = auth.authenticate()

        if not user:
            return Response(
                {
                    'status': False,
                    'descricao': 'Credenciais inválidas'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Gerar token de acesso
        access_token = None
        refresh_token = None

        # Tenta gerar access token padrão
        if hasattr(auth, 'generate_token'):
            try:
                access_token = auth.generate_token(user)
            except TypeError:
                access_token = None

        # Tenta gerar refresh token (metodo separado ou flag)
        if hasattr(auth, 'generate_refresh_token'):
            try:
                refresh_token = auth.generate_refresh_token(user)
            except TypeError:
                refresh_token = None
        elif hasattr(auth, 'generate_token'):
            try:
                # Alguns BOs implementam como generate_token(user, refresh=True)
                refresh_token = auth.generate_token(user, refresh=True)
            except TypeError:
                refresh_token = None

        response_payload = {
            'status': True,
            'descricao': 'Login realizado com sucesso!',
            'token': access_token
        }
        if refresh_token:
            response_payload['refresh_token'] = refresh_token

        return Response(response_payload, status=status.HTTP_200_OK)

class CreateUser(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        email = self.request.data.get('email')
        password = self.request.data.get('password')
        full_name = self.request.data.get('full_name')

        bo_user = User(email=email, username=email)
        django_user = bo_user.create(email=email, password=password, full_name=full_name)

        return Response(
            {
                'status': True,
                'descricao': 'Usuário criado com sucesso!',
                'user_id': bo_user.user_id,
                'username': bo_user.username,
                'email': bo_user.email
            },
            status=status.HTTP_201_CREATED
        )