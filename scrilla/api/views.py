from django.http import HttpResponse

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core import settings 

from scrilla import services, errors
from scrilla.analysis import optimizer, statistics, markets
from scrilla.util import plotter, formatter, helper
from scrilla.objects.portfolio import Portfolio
from scrilla.objects.cashflow import Cashflow

def parse_date(date : str):
    return helper.parse_date_string(date) if date is not None else None

def parse_float(num : str):
    return float(num) if num is not None else None

def parse_query_params(request):
    try: 
        return {
            'tickers': request.query_params.getlist('tickers', []),
            'start_date': parse_date(request.query_params.get('start')),
            'end_date': parse_date(request.query_params.get('end')),
            'invest': parse_float(request.query_params.get('invest')),
            'target': parse_float(request.query_params.get('target')),
            'mode': str(request.query_params.get('mode')).lower(),
            'image': str(request.query_params.get('image')).lower() == 'true',
            'discount': parse_float(request.query_params.get('discount')), 
            'prob': parse_float(request.query_params.get('prob')),
            'expiry': parse_float(request.query_params.get('expiry'))
        }
    except ValueError as ve:
        raise ve
    except TypeError as te:
        raise te

@api_view(['GET'])
def optimize_portfolio(request):
    try:
        params = parse_query_params(request)
    except ValueError:
        return Response(data={ 'message': 'invalid query parameters'}, status=status.HTTP_400_BAD_REQUEST)

    portfolio = Portfolio(tickers=params['tickers'], start_date=params['start_date'], end_date=params['end_date'])

    if params['mode'] == settings.OPTIMIZE_MODES['maximizeSharpeRatio']:
        optimal_allocation = optimizer.maximize_sharpe_ratio(portfolio=portfolio, target_return=params['target'])
    elif params['mode'] == settings.OPTIMIZE_MODES['minimizeConditionalValueAtRisk']:
        print(type(params['expiry']))
        optimal_allocation = optimizer.optimize_conditional_value_at_risk(portfolio=portfolio,
                                                                            prob=params['prob'],
                                                                            expiry=params['expiry'],
                                                                            target_return=params['target'])
    else:
        optimal_allocation = optimizer.optimize_portfolio_variance(portfolio=portfolio, target_return=params['target'])

    response = formatter.format_allocation(optimal_allocation, portfolio, investment=params['invest'])
    
    return Response(data=response)

@api_view(['GET'])
def risk_profile(request):
    try:
        params, profiles = parse_query_params(request), {}
    except ValueError as ve:
        return Response(data={ 'message': 'invalid query parameters'}, status=status.HTTP_400_BAD_REQUEST)

    for ticker in params['tickers']:
        profiles[ticker] = statistics.calculate_risk_return(ticker=ticker, start_date=params['start_date'],
                                                            end_date=params['end_date'])
        if not params['image']:
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

    response = formatter.format_profiles(profiles=profiles)
    return Response(data=response)

@api_view(['GET'])
def correlation_matrix(request):
    try:
        params = parse_query_params(request)
    except ValueError:
        return Response(data={ 'message': 'invalid query parameters'}, status=status.HTTP_400_BAD_REQUEST)

    matrix = statistics.ito_correlation_matrix(tickers=params['tickers'], start_date=params['start_date'], end_date=params['end_date'])

    response = formatter.format_correlation_matrix(tickers=params['tickers'], correlation_matrix=matrix)

    return Response(data=response)

@api_view(['GET'])
def efficient_frontier(request):
    try:
        params = parse_query_params(request)
    except ValueError:
        return Response(data={ 'message': 'invalid query parameters'}, status=status.HTTP_400_BAD_REQUEST)
    
    portfolio = Portfolio(tickers=params['tickers'], start_date=params['start_date'], end_date=params['end_date'])

    frontier = optimizer.calculate_efficient_frontier(portfolio=portfolio)

    if params['image']:
        graph = plotter.plot_frontier(portfolio=portfolio, frontier=frontier, show=False)
        response = HttpResponse(content_type="image/png")
        graph.print_png(response)
        return response

    response = formatter.format_frontier(portfolio=portfolio,frontier=frontier,investment=params['invest'])
    return Response(data=response)

@api_view(['GET'])
def discount_dividend(request):
    try:
        params, response, cashflow_to_plot = parse_query_params(request), [], None
    except ValueError:
        return Response(data={ 'message': 'invalid query parameters'}, status=status.HTTP_400_BAD_REQUEST)

    for ticker in params['tickers']:
        if params['discount']:
            discount = params['discount']
        else:
            discount = markets.cost_of_equity(ticker=ticker, start_date=params['start_date'], end_date=params['end_date'])
        
        sample = services.get_dividend_history(ticker=ticker)

        if params['image']:
            cashflow_to_plot = Cashflow(sample=sample,discount_rate=discount)
            break

        cashflow = Cashflow(sample=sample,discount_rate=discount)
        present_value = cashflow.calculate_net_present_value()
        subresponse = {}
        
        if present_value:
            subresponse['ticker']=ticker
            subresponse['net_present_value'] = present_value
            subresponse['model_alpha'] = cashflow.alpha
            subresponse['model_beta'] = cashflow.beta
            subresponse['model_discount'] = discount
            subresponse['model_data'] = cashflow.generate_model_comparison()
        else: 
            subresponse['error']= "discount dividend modelprice cannot be computed for this equity"
        
        response.append(subresponse)
    
    if params['image']:
        graph = plotter.plot_cashflow(ticker=params['tickers'][0], cashflow=cashflow_to_plot, show=False)
        response = HttpResponse(content_type="image/png")
        graph.print_png(response)
        return response
    
    return Response(data=response)

