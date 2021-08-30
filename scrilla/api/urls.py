from django.urls import path

from api.views import optimize

urlpatterns = [ 
    path('optimize/', optimize)
]
