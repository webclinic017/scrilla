import os, datetime
from scrilla import static
from scrilla.util import dater

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(SCRIPT_DIR))))
ENV_DIR = os.path.join(PROJECT_DIR, 'env')

APP_NAME="scrilla"

SIG_FIGS=5

SEPARATER = "-"

LINE_LENGTH = 100

BAR_WIDTH = 0.10

INDENT = 10

RISK_FREE_TITLE = "{} US Treasury"

HELP_MSG = [
    "A financial application for optimizing portfolio allocations, calculating financial statistics and generating graphical plots. This library requires API keys from Alpha Vantage (https://www.alphavantage.co), Quandl (https://www.quandl.com/) and IEX (https://iexcloud.io/) to hydrate with data. These keys should be stored in environment variables named ALPHA_VANTAGE_KEY, QUANDL_KEY and IEX_KEY.",

    "See documentation for more information on configuration and usage: https://github.com/chinchalinchin/scrilla."
]

SYNTAX = "scrilla <command> <options> <tickers>"

TAB = "      "

# every function has a short input and a long input
FUNC_DICT = {
    "asset_type": {
        'name': 'Asset Type',
        'values': ["asset", "a"],
        'args': None,
        'description': "Outputs the asset type for the supplied symbol.",
    },
    "cvar": {
        'name': 'Conditional Value At Risk',
        'values': ["cvar", "cv"],
        'args': ['start_date', 'end_date', 'probability', 'expiry', 'save_file', 'suppress_output', 'json', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Calculates the conditional value at risk, i.e. E(St | St < Sv) where Sv -> Prob(St<Sv) = `prob` , for the list of inputted ticker symbols. 'expiry' and 'prob' are required arguments for this function. Note: 'expiry' is measured in years and is different from the `start` and `end` dates. `start` and `end` are used to calibrate the model to a historical sample and `expiry` is used as the time horizon over which the value at risk is calculated into the future.",
    },
    "var": {
        'name': 'Value At Risk',
        'values': ["var", "v"],
        'args': ['start_date', 'end_date', 'probability', 'expiry', 'save_file', 'suppress_output', 'json', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Calculates the value at risk, i.e. for a given p, the Sv such that Prob(St<Sv) = p. 'expiry' and 'prob' are required arguments for this function. Note: 'expiry' is measured in years and is different from the `start` and `end` dates. `start` and `end` are used to calibrate the model to a historical sample and `expiry` is used as the time horizon over which the value at risk is calculated into the future.",
        'example': 'scrilla var --prob 0.05 --expiry 0.5'
    },
    "capm_equity_cost": {
        'name': 'Capital Asset Pricing Model Cost of Equity',
        'values': ["capm-equity","capm-e"],
        'args': ['start_date', 'end_date','save_file', 'suppress_output', 'json', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Computes the cost of equity according to CAPM for the supplied list of tickers. If no start or end dates are specified, calculations default to the last 100 days of prices. The environment variable MARKET_PROXY defines which ticker serves as a proxy for the market as whole."
    },
    "capm_beta": {
        'name': 'Capital Asset Pricing Model Beta',
        'values': ["capm-beta", "capm-b"],
        'args': ['start_date', 'end_date','save_file', 'suppress_output', 'json', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Computes the market beta according to CAPM for the supplied list of tickers. If no start or end dates are specified, calculations default to the last 100 days of prices. The environment variable MARKET_PROXY defines which ticker serves as a proxy for the market as whole."
    },
    "clear_cache": {
        'name': 'Clear Cache',
        'values': ["clear-cache", "cc"],
        'args': None,
        'description': "Clears the _installation_directiory_/data/cache/ directory of all data."
    },
    "clear_static": {
        'name': 'Clear Static',
        'values': ["clear-static", "cs"],
        'args': None,
        'description': "Clears the _installation_directory_/data/static/ directory of all data. Not recommended unless necessary; Static data takes a long time to reload."
    },
    "clear_common": {
        'name': 'Clear Common',
        'values': ["clear-common", "cc"],
        'args': None,
        'description': "Clears the _installation_directory_/data/common/, which includes API keys stored through the command line and ticker saved to the user watchlist."
    },
    "close": {
        'name': 'Last Closing Price',
        'values': ["close", "cl"],
        'args': None,
        'description': "Return latest closing value for the supplied list of symbols (equity or crypto)."
    },
    "correlation": {
        'name': 'Correlation Matrix',
        'values': ["correlation", "cor"],
        'args': ['start_date', 'end_date','save_file', 'suppress_output', 'json', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Calculate pair-wise correlation for the supplied list of ticker symbols. If no start or end dates are specified, calculations default to the last 100 days of prices."
    }, 
    "correlation_time_series": {
        'name': 'Correlation Time Series',
        'values': ["correlations", "cors"],
        'args': ['start_date', 'end_date','save_file', 'suppress_output', 'json', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Calculate correlation time series for a pair of tickers over a specified date range. If no start or end dates are specified, the default analysis period of 100 days is applied."
    },
    "discount_dividend": {
        'name': 'Discount Dividend Model',
        'values': ["discount-dividend-model", "ddm"],
        'args': ['discount', 'save_file', 'suppress_output', 'json'],
        'description': "Extrapolates future dividend cashflows from historical dividend payments with linear regression and then uses that model to calculate the net present value of all future dividends. If no discount rate is specified, the calculations default to the asset's cost of equity as determined the by the CAPM model."
    },
    "dividends": {
        'name': 'Dividend History',
        'values': ["dividends", "divs"],
        'args': ['start_date', 'end_date', 'save_file', 'suppress_output', 'json'],
        'description': "Displays the price history over the specific date range. If no dates are provided, returns the entire dividend history."
    },
    "efficient_frontier": {
        'name': 'Portfolio Efficient Frontier',
        'values': ["efficient-frontier","ef"],
        'args': ['start_date', 'end_date', 'investment', 'target', 'steps', 'save_file', 'suppress_output', 'json', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Generate a sample of the portfolio's efficient frontier for the supplied list of tickers. The efficient frontier algorithm will minimize a portfolio's volality for a given rate of return and then maximize its return, and then use these points to generate the rest of the frontier by taking increments along the line connecting the (risk,return) profile of the minimum volatility portfolio to the (risk, return) profile of the maximum return portfolio. The number of points calculated in the efficient frontier can be specifed as an integer with the -steps flag. If no -steps is provided, the value of the environment variable FRONTIER_STEPS will be used."
    },
    "examples": {
        'name': 'Example Usage',
        'values': ["examples", "ex"],
        'args': None,
        'description': "Display examples of syntax."
    },
    "gui": {
        'name': 'Graphical User Interface',
        'values': ["gui","g"],
        'args': None,
        'description': "Brings up a Qt GUI for the application (TODO: work in progress!)"
    },
    "help": {
        'name': 'Help Message',
        'values': ["help", "h"],
        'args': None,
        'description': "Print this help message."
    },
    "interest_history": {
        'name': 'Interest Rate History',
        'values': ["interest", "int"],
        'args': ['start_date', 'end_date', 'save_file', 'suppress_output', 'json'],
        'description': "Prints the interest histories for each inputted maturity over the specified date range. If no date range is given, price histories will default to the last 100 days. See `scrilla -yield` for list of maturities."
    },
    "list_watchlist": {
        'name': 'Display Watchlist',
        'values': ["watchlist", "w-ls"],
        'args': None,
        'description': "Lists the equity symbols currently saved to your watchlist."
    },
    "maximize_return": {
        'name': 'Maximize Portfolio Return',
        'values': ["max-return", "max"],
        'args': ['start_date', 'end_date', 'investment', 'target','save_file', 'suppress_output', 'json', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Maximize the return of the portfolio defined by the supplied list of ticker symbols. Returns an array representing the allocations to be made for each asset in a portfolio. If no start or end dates are specified, calculations default to the last 100 days of prices. You can specify an investment with the '-invest' flag, otherwise the result will be output in percentage terms. Note: This function will always allocate 100% to the asset with the highest return. It's a good way to check and see if there are bugs in the algorithm after changes."
    },
    "moving_averages": {
        'name': 'Moving Averages Series',
        'values': ["mov-averages", "mas"],
        'args': ['start_date', 'end_date'],
        'description': "Calculate the current moving averages. If no start or end dates are specified, calculations default to the last 100 days of prices."
    },
    "optimize_portfolio": {
        'name': 'Optimize Portfolio Variance',
        'values': ["optimize-variance", "opt"],
        'args': ['start_date', 'end_date', 'optimize_sharpe', 'investment', 'target','save_file', 'quiet', 'suppress_output', 'json', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Optimize the volatility of the portfolio\'s variance subject to the supplied return target.  Returns an array representing the allocations to be made for each asset in a portfolio. The target return must be specified with the '-target' flag. If no target return is specified, the portfolio's volatility is minimized. If no start or end dates are specified with the '-start' and '-end' flags, calculations default to the last 100 days of prices. You can specify an investment with the '-invest' flag, otherwise the result will be output in percentage terms. If the -sh flag is specified, the function will maximize the portfolio's sharpe ratio instead of minimizing it's volatility."
    },
    "optimize_portfolio_conditional_var": {
        'name': 'Optimize Portfolio Conditional Value At Risk',
        'values':["optimize-cvar", "opt-cvar"],
        'args': ['start_date', 'end_date', 'investment', 'target', 'save_file', 'suppress_output', 'json', 'expiry', 'probability', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Optimizes the conditional value at risk, i.e. E(St | St < Sv) where Sv -> Prob(St<S0) = `prob` , for the portfolio defined by the list of inputted ticker symbols. 'expiry' and 'prob' are required arguments for this function. Note: 'expiry' is measured in years and is different from the `start` and `end` dates. `start` and `end` are used to calibrate the model to a historical sample and `expiry` is used as the time horizon over which the value at risk is calculated into the future."
    },
    "plot_correlation": {
        'name': 'Plot Correlation Time Series',
        'values': ["plot-correlations", "plot-cors"],
        'args': ['start_date', 'end_date', 'save_file', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Generates a time series for the correlation of two ticker symbols over the specified date range."
    },
    "plot_dividends": {
        'name': 'Plot Discount Dividend Model',
        'values': ["plot-dividends", "plot-divs"],
        'args': ['save_file'],
        'description': "Generates a scatter plot graphic of the dividend history for the supplied ticker with a superimposed simple linear regression line. Note: this function only accepts one ticker at a time."
    },
    "plot_frontier": {
        'name': 'Plot Efficient Frontier',
        'values': ["plot-efficient-frontier", "plot-ef"],
        'args': ['start_date', 'end_date', 'save_file', 'steps', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Generates a scatter plot graphic of the portfolio\'s efficient frontier for the supplied list of tickers. The number of points calculated in the efficient frontier can be specifed as an integer with the -steps. If no -steps is provided, the value of the environment variable FRONTIER_STEPS will be used. If this value is not set, the function will default to a value of 5."
    },
    "plot_moving_averages": {
        'name': 'Plot Moving Averages Series',
        'values': ["plot-moving-averages", "plot-mas"],
        'args': ['start_date', 'end_date', 'save_file'],
        'description': "Generates a grouped bar chart of the moving averages for each equity in the supplied list of ticker symbols. If no start or end dates are specified, calculations default to the last 100 days of prices."
    },
    "plot_returns": {
        'name': 'Plot Return Series',
        'values': ["plot-returns", "plot-rets"],
        'args': ['start_date', 'end_date', 'save_file', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Generates a Q-Q Plot to graphically test the normality of returns for the inputted ticker symbol over the specified date range. If no start or date are specified, calculations default to the last 100 days of prices."
    },
    "plot_risk_profile": {
        'name': 'Plot Risk Profile',
        'values': ["plot-risk-profile", "plot-rp"],
        'description': "Generates a scatter plot of the risk-return profile for symbol in the supplied list of ticker symbols. If no start or end dates are specified, calculations default to the last 100 days of prices."
    },
    "plot_yield_curve": {
        'name': 'Plot Yield Curve',
        'values': ["plot-yield-curve","plot-yc"],
        'args': ['start_date', 'save_file'],
        'description': "Generates a plot of the latest United States Treasury Yield Curve. A yield curveo n a different date can be generated by specifying the date with an argument."
    },
    "price_history": {
        'name': 'Price History',
        'values': ["prices", "pr"],
        'args': ['start_date', 'end_date', 'save_file', 'suppress_output', 'json'],
        'description': "Prints the price histories for each inputted asset over the specified date range. If no date range is given, price histories will default to the last 100 days."
    },
    "purge": {
        'name': 'Purge All Data',
        'values': ["purge", "pu"],
        'description': "Removes all files contained with the _installation_directory_/data/static/, _installation_directory_/data/cache/ and _installation_directory_/data/common/ directory, but retains the directories themselves."
    },
    "risk_free_rate": {
        'name': 'Risk Free Rate',
        'values': ["risk-free", "rf"],
        'description': "Returns the current annualized US Treasury yield specified by the RISK_FREE environment variables. Allowable values for RISK_FREE environment variable: ONE_MONTH, TWO_MONTH, THREE_MONTH, SIX_MONTH, ONE_YEAR, TWO_YEAR, THREE_YEAR, FIVE_YEAR, SEVEN_YEAR, TEN_YEAR, TWENTY_YEAR, THIRTY_YEAR."
    },
    "risk_profile" : {
        'name': 'Risk Profile',
        'values': ["risk-profile", "rp"],
        'args': ['start_date', 'end_date', 'save_file', 'suppress_output', 'json', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Calculate the risk-return profile for the supplied list of ticker symbols. If no start or end dates are specified, calculations default to the last 100 days of prices."
    },
    "screener": {
        'name': 'Watchlist Screener',
        'values': ["screen", "scr"],
        'args': ['discount', 'model'],
        'description': "Searchs equity spot prices that trade at a discount to the provided model. If no model is provided, the screener will default to the Discount Dividend Model. If no discount rate is provided, the screener will default to the cost of equity for a ticker calculated using the CAPM model."
    },
    "sharpe_ratio": {
        'name': 'Sharpe Ratio',
        'values': ["sharpe-ratio", "sr"],
        'args': ['start_date', 'end_date', 'save_file', 'quiet','json', static.keys['ESTIMATION']['MOMENT'], static.keys['ESTIMATION']['PERCENT'], static.keys['ESTIMATION']['LIKE']],
        'description': "Computes the sharpe ratio for each tickers in the supplied list"
    },
    "statistic": {
        'name': 'Last Reported Value of Financial Statistic',
        'values': ["stat","s"],
        'args': ['quiet', 'suppress_output', 'json'],
        'description': "Retrieves the latest value for the supplied list of economic statistics. The available list of economic statistic can be found at https://www.quandl.com/data/FRED-Federal-Reserve-Economic-Data/documentation?anchor=growth; it is also stored in the minstallation_directory_/data/static/ directory of the application."
    },
    "statistic_history": {
        'name': 'Financial Statistic History',
        'values': ["stats", "ss"], 
        'args': ['start_date', 'end_date', 'save_file', 'quiet', 'json'],
        'description': "Prints the statistic history for the supplied list of economic statistics.The available list of economic statistic can be found at https://www.quandl.com/data/FRED-Federal-Reserve-Economic-Data/documentation?anchor=growth; it is also stored in the _installation_directory_/data/static/ directory of the application."
    },
    "store": {
        'name': 'API Key Store',
        'values': ["store", "st"],
        'args': ['key', 'value'],
        'description': "Save API key to local _installation_directory_/data/common/ directory."
    },
    "version": {
        'name': 'Display Version',
        'values': ["version", "v"],
        'args': None,
        'description': "Display version."
    },
    "watchlist": {
        'name': 'Stock Watchlist',
        'values': ["watch", "w"],
        'args': None,
        'description': "Saves the supplist list of tickers to your watchlist. These equity symbol are used by the screening algorithms when searching for stocks that trade at a discount."
    },
    "yield_curve": {
        'name': 'Latest Yield Curve',
        'values': ["yield-curve", "yc"],
        'args': None,
        'description': "Displays the current United States Treasury Yield Curve."
    }
}

# Every argument has four ways of being inputted: short-dash-long, long-dash-long, short-dash-short, long-dash-short
ARG_DICT = {
    'META': {
        'arg_groups': ['estimation_method']
    },
    'start_date': {
        'name': 'Sample Start Date',
        'values': ['-start-date', '--start-date', '-start','--start' ],
        'format': lambda s: datetime.datetime.strptime(s, '%Y-%m-%d'),
        'required': False
    },
    'end_date': {
        'name': 'Sample End Date',
        'values': ['-end-date', '--end-date', '-end', '--end'],
        'format': lambda s: datetime.datetime.strptime(s, '%Y-%m-%d'),
        'required': False
    },
    'target': {
        'name': 'Target Return',
        'values': ['-target-return', '--target-return', '-target','--target'],
        'format': float,
        'required': False
    },
    'discount': {
        'name': 'Discount Rate',
        'values': ['-discount-rate', '--discount-rate', '-discount','--discount'],
        'format': float,
        'required': False
    },
    'investment': {
        'name': 'Total Investment',
        'values': ['-investment', '--investment', '-invest', '--invest'],
        'format': float,
        'required': False
    },
    'expiry': {
        'name': 'Time to Expiration',
        'values': ['-expiry', '--expiry', '-exp','--exp'],
        'format': float,
        'required': True
    },
    'probability': {
        'name': 'Probability of Loss',
        'values': ['-probability', '--probability', '-prob', '--prob'],
        'format': float,
        'required': True
    },
    'steps': {
        'name': 'Efficient Frontier Data Points',
        'values': ['-frontier-steps', '--frontier-steps', '-steps','--steps'],
        'format': int,
        'required': False
    },
    'model': {
        'name': 'Watchlist Screener Model',
        'values': ['-pricing-model', '--pricing-model', '-model','--model'],
        'format': str,
        'required': False
    },
    'save_file': {
        'name': 'Save File Location',
        'values': ['-save-file', '--save-file', '-save', '--save'],
        'format': str,
        'required': False
    },
    'optimize_sharpe': {
        'name': 'Optimize Portfolio Sharpe',
        'values': ['-sharpe', '--sharpe', '-sh', '--sh'],
        'format': bool,
        'required': False
    },
    'json': {
        'name': 'Display Results as JSON',
        'values': ['-json', '--json', '-js', '--js'],
        'format': bool,
        'required': False
    },
    'suppress_output': {
        'name': 'Suppress Console Output',
        'values': ['-quiet', '--quiet', "-q", "--q"],
        'format': bool,
        'required': False
    },
    'key': {
        'name': 'Key From Key-Value Pair',
        'value': ['-key', '--key', '-k', '--k'],
        'format': 'str',
        'required': True,
        'allowable': ["ALPHA_VANTAGE_KEY", "QUANDL_KEY", "IEX_KEY"]
    },
    'value': {
        'name': 'Value From Key-Value Pair',
        'value':['-value', '--value', '-v', '--v'],
        'format': 'str',
        'required': True
    },
    static.keys['ESTIMATION']['MOMENT']: {
        'name': 'Method of Moment Matching',
        'values': ['-moments', '--moments', '-mom', '--mom'],
        'format': 'group',
        'group': 'estimation_method',
        'required': False
    },
    static.keys['ESTIMATION']['PERCENT']: {
        'name': 'Method of Percentile Matching',
        'values': ['-percentiles', '--percentiles', '-per', '--per'],
        'format': 'group',
        'group': 'estimation_method',
        'required': False
    },
    static.keys['ESTIMATION']['LIKE']: {
        'name': 'Maximum Likelihood Estimation',
        'values': ['-likelihood','--likelihood','-like', '--like'],
        'format': 'group',
        'group': 'estimation_method',
        'required': False
    }
}

# TODO: come up with better names for the functions here now that GUI and CLI are grouped together
# CLI FORMATTING
def format_profiles(profiles: dict):
    profiles_format = []
    for key, value in profiles.items():
        holding = value
        holding['ticker'] = key
        profiles_format.append(holding)
    return profiles_format

def format_allocation(allocation, portfolio, investment=None):
    allocation_format = []

    if investment is not None:
        shares = portfolio.calculate_approximate_shares(x=allocation, total=investment)
        total = portfolio.calculate_actual_total(x=allocation, total=investment)

    annual_volatility = portfolio.volatility_function(x=allocation) 
    annual_return = portfolio.return_function(x=allocation)

    for j, item in enumerate(portfolio.tickers):
        holding = {}
        holding['ticker'] = item
        holding['allocation'] = round(allocation[j], static.constants['ACCURACY'])
        if investment is not None:
            holding['shares'] = float(shares[j])
        holding['annual_return'] = round(portfolio.mean_return[j], static.constants['ACCURACY']) 
        holding['annual_volatility'] = round(portfolio.sample_vol[j], static.constants['ACCURACY'])
        allocation_format.append(holding)

    json_format = {}
    json_format['holdings'] = allocation_format

    if investment is not None:
        json_format['total'] = float(total)
        
    json_format['portfolio_return'] = annual_return
    json_format['portfolio_volatility'] = annual_volatility
    
    return json_format

def format_frontier(portfolio, frontier, investment=None):
    json_format = []
    for i, item in enumerate(frontier):
        json_format.append(format_allocation(allocation=item, portfolio=portfolio, 
                                                            investment=investment))
    return json_format

def format_moving_averages(tickers, averages_output):
    these_moving_averages, dates = averages_output

    response = {}
    for i, item in enumerate(tickers):
        ticker_str=f'{item}'
        MA_1_str, MA_2_str, MA_3_str = f'{ticker_str}_MA_1', f'{ticker_str}_MA_2', f'{ticker_str}_MA_3'    

        subresponse = {}
        if dates is None:
            subresponse[MA_1_str] = these_moving_averages[i][0]
            subresponse[MA_2_str] = these_moving_averages[i][1]
            subresponse[MA_3_str] = these_moving_averages[i][2]

        else:
            subsubresponse_1, subsubresponse_2, subsubresponse_3 = {}, {}, {}
    
            for j, this_item in enumerate(dates):
                date_str=dater.date_to_string(this_item)
                subsubresponse_1[date_str] = these_moving_averages[i][0][j]
                subsubresponse_2[date_str] = these_moving_averages[i][1][j]
                subsubresponse_3[date_str] = these_moving_averages[i][2][j]

            subresponse[MA_1_str] = subsubresponse_1
            subresponse[MA_2_str] = subsubresponse_2
            subresponse[MA_3_str] = subsubresponse_3

        response[ticker_str] = subresponse
    
    return response

def format_correlation_matrix(tickers, correlation_matrix):
    response = []
    for i, item in enumerate(tickers):
        # correlation_matrix[i][i]
        for j in range(i+1, len(tickers)):
            subresponse = {}
            subresponse[f'{item}_{tickers[j]}_correlation'] = correlation_matrix[j][i]
            response.append(subresponse)
    return response

# GUI FORMATTING
def format_allocation_profile_title(allocation, portfolio) -> str:
    port_return, port_volatility = portfolio.return_function(allocation), portfolio.volatility_function(allocation)
    formatted_result = "("+str(100*port_return)[:5]+"%, " + str(100*port_volatility)[:5]+"%)"
    formatted_result_title = "("
    for symbol in portfolio.tickers:
        if portfolio.tickers.index(symbol) != (len(portfolio.tickers) - 1):
            formatted_result_title += symbol+", "
        else:
            formatted_result_title += symbol + ") Portfolio Return-Risk Profile"
    whole_thing = formatted_result_title +" = "+formatted_result
    return whole_thing
