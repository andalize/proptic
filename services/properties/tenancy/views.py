from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.models import Tenancy
from .serializers import TenancySerializer
from django.shortcuts import get_object_or_404

class TenancyListCreateAPIView(APIView):
    """List all tenancies or create a new one."""
    
    def get(self, request):
        tenancies = Tenancy.objects.select_related('tenant', 'property_unit').all()
        serializer = TenancySerializer(tenancies, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TenancySerializer(data=request.data)
        if serializer.is_valid():
            tenancy = serializer.save()
            return Response(TenancySerializer(tenancy).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TenancyDetailAPIView(APIView):
    """Retrieve, update or delete a specific tenancy."""

    def get_object(self, pk):
        return get_object_or_404(Tenancy, pk=pk)

    def get(self, request, pk):
        tenancy = self.get_object(pk)
        serializer = TenancySerializer(tenancy)
        return Response(serializer.data)

    def put(self, request, pk):
        tenancy = self.get_object(pk)
        serializer = TenancySerializer(tenancy, data=request.data, partial=True)
        if serializer.is_valid():
            tenancy = serializer.save()
            return Response(TenancySerializer(tenancy).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        tenancy = self.get_object(pk)
        tenancy.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
