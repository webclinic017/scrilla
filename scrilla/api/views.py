from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def optimize(request):
    tickers = request.query_params.getlist('tickers', [])
    
    pass

