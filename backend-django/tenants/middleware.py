from django_tenants.middleware.main import TenantMainMiddleware
from django_tenants.utils import get_tenant_model
from django.db import connection
from django.http import Http404

class TenantMiddleware(TenantMainMiddleware):
    def process_request(self, request):
        # Tenta pegar o schema pelo header (útil para APIs/Testes)
        schema_name = request.headers.get('X-Tenant-ID')
        
        if schema_name:
            if schema_name == 'public':
                # Se for public, deixa o django-tenants lidar ou seta manual
                # Mas django-tenants geralmente espera um domínio para o public
                # Vamos assumir que se passou 'public', quer o schema public
                request.urlconf = 'config.urls_public'
                return super().process_request(request)
                
            tenant_model = get_tenant_model()
            try:
                tenant = tenant_model.objects.get(schema_name=schema_name)
            except tenant_model.DoesNotExist:
                raise Http404(f"Tenant '{schema_name}' não encontrado")
            
            # Seta o tenant e o schema
            request.tenant = tenant
            connection.set_tenant(request.tenant)
            
            # Configura o roteamento de URL (importante para admin)
            self.setup_url_routing(request)
        else:
            # Fallback para o comportamento padrão (domínio)
            super().process_request(request)
