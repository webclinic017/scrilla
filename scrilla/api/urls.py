from django.urls import path

from api.views import optimize_portfolio, risk_profile, correlation_matrix, efficient_frontier, discount_dividend

urlpatterns = [ 
    path('optimize/', optimize_portfolio),
    path('risk-return/', risk_profile),
    path('correlation/', correlation_matrix),
    path('efficient-frontier/', efficient_frontier),
    path('discount-dividend/', discount_dividend)
]
