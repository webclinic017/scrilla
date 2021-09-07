from django.http import HttpResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from core import settings 

from scrilla import files, services
from scrilla.analysis import optimizer, statistics, markets
from scrilla.util import plotter
from scrilla.objects.portfolio import Portfolio
from scrilla.objects.cashflow import Cashflow

def parse_query_params(request):
    return {
        'tickers': request.query_params.getlist('tickers', []),
        'start_date': request.query_params.get('start_date'),
        'end_date': request.query_params.get('end_date'),
        'invest': request.query_params.get('invest'),
        'target': request.query_params.get('target'),
        'mode': str(request.query_params.get('mode')).lower(),
        'image': str(request.query_params.get('image')).lower() == 'true',
        'discount': request.query_params.get('discount'),
        'prob': request.query_params.get('prob'),
        'expiry': request.query_params.get('expiry')
    }

@api_view(['GET'])
def optimize_portfolio(request):
    params = parse_query_params(request)
    
    portfolio = Portfolio(tickers=params['tickers'], start_date=params['start_date'], end_date=params['end_date'])

    if params['mode'] == settings.OPTIMIZE_MODES['sharpe']:
        optimal_allocation = optimizer.maximize_sharpe_ratio(portfolio=portfolio, target_return=params['target'])
    elif params['mode'] == settings.OPTIMIZE_MODES['cvar']:
        optimal_allocation = optimizer.optimize_conditional_value_at_risk(portfolio=portfolio,
                                                                            prob=params['prob'],
                                                                            expiry=params['expiry'],
                                                                            target_return=params['target'])
    else:
        optimal_allocation = optimizer.optimize_portfolio_variance(portfolio=portfolio, target_return=params['target'])

    response = files.format_allocation(optimal_allocation, portfolio, investment=params['invest'])
    
    return Response(data=response)

@api_view(['GET'])
def risk_profile(request):
    params, profiles = parse_query_params(request), {}

    for ticker in params['tickers']:
        profiles[ticker] = statistics.calculate_risk_return(ticker=ticker, start_date=params['start_date'],
                                                            end_date=params['end_date'])
        profiles[ticker]['sharpe_ratio'] = markets.sharpe_ratio(ticker=ticker, start_date=params['start_date'],
                                                            end_date=params['end_date'])
        profiles[ticker]['asset_beta'] = markets.market_beta(ticker=ticker, start_date=params['start_date'],
                                                            end_date=params['end_date'])
        profiles[ticker]['equity_cost'] = markets.cost_of_equity(ticker=ticker, start_date=params['start_date'],
                                                                                end_date=params['end_date'])

    if params['image']:
        graph = plotter.plot_profiles(symbols=params['tickers'], profiles=profiles, show=False)
        response = HttpResponse(content_type="image/png")
        graph.print_png(response)
        return response

    response = files.format_profiles(profiles=profiles)
    return Response(data=profiles)

@api_view(['GET'])
def correlation_matrix(request):
    params = parse_query_params(request)

    matrix = statistics.ito_correlation_matrix(tickers=params['tickers'], start_date=params['start_date'], end_date=params['end_date'])

    response = files.format_correlation_matrix(tickers=params['tickers'], correlation_matrix=matrix)

    return Response(data=response)

@api_view(['GET'])
def efficient_frontier(request):
    params = parse_query_params(request)
    
    portfolio = Portfolio(tickers=params['tickers'], start_date=params['start_date'], end_date=params['end_date'])

    frontier = optimizer.calculate_efficient_frontier(portfolio=portfolio)

    if params['image']:
        graph = plotter.plot_frontier(portfolio=portfolio, frontier=frontier, show=False)
        response = HttpResponse(content_type="image/png")
        graph.print_png(response)
        return response

    response = files.format_frontier(portfolio=portfolio,frontier=frontier,investment=params['invest'])
    return Response(data=response)

@api_view(['GET'])
def discount_dividend(request):
    params, response, cashflow_to_plot = parse_query_params(request), {}, None

    for ticker in params['tickers']:
        if params['discount']:
            discount = params['discount']
        else:
            discount = markets.cost_of_equity(ticker=ticker, start_date=params['start_date'], end_date=params['end_date'])
        
        sample = services.get_dividend_history(ticker=ticker)
        present_value = Cashflow(sample=sample,discount_rate=discount).calculate_net_present_value()

        if present_value:
            response[ticker]={ 'discount_dividend_model': present_value }
        else: 
            response[ticker]={ 'error': 'discount dividend price cannot be computed for this equity' }
        
        if params['image']:
            cashflow_to_plot = Cashflow(sample=sample,discount_rate=discount)
            break
    
    if params['image']:
        graph = plotter.plot_cashflow(ticker=params['tickers'][0], cashflow=cashflow_to_plot, show=False)
        response = HttpResponse(content_type="image/png")
        graph.print_png(response)
        return response
    
    return Response(data=response)

