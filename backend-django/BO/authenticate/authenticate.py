from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from django.conf import settings
from accounts.models import Login, User



class Authenticate:
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password
    
    def authenticate(self) -> Optional[User]:
        """
        Autentica o usuário e retorna o objeto User se as credenciais forem válidas.
        """
        try:
            login = Login.objects.get(email=self.email)
            if login.check_password(self.password):
                # Buscar o perfil do usuário relacionado
                try:
                    user = User.objects.get(login=login)
                    return user
                except User.DoesNotExist:
                    # Se não houver perfil, retornar None
                    return None
        except Login.DoesNotExist:
            return None
    
    def generate_token(self, user: User) -> str:
        """
        Gera um token JWT Bearer seguindo o padrão do backend Node.js.
        
        Args:
            user: Objeto User com login e roles
            
        Returns:
            Token JWT como string
        """
        # Obter roles do usuário
        roles = [role.nome for role in user.roles.all()] if hasattr(user, 'roles') else []
        
        # Payload do token seguindo o padrão do Node.js
        payload: Dict[str, Any] = {
            'sub': user.login.id,  # ID do login (equivalente ao user.id no Node.js)
            'email': user.login.email,
            'name': user.full_name or user.login.email,
            'roles': roles if roles else [],
            'iat': int(datetime.utcnow().timestamp()),
            'exp': int((datetime.utcnow() + timedelta(days=1)).timestamp())  # Expira em 1 dia
        }
        
        # Gerar token usando python-jose
        token = jwt.encode(
            payload,
            settings.SECRET_KEY,
            algorithm='HS256'
        )
        
        return token

    def refresh_token(self, token: str, max_refresh_days: int = 7) -> Optional[str]:
        """
        Tenta atualizar (refresh) um token JWT existente.
        Política:
        - Aceita tokens válidos (não expirados) e gera um novo token.
        - Aceita tokens expirados desde que não tenham expirado há mais de `max_refresh_days`.
        - Retorna None se o token for inválido, tiver payload incompleto ou estiver fora da janela de refresh.
        """
        try:
            # Decodificar sem validar exp para poder checar janelas de refresh
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'], options={'verify_exp': False})
        except JWTError:
            return None

        sub = payload.get('sub')
        iat = payload.get('iat')
        exp = payload.get('exp')

        if not sub or not iat or not exp:
            return None

        now_ts = int(datetime.utcnow().timestamp())

        # Se expirado há mais tempo que a janela permitida, não permite refresh
        if exp <= now_ts and (now_ts - exp) > (max_refresh_days * 86400):
            return None

        # Buscar login e usuário
        try:
            login = Login.objects.get(pk=sub)
            user = User.objects.get(login=login)
        except (Login.DoesNotExist, User.DoesNotExist):
            return None

        # Gerar e retornar novo token
        return self.generate_token(user)