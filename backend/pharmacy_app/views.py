from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from xml.etree.ElementTree import Element, SubElement, tostring, fromstring
from xml.dom import minidom

from .models import Supplier, Medicine, Customer, Sale, SaleItem
from .serializers import (
    SupplierSerializer,
    MedicineSerializer,
    CustomerSerializer,
    SaleSerializer
)

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all().order_by('-id')
    serializer_class = SupplierSerializer


class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all().order_by('-id')
    serializer_class = MedicineSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('-id')
    serializer_class = CustomerSerializer


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-id')
    serializer_class = SaleSerializer


@api_view(['POST'])
def create_sale(request):
    """
    Request JSON:
    {
      "customer_id": 1,
      "items": [
        {"medicine_id": 1, "quantity": 2},
        {"medicine_id": 2, "quantity": 1}
      ]
    }
    """
    customer_id = request.data.get('customer_id')
    items = request.data.get('items', [])

    if not customer_id or not items:
        return Response({"error": "customer_id and items are required"}, status=400)

    try:
        customer = Customer.objects.get(id=customer_id)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found"}, status=404)

    sale = Sale.objects.create(customer=customer, total_amount=0)
    total = 0

    for item in items:
        medicine_id = item.get('medicine_id')
        quantity = int(item.get('quantity', 0))

        try:
            medicine = Medicine.objects.get(id=medicine_id)
        except Medicine.DoesNotExist:
            sale.delete()
            return Response({"error": f"Medicine {medicine_id} not found"}, status=404)

        if quantity <= 0:
            sale.delete()
            return Response({"error": "Quantity must be greater than 0"}, status=400)

        if medicine.quantity < quantity:
            sale.delete()
            return Response({"error": f"Not enough stock for {medicine.name}"}, status=400)

        price = medicine.price
        line_total = price * quantity

        SaleItem.objects.create(
            sale=sale,
            medicine=medicine,
            quantity=quantity,
            price=price
        )

        medicine.quantity -= quantity
        medicine.save()

        total += line_total

    sale.total_amount = total
    sale.save()

    serializer = SaleSerializer(sale)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def export_invoice_xml(request, sale_id):
    try:
        sale = Sale.objects.get(id=sale_id)
    except Sale.DoesNotExist:
        return Response({"error": "Sale not found"}, status=404)

    invoice = Element('invoice')
    SubElement(invoice, 'invoice_id').text = str(sale.id)
    SubElement(invoice, 'sale_date').text = str(sale.sale_date)

    customer = SubElement(invoice, 'customer')
    SubElement(customer, 'name').text = sale.customer.name
    SubElement(customer, 'phone').text = sale.customer.phone

    items_el = SubElement(invoice, 'items')
    for item in sale.items.all():
        item_el = SubElement(items_el, 'item')
        SubElement(item_el, 'medicine_name').text = item.medicine.name
        SubElement(item_el, 'quantity').text = str(item.quantity)
        SubElement(item_el, 'price').text = str(item.price)

    SubElement(invoice, 'total').text = str(sale.total_amount)

    rough_string = tostring(invoice, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    xml_data = reparsed.toprettyxml(indent="  ")

    response = HttpResponse(xml_data, content_type='application/xml')
    response['Content-Disposition'] = f'attachment; filename=invoice_{sale.id}.xml'
    return response


@api_view(['POST'])
def import_medicines_xml(request):
    """
    Request JSON:
    {
      "xml_data": "<medicines>...</medicines>"
    }
    """
    xml_data = request.data.get('xml_data')
    if not xml_data:
        return Response({"error": "xml_data is required"}, status=400)

    try:
        root = fromstring(xml_data)
    except Exception:
        return Response({"error": "Invalid XML format"}, status=400)

    imported = []

    for med in root.findall('medicine'):
        name = med.findtext('name', default='')
        category = med.findtext('category', default='')
        batch_no = med.findtext('batch_no', default='')
        expiry_date = med.findtext('expiry_date', default='2026-12-31')
        quantity = int(med.findtext('quantity', default='0'))
        price = med.findtext('price', default='0.00')
        supplier_id = int(med.findtext('supplier_id', default='1'))

        try:
            supplier = Supplier.objects.get(id=supplier_id)
        except Supplier.DoesNotExist:
            continue

        medicine = Medicine.objects.create(
            name=name,
            category=category,
            batch_no=batch_no,
            expiry_date=expiry_date,
            quantity=quantity,
            price=price,
            supplier=supplier
        )
        imported.append(medicine.name)

    return Response({"message": "Medicines imported", "imported": imported})


@api_view(['GET'])
def dashboard_stats(request):
    total_medicines = Medicine.objects.count()
    total_suppliers = Supplier.objects.count()
    total_customers = Customer.objects.count()
    total_sales = Sale.objects.count()
    revenue = sum([sale.total_amount for sale in Sale.objects.all()])

    low_stock = Medicine.objects.filter(quantity__lt=10).count()

    return Response({
        "total_medicines": total_medicines,
        "total_suppliers": total_suppliers,
        "total_customers": total_customers,
        "total_sales": total_sales,
        "revenue": revenue,
        "low_stock": low_stock
    })