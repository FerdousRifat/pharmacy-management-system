from django.contrib import admin
from .models import Supplier, Medicine, Customer, Sale, SaleItem

admin.site.register(Supplier)
admin.site.register(Medicine)
admin.site.register(Customer)
admin.site.register(Sale)
admin.site.register(SaleItem)