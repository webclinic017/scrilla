from django.urls import path

from api.views import optimize_portfolio

urlpatterns = [ 
    path('optimize/', optimize_portfolio)
]
