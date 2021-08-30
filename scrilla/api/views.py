from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def optimize(request):
    tickers = request.query_params.getlist('tickers', [])
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    invest = request.query_params.get('invest')
    target = request.query_params.get('target')
    print(tickers)
    print(start_date)
    pass

