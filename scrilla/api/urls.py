from django.urls import path

from api.views import optimize_portfolio, risk_profile, correlation_matrix

urlpatterns = [ 
    path('optimize/', optimize_portfolio),
    path('profile/', risk_profile),
    path('correlation/', correlation_matrix)
]
