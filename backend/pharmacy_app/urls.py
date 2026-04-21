from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SupplierViewSet,
    MedicineViewSet,
    CustomerViewSet,
    SaleViewSet,
    create_sale,
    export_invoice_xml,
    import_medicines_xml,
    dashboard_stats
)

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)
router.register(r'medicines', MedicineViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'sales', SaleViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/create-sale/', create_sale, name='create_sale'),
    path('api/export-invoice/<int:sale_id>/', export_invoice_xml, name='export_invoice_xml'),
    path('api/import-medicines-xml/', import_medicines_xml, name='import_medicines_xml'),
    path('api/dashboard-stats/', dashboard_stats, name='dashboard_stats'),
]