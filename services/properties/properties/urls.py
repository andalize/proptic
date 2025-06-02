from django.contrib import admin
from django.urls import path, include
from django.conf import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/users/', include('user.urls')),
    path('api/v1/properties/', include('property_project.urls')),
    path('api/v1/properties/tenancies/', include('tenancy.urls')),
    path('api/v1/bookings/', include('booking.urls')),

]



# if settings.DEBUG:
#     urlpatterns += static(
#         settings.MEDIA_URL,
#         document_root=settings.MEDIA_ROOT,
#     )