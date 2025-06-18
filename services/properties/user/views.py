from django.contrib.auth import get_user_model
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, AuthTokenSerializer, UserRegistrationSerializer
from core.models import Role

User = get_user_model()


class UserListAPIView(APIView):
    """Handles GET (list all users) and POST (create new user)"""
    # permission_classes = [IsAdminUser]  # Only admin can list all users

    def get(self, request):
        # Filter by role if provided in query params
        role_filter = request.query_params.get('role', None)
        
        if role_filter:
            users = User.objects.filter(roles__name=role_filter)
        else:
            users = User.objects.all()
        
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoggedInUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)

        # Get the property project details
        property_project = None
        if request.user.property_project:
            property_project = {
                'id': str(request.user.property_project.id),
                'name': request.user.property_project.name
            }
    
        return Response({
            'user': serializer.data,
            'property_project': property_project
        })



class TenantListAPIView(APIView):
    """Handles GET for listing only tenant users"""
    # permission_classes = [IsAdminUser]

    def get(self, request):
        tenants = User.objects.filter(roles__name='tenant').prefetch_related(
            'tenancies__property_unit__property_project'
        )
        serializer = UserSerializer(tenants, many=True)
        return Response(serializer.data)


class UserDetailAPIView(APIView):
    """Handles GET, PUT, DELETE for single user"""
    # permission_classes = [IsAuthenticated]

    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'pk'

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404

    # def get_permissions(self):
    #     """
    #     Allow users to view/edit their own profile, or admin to view/edit any user
    #     """
    #     if self.request.method == 'GET':
    #         # Users can view their own profile, admins can view any profile
    #         return [IsAuthenticated()]
    #     else:
    #         # Only admins can modify other users, users can modify themselves
    #         return [IsAuthenticated()]

    # def check_object_permissions(self, request, obj):
    #     """
    #     Check if user can access this specific user object
    #     """
    #     if not request.user.is_staff and request.user != obj:
    #         from rest_framework.exceptions import PermissionDenied
    #         raise PermissionDenied("You can only access your own profile.")

    def get(self, request, pk):
        user = self.get_object(pk)
        # self.check_object_permissions(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        self.check_object_permissions(request, user)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        self.check_object_permissions(request, user)
        # Use the serializer's delete method to deactivate instead of hard delete
        serializer = UserSerializer()
        serializer.delete(user)
        return Response(
            {"message": "User account has been deactivated."}, 
            status=status.HTTP_200_OK
        )


class UserProfileAPIView(APIView):
    """Handles current user's profile (GET, PUT)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CreateTokenView(APIView):
    """Create a new JWT token for user"""
    serializer_class = AuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        # Get user roles
        user_roles = [role.name for role in user.roles.all()]

        return Response({
            'token': str(refresh.access_token),
            'user_id': user.pk,
            'email': user.email,
            'roles': user_roles

        }, status=status.HTTP_200_OK)

class UserRegistrationAPIView(APIView):
    """Public endpoint for user registration with role support"""
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Automatically create JWT tokens for new user
            refresh = RefreshToken.for_user(user)

            return Response({
                'message': 'User created successfully',
                'token': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsersByRoleAPIView(APIView):
    """Get users filtered by specific role"""
    permission_classes = [IsAdminUser]

    def get(self, request, role_name):
        try:
            # Verify role exists
            Role.objects.get(name=role_name)
            
            users = User.objects.filter(roles__name=role_name)
            serializer = UserSerializer(users, many=True)
            return Response({
                'role': role_name,
                'count': users.count(),
                'users': serializer.data
            })
        except Role.DoesNotExist:
            return Response(
                {'error': f"Role '{role_name}' does not exist"}, 
                status=status.HTTP_404_NOT_FOUND
            )