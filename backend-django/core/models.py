from django.db import models
import uuid


class Role(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'role'
        ordering = ['nome']
