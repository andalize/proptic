from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.models import PropertyProject, PropertyUnit
from .serializers import PropertyProjectSerializer, PropertyUnitSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly




class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


# PropertyProject Views
class PropertyProjectListAPIView(APIView):
    pagination_class = StandardPagination
    # permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request):
        projects = PropertyProject.objects.all().order_by('name')
        
        # Step 1: Instantiate the paginator
        paginator = self.pagination_class()
        
        # Step 2: Paginate the queryset
        page = paginator.paginate_queryset(projects, request)
        
        # Step 3: Serialize the page
        serializer = PropertyProjectSerializer(page, many=True)
        
        # Step 4: Use the SAME paginator instance to get paginated response
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = PropertyProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PropertyProjectDetailAPIView(APIView):
    """Handles GET, PUT, DELETE for single project"""
    def get_object(self, pk):
        try:
            return PropertyProject.objects.get(pk=pk)
        except PropertyProject.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        project = self.get_object(pk)
        serializer = PropertyProjectSerializer(project)
        return Response(serializer.data)

    def put(self, request, pk):
        project = self.get_object(pk)
        serializer = PropertyProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        project = self.get_object(pk)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# PropertyUnit Views
class PropertyUnitListAPIView(APIView):

    pagination_class = StandardPagination


    """Handles GET all and POST for units"""
    def get(self, request):
        
        units = PropertyUnit.objects.select_related('property_project')
        
        # Optional: filtering can go here

        units = units.order_by('property_project__name', 'unit_name')
        
        # Step 1: Instantiate the paginator
        paginator = self.pagination_class()

        # Step 2: Paginate the queryset
        page = paginator.paginate_queryset(units, request)

        # Step 3: Serialize the page
        serializer = PropertyUnitSerializer(page, many=True)

        # Step 4: Return paginated response from the same paginator instance
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = PropertyUnitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PropertyUnitDetailAPIView(APIView):
    """Handles GET, PUT, DELETE for single unit"""
    def get_object(self, pk):
        try:
            return PropertyUnit.objects.get(pk=pk)
        except PropertyUnit.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        unit = self.get_object(pk)
        serializer = PropertyUnitSerializer(unit)
        return Response(serializer.data)

    def put(self, request, pk):
        unit = self.get_object(pk)
        serializer = PropertyUnitSerializer(unit, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        unit = self.get_object(pk)
        unit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)