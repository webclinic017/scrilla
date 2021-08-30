from django.urls import path, include

urlpatterns = [ 
    path('analysis/', include('analysis.urls'))
]
