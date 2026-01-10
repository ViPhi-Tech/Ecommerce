from django_tenants.models import TenantMixin, DomainMixin
from django.db import models


class Client(TenantMixin):
    name = models.CharField(max_length=100)
    created_on = models.DateField(auto_now_add=True)
    
    # Configurações do tenant
    auto_create_schema = True
    auto_drop_schema = False
    
    class Meta:
        db_table = 'tenants_client'


class Domain(DomainMixin):
    pass
    
    class Meta:
        db_table = 'tenants_domain'
