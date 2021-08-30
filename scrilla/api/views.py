from rest_framework.decorators import api_view
from rest_framework.response import Response

from scrilla import files
from scrilla.analysis import optimizer, statistics, markets
from scrilla.objects.portfolio import Portfolio

def parse_query_params(request):
    return {
        'tickers': request.query_params.getlist('tickers', []),
        'start_date': request.query_params.get('start_date'),
        'end_date': request.query_params.get('end_date'),
        'invest': request.query_params.get('invest'),
        'target': request.query_params.get('target'),
        'sharpe': request.query_params.get('sharpe')
    }

@api_view(['GET'])
def optimize_portfolio(request):
    params = parse_query_params(request)
    
    portfolio = Portfolio(tickers=params['tickers'], start_date=params['start_date'], end_date=params['end_date'])

    if params['sharpe']:
        optimal_allocation = optimizer.maximize_sharpe_ratio(portfolio=portfolio, target_return=params['target'])
    else:
        optimal_allocation = optimizer.optimize_portfolio_variance(portfolio=portfolio, target_return=params['target'])

    response = files.format_allocation(optimal_allocation, portfolio, investment=params['invest'])
    
    return Response(data=response)

@api_view(['GET'])
def risk_profile(request):
    params, profiles = parse_query_params(request), {}

    for ticker in params['tickers']:
        profiles[ticker] = statistics.calculate_risk_return(ticker=params['tickers'], start_date=params['start_date'],
                                                            end_date=params['end_date'])
        profiles[ticker]['sharpe_ratio'] = markets.sharpe_ratio(ticker=params['tickers'], start_date=params['start_date'],
                                                            end_date=params['end_date'])
        profiles[ticker]['asset_beta'] = markets.market_beta(ticker=params['tickers'], start_date=params['start_date'],
                                                            end_date=params['end_date'])

    return Response(data=profiles)

@api_view(['GET'])
def correlation_matrix(request):
    params = parse_query_params(request)

    matrix = statistics.ito_correlation_matrix(tickers=params['tickers'], start_date=params['start_date'], end_date=params['end_date'])

    response = files.format_correlation_matrix(tickers=params['tickers'], correlation_matrix=matrix)

    return Response(data=response)