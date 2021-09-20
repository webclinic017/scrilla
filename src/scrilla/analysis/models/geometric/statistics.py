# This file is part of scrilla: https://github.com/chinchalinchin/scrilla.

# scrilla is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License version 3
# as published by the Free Software Foundation.

# scrilla is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with scrilla.  If not, see <https://www.gnu.org/licenses/>
# or <https://github.com/chinchalinchin/scrilla/blob/develop/main/LICENSE>.

from os import path
from datetime import timedelta
from sys import path as sys_path
from numpy import log, sqrt
from scipy.stats import norm
from scipy.optimize import fsolve

if __name__=="__main__":
    APP_DIR = path.dirname(path.dirname(path.abspath(__file__)))
    sys_path.append(APP_DIR)

from scrilla import static, services, files, settings, errors, cache
from scrilla.analysis import estimators, optimizer
from scrilla.util import outputter, formatter, helper

logger = outputter.Logger('statistics', settings.LOG_LEVEL)
profile_cache = cache.ProfileCache()
correlation_cache = cache.CorrelationCache()
    
def get_sample_of_returns(prices, asset_type, trading_period):
    today = False

    sample_of_returns = []

    for date in prices:
        todays_price = prices[date][static.keys['PRICES']['CLOSE']]

        if today:
            logger.verbose(f'{date}: (todays_price, tomorrows_price) = ({todays_price}, {tomorrows_price})')
            # crypto prices may have weekends and holidays removed during correlation algorithm 
            # so samples can be compared to equities, need to account for these dates by increasing
            # the time_delta by the number of missed days. 
            if asset_type == static.keys['ASSETS']['CRYPTO'] or \
                (asset_type == static.keys['ASSETS']['EQUITY'] and not helper.consecutive_trading_days(tomorrows_date, date)):
                time_delta = (helper.parse_date_string(tomorrows_date) - helper.parse_date_string(date)).days 
            else:
                time_delta = 1

            todays_return = log(float(tomorrows_price)/float(todays_price))/(time_delta*trading_period)

            sample_of_returns.append(todays_return)
        else:
            today = True

        tomorrows_price = prices[date][static.keys['PRICES']['CLOSE']]
        tomorrows_date = date
    
    return sample_of_returns

def calculate_moving_averages(tickers, start_date=None, end_date=None, sample_prices=None):
    # TODO: i need to redo this. this is needlessly inefficient. mean telescopes when 
    #       calculating with moments. don't need to sum everything. 
    # TODO: calculate moving averages with different estimation techniques.
    # TODO: simple moving averages vs exponential moving averages, etc. 
    """
    Parameters
    ----------
    1. tickers : [ str ] \n
        array of ticker symbols correspond to the moving averages to be calculated. \n \n 
    2. start_date : datetime.date \n 
        Optional. Defaults to `None`. start date of the time period over which the moving averages will be calculated. \n \n 
    3. end_date : datetime.date\n 
        Optional. Defaults to `None`. end date of the time period over which the moving averages will be calculated. \n \n 
    4. sample_prices : { 'ticker' (str) : { 'date' (str) : 'price' (str) } } \n
        Optional. Defaults to `None`. A list of the asset prices for which moving_averages will be calculated. Overrides calls to service and calculates correlation for sample of prices supplied. Function will disregard start_date and end_date if sample_price is specified. Must be of the format: {'ticker_1': { 'date_1' : 'price_1', 'date_2': 'price_2' .}, 'ticker_2': { 'date_1' : 'price_1:, ... } } and ordered from latest date to earliest date.  \n \n
    
    Output
    ------
    (averages, dates)-tuple, where averages is a 3D array with the following format :
    averages[ticker][period][date] and dates is a list of dates between the start_date
    and end_date

    Notes
    -----
    NOTE #1: assumes price history is ordered from latest to earliest date. \n \n 
    NOTE #2: If no start_date and end_date passed in, static snapshot of moving averages,
            i.e. the moving averages as of today (or last close), are calculated and 
            returned. \n \n
    NOTE #3: If asset types are mixed, then the sample from which the average is calculated
           only consists of prices on business days. In other words, since crypo trades on
           weekends, to compare the moving average of equities and crypto, the moving average
           is only returned for business days. The moving average of crypto is still calculated
           using weekend price data, i.e. the moving average on Monday contains information about
           the moving average on Sunday, but the moving average on Sunday is discarded from the
           returned data, due to the fact equities are not traded on weekends. \n \n 
    NOTE #4: MOVING AVERAGE OVER DATE RANGE LOOP CALCULATION PSEUDO-CODE \n 
              1. for start date to end date: \n
                2. get today's price \n
                3. calculate today's return \n
                4. for all elements of MAs_n \n
                    5. if today's date is less than a MA_n period away from the date of this MAs_n element \n
                        6. add today's return / MA_n_PERIOD to this element of MAs_n \n 
                        7. create today's MAs_n element \n
    """
    moving_averages = []

    ##########################################
    ### Moving Average Snapshot On Single Date
    if start_date is None and end_date is None:
        for ticker in tickers:
            logger.debug(f'Calculating Moving Average for {ticker}')

            if sample_prices is None:
                prices = services.get_daily_price_history(ticker)
            else:
                prices = sample_prices[ticker]

            if not prices:
                raise errors.PriceError(f'Prices could not be retrieved for {ticker}')

            asset_type = files.get_asset_type(ticker)
            trading_period = static.get_trading_period(asset_type)

            today = False
            count, tomorrows_price, MA_1, MA_2, MA_3 = 1, 0, 0, 0, 0
    
            for date in prices:
                todays_price = prices[date][static.keys['PRICES']['CLOSE']]
                if today:
                    todays_return = log(float(tomorrows_price) / float(todays_price))/trading_period
                    logger.verbose(f'todays_return == {tomorrows_price}/({todays_price}*{round(trading_period,2)}) = {todays_return}') 

                    if count < settings.MA_1_PERIOD:
                        MA_1 += todays_return / settings.MA_1_PERIOD
                        
                    if count < settings.MA_2_PERIOD:
                        MA_2 += todays_return / settings.MA_2_PERIOD

                    if count < settings.MA_3_PERIOD:
                        MA_3 += todays_return / settings.MA_3_PERIOD  
                        count += 1

                else:
                    today = True

                tomorrows_price = prices[date][static.keys['PRICES']['CLOSE']]

            logger.verbose(f'(MA_1, MA_2, MA_3)_{ticker} = ({MA_1}, {MA_2}, {MA_3}')
            moving_averages.append([MA_1, MA_2, MA_3])

        return moving_averages, None

    ################################################
    #### Moving Average Scatter Plot Over Date Range

    ### TODO: this needs work. needs the intersect_dict_keys method like correlation did.

    previous_asset_type, portfolio_asset_type = None, None
    mixed_flag = False
    original_day_count = 0

    ### START ARGUMENT VALIDATION ###
    logger.debug('Checking provided tickers for mixed asset types.')
    for ticker in tickers:
        asset_type = files.get_asset_type(ticker)
        portfolio_asset_type = asset_type
        if (
            previous_asset_type is not None
            and previous_asset_type != asset_type
        ):
            logger.debug('Tickers include mixed asset types, flagging calculation.')
            portfolio_asset_type = None
            mixed_flag = True
            break
        previous_asset_type = asset_type

    if not mixed_flag:
        logger.debug(f'Tickers provided all of {portfolio_asset_type} asset type.')

    logger.debug('Calculating length of date range in trading days.')
    if mixed_flag:
        original_day_count = helper.business_days_between(start_date, end_date)
    elif portfolio_asset_type == static.keys['ASSETS']['EQUITY']:
        original_day_count = helper.business_days_between(start_date, end_date)
    elif portfolio_asset_type == static.keys['ASSETS']['CRYPTO']:
        original_day_count = (end_date - start_date).days
    else:
        original_day_count = helper.business_days_between(start_date, end_date)

    logger.debug(f'{end_date} - {start_date} = {original_day_count} trading days')

    for ticker in tickers:
        logger.debug(f'Calculating Moving Average for {ticker}.')

        asset_type = files.get_asset_type(ticker)
        trading_period = static.get_trading_period(asset_type)

        logger.debug('Offsetting start date to account for longest Moving Average period.')
        if asset_type == static.keys['ASSETS']['CRYPTO']:
            logger.debug(f'{ticker}_asset_type = Crypto')

            logger.debug('Configuring date variables to account for all dates.')
            new_start_date = start_date - timedelta(days=settings.MA_3_PERIOD)
            new_day_count = (end_date - new_start_date).days

            # amend equity trading dates to take account of weekends
        elif asset_type == static.keys['ASSETS']['EQUITY']:
            logger.debug(f'{ticker}_asset_type = Equity')

            logger.debug('Configuring date variables to account for weekends and holidays.')
            new_start_date = helper.decrement_date_by_business_days(start_date=start_date, 
                                                                    business_days=settings.MA_3_PERIOD)
            new_day_count = helper.business_days_between(new_start_date, end_date)

        else:
            logger.debug(f'{ticker}_asset_type = Unknown; Defaulting to business dates')

            logger.debug('Configuring date variables to account for weekends and holidays.')
            new_start_date = helper.decrement_date_by_business_days(start_date=start_date, 
                                                                    business_days=settings.MA_3_PERIOD)
            new_day_count = helper.business_days_between(new_start_date, end_date)

        logger.debug(f'start_date -> new_start_date == {start_date} -> {new_start_date}')
        logger.debug(f'{end_date} - {new_start_date} == {new_day_count}')

        if sample_prices is None:
            logger.debug(f'No {ticker} sample prices provided, calling service.')
            prices = services.get_daily_price_history(ticker, new_start_date, end_date)
        else:
            logger.debug(f'{ticker} sample prices provided, skipping service call.')
            prices = sample_prices[ticker]

        if not prices:
            raise errors.PriceError(f'Prices could not be retrieved for {ticker}')
    ### END ARGUMENT VALIDATION ###

    ### START MOVING AVERAGE CALCULATION ###
        today = False
        count= 1
        tomorrows_price = 0
        MAs_1, MAs_2, MAs_3 = [], [], []

        # See NOTE #4
        for date in prices:
            logger.verbose(f'date: {date}')
            # todays_price = services.price_manager.parse_price_from_date(prices, date, asset_type)
            todays_price = prices[date][static.keys['PRICES']['CLOSE']]

            if today:
                todays_return = log(float(tomorrows_price) / float(todays_price))/trading_period
                logger.verbose(f'todays_return == ln({tomorrows_price}/{todays_price})/{round(trading_period,4)}) = {round(todays_return,4)}') 

                for MA in MAs_1:
                    end_flag = False
                    if len(MAs_1) - MAs_1.index(MA) < settings.MA_1_PERIOD:
                        if len(MAs_1) - MAs_1.index(MA) == settings.MA_1_PERIOD - 1:
                            end_flag = True
                            if asset_type == static.keys['ASSETS']['EQUITY']:
                                date_of_MA1 = helper.decrement_date_string_by_business_days(date, MAs_1.index(MA))
                            elif asset_type == static.keys['ASSETS']['CRYPTO']:
                                date_of_MA1 = helper.string_to_date(date) - timedelta(days=MAs_1.index(MA))
                            else: 
                                date_of_MA1 = helper.string_to_date(date) - timedelta(days=MAs_1.index(MA)) 

                        MA += todays_return / settings.MA_1_PERIOD

                        if end_flag:
                            logger.verbose(f'{ticker}_MA_1({date_of_MA1}) = {MA}')

                # See NOTE #3
                if mixed_flag or portfolio_asset_type == static.keys['ASSETS']['EQUITY']:
                    if not(helper.is_date_string_holiday(date) or helper.is_date_string_weekend(date)): 
                        MAs_1.append( (todays_return / settings.MA_1_PERIOD) )
                elif portfolio_asset_type == static.keys['ASSETS']['CRYPTO']:
                    MAs_1.append( (todays_return / settings.MA_1_PERIOD))

                for MA in MAs_2:
                    end_flag = False
                    if len(MAs_2) - MAs_2.index(MA) < settings.MA_2_PERIOD:
                        if len(MAs_2) - MAs_2.index(MA) == settings.MA_2_PERIOD - 1:
                            end_flag = True
                            if asset_type == static.keys['ASSETS']['EQUITY']:
                                date_of_MA2 = helper.decrement_date_string_by_business_days(date, MAs_2.index(MA))
                            elif asset_type == static.keys['ASSETS']['CRYPTO']:
                                date_of_MA2 = helper.string_to_date(date) + timedelta(days=MAs_2.index(MA))
                            else: 
                                date_of_MA2 = helper.string_to_date(date) + timedelta(days=MAs_2.index(MA)) 
                            
                        MA += todays_return / settings.MA_2_PERIOD

                        if end_flag:
                            logger.verbose(f'{ticker}_MA_2({date_of_MA2}) = {MA}')

                # See NOTE #3
                if mixed_flag or portfolio_asset_type == static.keys['ASSETS']['EQUITY']:
                    if not(helper.is_date_string_holiday(date) or helper.is_date_string_weekend(date)):
                        MAs_2.append((todays_return / settings.MA_2_PERIOD))
                elif portfolio_asset_type == static.keys['ASSETS']['CRYPTO']:
                    MAs_2.append((todays_return / settings.MA_2_PERIOD))

                for MA in MAs_3:
                    end_flag = False
                    if len(MAs_3) - MAs_3.index(MA)  < settings.MA_3_PERIOD:
                        if len(MAs_3) - MAs_3.index(MA) == settings.MA_3_PERIOD - 1:
                            end_flag = True
                            if asset_type == static.keys['ASSETS']['EQUITY']:
                                date_of_MA3 = helper.decrement_date_string_by_business_days(date, MAs_3.index(MA))
                            elif asset_type == static.keys['ASSETS']['CRYPTO']:
                                date_of_MA3 = helper.string_to_date(date) + timedelta(days=MAs_3.index(MA))
                            else: 
                                date_of_MA3 = helper.string_to_date(date) + timedelta(days=MAs_3.index(MA)) 

                        MA += todays_return / settings.MA_3_PERIOD

                        if end_flag:
                            logger.verbose(f'{ticker}_MA_3({date_of_MA3}) = {MA}')

                # See NOTE #3
                if mixed_flag or portfolio_asset_type == static.keys['ASSETS']['EQUITY']:
                    if not(helper.is_date_string_holiday(date) or helper.is_date_string_weekend(date)):
                        MAs_3.append((todays_return / settings.MA_3_PERIOD))
                elif portfolio_asset_type == static.keys['ASSETS']['CRYPTO']: 
                    MAs_3.append((todays_return / settings))

            else:
                today = True
                
            # tomorrows_price = services.price_manager.parse_price_from_date(prices, date, asset_type)
            tomorrows_price = prices[date][static.keys['PRICES']['CLOSE']]

        MAs_1 = MAs_1[:original_day_count]
        MAs_2 = MAs_2[:original_day_count]
        MAs_3 = MAs_3[:original_day_count]

        moving_averages.append([MAs_1, MAs_2, MAs_3])

    ### END MOVING AVERAGE CALCULATION ###

    ### START RESPONSE FORMATTING ###
    if not mixed_flag:
        if portfolio_asset_type == static.keys['ASSETS']['EQUITY']:
            dates_between = helper.business_dates_between(start_date, end_date)
        elif portfolio_asset_type == static.keys['ASSETS']['CRYPTO']:
            dates_between = helper.dates_between(start_date, end_date)
        else:
            dates_between = helper.business_dates_between(start_date, end_date)
    else:
        dates_between = helper.business_dates_between(start_date, end_date)
    
    logger.debug('If everything is correct, then len(moving_averages[0][1]) == len(dates_between)')
    if len(moving_averages[0][1]) == len(dates_between):
        logger.debug("Your program rules.")
        logger.debug('{} = {}'.format(len(moving_averages[0][1]), len(dates_between)))
    else: 
        logger.debug("Your program sucks.")
        logger.debug('{} != {}'.format(len(moving_averages[0][1]), len(dates_between)))

    ### END RESPONSE FORMATTING ###
    return moving_averages, dates_between 

def calculate_risk_return(ticker, start_date=None, end_date=None, sample_prices=None, asset_type=None, method=settings.ESTIMATION_METHOD):
    if method == static.keys['ESTIMATION']['MOMENT']:
        return calculate_moment_risk_return(ticker, start_date, end_date, sample_prices, asset_type)
    if method == static.keys['ESTIMATION']['PERCENT']:
        return calculate_percentile_risk_return(ticker, start_date, end_date, sample_prices, asset_type)
    if method == static.keys['ESTIMATION']['LIKE']:
        return calculate_likelihood_risk_return(ticker, start_date, end_date, sample_prices, asset_type)
    raise errors.ConfigurationError('Statistic estimation method not found')

def calculate_likelihood_risk_return(ticker, start_date=None, end_date=None, sample_prices=None, asset_type=None):
    """
    Description
    -----------
    Estimates the mean rate of return and volatility for a sample of asset prices as if the asset price followed a Geometric Brownian Motion process, i.e. the mean rate of return and volatility are constant and not functions of time or the asset price. Moreover, the return and volatility are estimated using the method of maximum likelihood estimation. The probability of each observation is calculated and then the product is taken to find the probability of the intersection; this probability is maximized with respect to the parameters of the normal distribution, the mean and the volatility.s
    
    Parameters
    ----------
    1. ticker : str \n
        Required. Ticker symbol whose risk-return profile is to be calculated. \n \n 
    2. start_date : datetime.date \n 
        Optional. Start date of the time period over which the risk-return profile is to be calculated. Defaults to `None`, in which case the calculation proceeds as if `start_date` were set to 100 trading days prior to `end_date`. If `get_asset_type(ticker)=scrilla.static.keys['ASSETS']['CRYPTO']`, this means 100 days regardless. If `get_asset_type(ticker)=scrilla.static.keys['ASSETS']['EQUITY']`, this excludes weekends and holidays and decrements the `end_date` by 100 trading days.\n \n
    3. end_date : datetime.date \n 
        Optional. End date of the time period over which the risk-return profile is to be calculated. Defaults to `None`, in which the calculation proceeds as if `end_date` were set to today. If the `get_asset_type(ticker)==static.keys['ASSETS']['CRYPTO']` this means today regardless. If `get_asset_type(ticker)=static.keys['ASSETS']['EQUITY']` this excludes holidays and weekends and sets the end date to the last valid trading date. \n \n
    4. sample_prices : { 'date_1' : { 'open' : number, 'close' : number}, 'date_2': { 'open': number, 'close': number} ... } \n
        Optional. A list of the asset prices for which correlation will be calculated. Overrides calls to service and forces calculation of correlation for sample of prices supplied. Function will disregard `start_date` and `end_date` and use the first and last key as the latest and earliest date, respectively. In other words, the `sample_prices` dictionary must be ordered from latest to earliest.   \n \n
    5. asset_type : str
         Optional. Specify asset type to prevent overusing redundant calculations. Allowable values: scrilla.static.keys['ASSETS']['EQUITY'], scrilla.static.keys['ASSETS']['CRYPTO'] \n \n

    Output
    ------
    { 'annual_return' : float, 'annual_volatility': float } \n \n

    
    Raises 
    ------
    1. scrilla.errors.SampleSizeError \n 
    2. scrilla.errors.PriceError \n
    3. scrilla.errors.InputValidationError \n
    4. scrilla.errors.APIResponseError

    Notes
    -----
    NOTE #1: assumes price history is ordered from latest to earliest date. \n \n 
    """
    if sample_prices is None:
        try:
           asset_type = errors.validate_asset_type(ticker, asset_type)
           start_date, end_date = errors.validate_dates(start_date, end_date, asset_type)
           trading_period = static.get_trading_period(asset_type)
        except errors.InputValidationError as ive:
           raise ive

        # TODO: extra save_or_update argument for estimation method, i.e. moments, percentiles or likelihood
        results = profile_cache.filter_profile_cache(ticker=ticker, start_date=start_date, end_date=end_date, 
                                                        method=static.keys['ESTIMATION']['LIKE'])

        if results is not None \
                and results[static.keys['STATISTICS']['RETURN']] is not None \
                and results[static.keys['STATISTICS']['VOLATILITY']] is not None:
            return results

        try:
            logger.debug('No sample prices provided, calling service.')
            prices = services.get_daily_price_history(ticker=ticker, start_date=start_date, end_date=end_date, asset_type=asset_type)
        except errors.APIResponseError as api:
            raise api
    else:
        logger.debug(f'{ticker} sample prices provided, skipping service call.')
        prices = sample_prices
        try:
           asset_type = errors.validate_asset_type(ticker, asset_type)
           trading_period = static.get_trading_period(asset_type)
        except errors.InputValidationError as ive:
           raise ive

    if not prices:
        raise errors.PriceError(f'No prices could be retrieved for {ticker}')

    sample_of_returns = get_sample_of_returns(prices=prices, asset_type=asset_type, trading_period=trading_period)

    likelihood_estimates = optimizer.maximize_univariate_normal_likelihood(data=sample_of_returns)
    # NOTE: E(dln(S)/delta_t) = (mu - 0.5 * sigma ** 2) * delta_t / delta_t = mu - 0.5 * sigma ** 2 
    # NOTE: Var(dln(S)/delta_t) = (1/delta_t**2)*Var(dlnS) = sigma**2*delta_t / delta_t**2 = sigma**2 / delta_t
    #       so need to multiply volatiliy by sqrt(delta_t) to get correct scale.
    vol = likelihood_estimates[1]*sqrt(trading_period)
    # ito's lemma
    mean =  likelihood_estimates[0] + 0.5 * (vol ** 2)
    results = {
        'annual_return': mean,
        'annual_volatility': vol
    }
    
    profile_cache.save_or_update_row(ticker=ticker, start_date=start_date, end_date=end_date, 
                                        method=static.keys['ESTIMATION']['LIKE'],
                                        annual_return=results['annual_return'], 
                                        annual_volatility=results['annual_volatility'])
    
    return results

def calculate_percentile_risk_return(ticker, start_date=None, end_date=None, sample_prices=None, asset_type=None):
    """
    Description
    -----------
    Estimates the mean rate of return and volatility for a sample of asset prices as if the asset price followed a Geometric Brownian Motion process, i.e. the mean rate of return and volatility are constant and not functions of time or the asset price. Moreover, the return and volatility are estimated using the method of percentile matching, where the return and volatility are estimated by matching the 25th and 75th percentile calculated from the assumed GBM distribution to the sample of data.
    
    Parameters
    ----------
    1. ticker : str \n
        Required. Ticker symbol whose risk-return profile is to be calculated. \n \n 
    2. start_date : datetime.date \n 
        Optional. Start date of the time period over which the risk-return profile is to be calculated. Defaults to `None`, in which case the calculation proceeds as if `start_date` were set to 100 trading days prior to `end_date`. If `get_asset_type(ticker)=scrilla.static.keys['ASSETS']['CRYPTO']`, this means 100 days regardless. If `get_asset_type(ticker)=scrilla.static.keys['ASSETS']['EQUITY']`, this excludes weekends and holidays and decrements the `end_date` by 100 trading days.\n \n
    3. end_date : datetime.date \n 
        Optional. End date of the time period over which the risk-return profile is to be calculated. Defaults to `None`, in which the calculation proceeds as if `end_date` were set to today. If the `get_asset_type(ticker)==static.keys['ASSETS']['CRYPTO']` this means today regardless. If `get_asset_type(ticker)=static.keys['ASSETS']['EQUITY']` this excludes holidays and weekends and sets the end date to the last valid trading date. \n \n
    4. sample_prices : { 'date_1' : { 'open' : number, 'close' : number}, 'date_2': { 'open': number, 'close': number} ... } \n
        Optional. A list of the asset prices for which correlation will be calculated. Overrides calls to service and forces calculation of correlation for sample of prices supplied. Function will disregard `start_date` and `end_date` and use the first and last key as the latest and earliest date, respectively. In other words, the `sample_prices` dictionary must be ordered from latest to earliest.   \n \n
    5. asset_type : str
         Optional. Specify asset type to prevent overusing redundant calculations. Allowable values: scrilla.static.keys['ASSETS']['EQUITY'], scrilla.static.keys['ASSETS']['CRYPTO'] \n \n

    Output
    ------
    { 'annual_return' : float, 'annual_volatility': float } \n \n

    
    Raises 
    ------
    1. scrilla.errors.SampleSizeError \n 
    2. scrilla.errors.PriceError \n
    3. scrilla.errors.InputValidationError \n
    4. scrilla.errors.APIResponseError

    Notes
    -----
    NOTE #1: assumes price history is ordered from latest to earliest date. \n \n 
    """
    if sample_prices is None:
        try:
           asset_type = errors.validate_asset_type(ticker, asset_type)
           start_date, end_date = errors.validate_dates(start_date, end_date, asset_type)
           trading_period = static.get_trading_period(asset_type)
        except errors.InputValidationError as ive:
           raise ive

        # TODO: extra save_or_update argument for estimation method, i.e. moments, percentiles or likelihood
        results = profile_cache.filter_profile_cache(ticker=ticker, start_date=start_date, end_date=end_date, 
                                                        method=static.keys['ESTIMATION']['PERCENT'])

        if results is not None \
                and results[static.keys['STATISTICS']['RETURN']] is not None \
                and results[static.keys['STATISTICS']['VOLATILITY']] is not None:
            return results

        try:
            logger.debug('No sample prices provided, calling service.')
            prices = services.get_daily_price_history(ticker=ticker, start_date=start_date, end_date=end_date, asset_type=asset_type)
        except errors.APIResponseError as api:
            raise api
    else:
        logger.debug(f'{ticker} sample prices provided, skipping service call.')
        prices = sample_prices
        try:
           asset_type = errors.validate_asset_type(ticker, asset_type)
           trading_period = static.get_trading_period(asset_type)
        except errors.InputValidationError as ive:
           raise ive

    if not prices:
        raise errors.PriceError(f'No prices could be retrieved for {ticker}')

    sample_of_returns = get_sample_of_returns(prices=prices, asset_type=asset_type, trading_period=trading_period)

    first_quartile = estimators.sample_percentile(data=sample_of_returns, percentile=0.25)
    median = estimators.sample_percentile(data=sample_of_returns, percentile=0.50)
    third_quartile = estimators.sample_percentile(data=sample_of_returns, percentile=0.75)
    guess = (median, (third_quartile-first_quartile)/2)

    def objective(params):
        return [norm.cdf(x=first_quartile, loc=params[0], scale=params[1]) - 0.25,
                norm.cdf(x=third_quartile, loc=params[0], scale=params[1]) - 0.75 ]
 
    mean, vol = fsolve(objective, guess)

    # NOTE: Var(dln(S)/delta_t) = (1/delta_t^2)*Var(dlnS) = sigma^2*delta_t / delta_t^2 = sigma^2 / delta_t
    #       so need to multiply volatiliy by sqrt(delta_t) to get correct scale.
    vol = vol * sqrt(trading_period) 
    # ito's lemma
    mean = mean + 0.5 * (vol ** 2)
    results = {
        'annual_return': mean,
        'annual_volatility': vol
    }
    
    profile_cache.save_or_update_row(ticker=ticker, start_date=start_date, end_date=end_date, 
                                        method=static.keys['ESTIMATION']['PERCENT'],
                                        annual_return=results['annual_return'], 
                                        annual_volatility=results['annual_volatility'])
    return results

def calculate_moment_risk_return(ticker, start_date=None, end_date=None, sample_prices=None, asset_type=None):
    """
    Description
    -----------
    Estimates the mean rate of return and volatility for a sample of asset prices as if the asset price followed a Geometric Brownian Motion process, i.e. the mean rate of return and volatility are constant and not functions of time or the asset price. Moreover, the return and volatility are estimated using the method of moment matching, where the return is estimated by equating it to the first moment of the sample and the volatility is estimated by equating it to the square root of the second moment of the sample.
    
    Parameters
    ----------
    1. ticker : str \n
        Required. Ticker symbol whose risk-return profile is to be calculated. \n \n 
    2. start_date : datetime.date \n 
        Optional. Start date of the time period over which the risk-return profile is to be calculated. Defaults to `None`, in which case the calculation proceeds as if `start_date` were set to 100 trading days prior to `end_date`. If `get_asset_type(ticker)=scrilla.static.keys['ASSETS']['CRYPTO']`, this means 100 days regardless. If `get_asset_type(ticker)=scrilla.static.keys['ASSETS']['EQUITY']`, this excludes weekends and holidays and decrements the `end_date` by 100 trading days.\n \n
    3. end_date : datetime.date \n 
        Optional. End date of the time period over which the risk-return profile is to be calculated. Defaults to `None`, in which the calculation proceeds as if `end_date` were set to today. If the `get_asset_type(ticker)==static.keys['ASSETS']['CRYPTO']` this means today regardless. If `get_asset_type(ticker)=static.keys['ASSETS']['EQUITY']` this excludes holidays and weekends and sets the end date to the last valid trading date. \n \n
    4. sample_prices : { 'date_1' : { 'open' : number, 'close' : number}, 'date_2': { 'open': number, 'close': number} ... } \n
        Optional. A list of the asset prices for which correlation will be calculated. Overrides calls to service and forces calculation of correlation for sample of prices supplied. Function will disregard `start_date` and `end_date` and use the first and last key as the latest and earliest date, respectively. In other words, the `sample_prices` dictionary must be ordered from latest to earliest.   \n \n
    5. asset_type : str
         Optional. Specify asset type to prevent overusing redundant calculations. Allowable values: scrilla.static.keys['ASSETS']['EQUITY'], scrilla.static.keys['ASSETS']['CRYPTO'] \n \n

    Output
    ------
    ``list``\n
    ``{ 'annual_return' : float, 'annual_volatility': float }`` \n\n

    Raises 
    ------
    1. scrilla.errors.SampleSizeError \n 
    2. scrilla.errors.PriceError \n
    3. scrilla.errors.InputValidationError \n
    4. scrilla.errors.APIResponseError

    Notes
    -----
    NOTE #1: assumes price history is ordered from latest to earliest date. \n \n 
    """

    if sample_prices is None:
        try:
           asset_type = errors.validate_asset_type(ticker, asset_type)
           start_date, end_date = errors.validate_dates(start_date, end_date, asset_type)
           trading_period = static.get_trading_period(asset_type)
        except errors.InputValidationError as ive:
           raise ive

        results = profile_cache.filter_profile_cache(ticker=ticker, start_date=start_date, end_date=end_date, 
                                                        method=static.keys['ESTIMATION']['MOMENT'])

        if results is not None \
                and results[static.keys['STATISTICS']['RETURN']] is not None \
                and results[static.keys['STATISTICS']['VOLATILITY']] is not None:
            return results

        try:
            logger.debug('No sample prices provided, calling service.')
            prices = services.get_daily_price_history(ticker=ticker, start_date=start_date, end_date=end_date, asset_type=asset_type)
        except errors.APIResponseError as api:
            raise api
    else:
        logger.debug(f'{ticker} sample prices provided, skipping service call.')
        prices = sample_prices
        try:
           asset_type = errors.validate_asset_type(ticker, asset_type)
           trading_period = static.get_trading_period(asset_type)
        except errors.InputValidationError as ive:
           raise ive

    if not prices:
        raise errors.PriceError(f'No prices could be retrieved for {ticker}')
    
    # Log of difference loses a sample
    sample = len(prices) - 1
    logger.debug(f'Calculating mean annual return over last {sample} days for {ticker}')

    ### MEAN CALCULATION
    # NOTE: mean return is a telescoping series, i.e. sum of log(x1/x0) only depends on the first and
    # last terms' contributions (because log(x1/x0) + log(x2/x1)= log(x2) - log(x1) + log(x1) - log(x0)) = log(x2/x0))
    # which raises the question how accurate of a measure the population return is of the mean return for an asset?
    # will need to look into other ways of estimating return...
    last_date, first_date = list(prices)[0], list(prices)[-1]
    last_price = prices[last_date][static.keys['PRICES']['CLOSE']]
    first_price = prices[first_date][static.keys['PRICES']['CLOSE']]
    mean_return = log(float(last_price)/float(first_price))/(trading_period*sample)
    
    ### VOLATILITY CALCULATION
    today, variance, tomorrows_price, tomorrows_date = False, 0, 0, None
        # adjust the random variable being measured so expectation is easier to calculate. 
    mean_mod_return = mean_return*sqrt(trading_period)
    logger.debug(f'Calculating mean annual volatility over last {sample} days for {ticker}')

    for date in prices:
        todays_price = prices[date][static.keys['PRICES']['CLOSE']]

        if today:
            logger.verbose(f'{date}: (todays_price, tomorrows_price) = ({todays_price}, {tomorrows_price})')

            # crypto prices may have weekends and holidays removed during correlation algorithm 
            # so samples can be compared to equities, need to account for these dates by increasing
            # the time_delta by the number of missed days. 
            if asset_type == static.keys['ASSETS']['CRYPTO'] or \
                (asset_type == static.keys['ASSETS']['EQUITY'] and not helper.consecutive_trading_days(tomorrows_date, date)):
                time_delta = (helper.parse_date_string(tomorrows_date) - helper.parse_date_string(date)).days 
            else:
                time_delta = 1

            current_mod_return = log(float(tomorrows_price)/float(todays_price))/sqrt(time_delta*trading_period) 
            daily = (current_mod_return - mean_mod_return)**2/(sample - 1)
            variance = variance + daily

            logger.verbose(f'{date}: (daily_variance, sample_variance) = ({round(daily, 4)}, {round(variance, 4)})')

        else:
            today = True

        tomorrows_price = prices[date][static.keys['PRICES']['CLOSE']]
        tomorrows_date = date

    # adjust for output
    volatility = sqrt(variance)
    # ito's lemma
    mean_return = mean_return + 0.5*(volatility**2)
    logger.debug(f'(mean_return, sample_volatility) = ({round(mean_return, 2)}, {round(volatility, 2)})')

    results = {
        'annual_return': mean_return,
        'annual_volatility': volatility
    }
    
    profile_cache.save_or_update_row(ticker=ticker, start_date=start_date, end_date=end_date, 
                                        method=static.keys['ESTIMATION']['MOMENT'],
                                        annual_return=results['annual_return'], 
                                        annual_volatility=results['annual_volatility'])
    # TODO: extra save_or_update argument for estimation method, i.e. moments, percentiles or likelihood
    
    return results

def calculate_correlation(ticker_1, ticker_2, asset_type_1=None, asset_type_2=None, start_date=None, end_date=None, sample_prices=None, method=settings.ESTIMATION_METHOD):
    if method == static.keys['ESTIMATION']['MOMENT']:
        return calculate_moment_correlation(ticker_1, ticker_2, asset_type_1, asset_type_2, start_date, end_date, sample_prices)
    elif method == static.keys['ESTIMATION']['LIKE']:
        return calculate_likelihood_correlation(ticker_1, ticker_2, asset_type_1, asset_type_2, start_date, end_date, sample_prices)
    raise errors.ConfigurationError('Statistic estimation method not found')

def calculate_percentile_correlation(ticker_1, ticker_2, asset_type_1=None, asset_type_2=None, start_date=None, end_date=None, sample_prices=None):
    """
    Returns the sample correlation calculated using the method of Percentile Matching, assuming underlying price process follows Geometric Brownian Motion, i.e. the price distribution is lognormal. 

    Parameters
    ----------
    1. *ticker_1* : ``str`` \n
        Ticker symbol for first asset. \n \n
    2. *ticker_2* : ``str`` \n 
        Ticker symbol for second asset \n \n
    3. *asset_type_1* : ``str`` \n
        **Optional**. Specify asset type to prevent overusing redundant calculations. Allowable values can be found in `scrilla.static.keys['ASSETS]' dictionary. \n \n
    4. *asset_type_2* : ``str`` \n
        **Optional**. Specify asset type to prevent overusing redundant calculations. Allowable values can be found in `scrilla.static.keys['ASSETS]' dictionary. \n \n 
    5. *start_date* : ``datetime.date`` \n 
        **Optional**. Start date of the time period over which correlation will be calculated. If `None`, defaults to 100 trading days ago. \n \n 
    6. *end_date* : ``datetime.date`` \n 
        **Optional**. End date of the time period over which correlation will be calculated. If `None`, defaults to last trading day. \n \n  
    7. *sample_prices* : ``dict``
        **Optional**. A list of the asset prices for which correlation will be calculated. Overrides calls to service and calculates correlation for sample of prices supplied. Will disregard start_date and end_date. Must be of the format: {'AAPL': { 'date_1' : 'price_1', 'date_2': 'price_2' ...}, 'BX': { 'date_1' : 'price_1:, ... } } and ordered from latest date to earliest date.  \n \n
    
    Raises
    ------
    1. *errors.InputValidationError*
    2. *errors.SampleSizeError*
    3. *errors.PriceError*

    Returns
    ------
    ``dict`` \n
    ``{ 'correlation' : float }``\n\n
    """
    pass

def calculate_likelihood_correlation(ticker_1, ticker_2, asset_type_1=None, asset_type_2=None, start_date=None, end_date=None, sample_prices=None):
    """
    Calculates the sample correlation using the maximum likelihood estimators, assuming underlying price process follows Geometric Brownian Motion, i.e. the price distribution is lognormal. 

    Parameters
    ----------
    1. *ticker_1* : ``str`` \n
        Ticker symbol for first asset. \n \n
    2. *ticker_2* : ``str`` \n 
        Ticker symbol for second asset \n \n
    3. *asset_type_1* : ``str`` \n
        **Optional**. Specify asset type to prevent overusing redundant calculations. Allowable values can be found in `scrilla.static.keys['ASSETS]' dictionary. \n \n
    4. *asset_type_2* : ``str`` \n
        **Optional**. Specify asset type to prevent overusing redundant calculations. Allowable values can be found in `scrilla.static.keys['ASSETS]' dictionary. \n \n 
    5. *start_date* : ``datetime.date`` \n 
        **Optional**. Start date of the time period over which correlation will be calculated. If `None`, defaults to 100 trading days ago. \n \n 
    6. *end_date* : ``datetime.date`` \n 
        **Optional**. End date of the time period over which correlation will be calculated. If `None`, defaults to last trading day. \n \n  
    7. *sample_prices* : ``dict``
        **Optional**. A list of the asset prices for which correlation will be calculated. Overrides calls to service and calculates correlation for sample of prices supplied. Will disregard start_date and end_date. Must be of the format: {'AAPL': { 'date_1' : 'price_1', 'date_2': 'price_2' ...}, 'BX': { 'date_1' : 'price_1:, ... } } and ordered from latest date to earliest date.  \n \n
    
    Raises
    ------
    1. *errors.InputValidationError*
    2. *errors.SampleSizeError*
    3. *errors.PriceError*

    Returns
    ------
    ``dict`` \n
    ``{ 'correlation' : float }``\n\n
    """
    ### START ARGUMENT PARSING ###
    try:
        asset_type_1 = errors.validate_asset_type(ticker=ticker_1, asset_type=asset_type_1)
        asset_type_2 = errors.validate_asset_type(ticker=ticker_2, asset_type=asset_type_2)
        if asset_type_1 == static.keys['ASSETS']['CRYPTO'] and asset_type_2 == static.keys['ASSETS']['CRYPTO']:
            # validate over all days
            start_date, end_date = errors.validate_dates(start_date=start_date, end_date=end_date,
                                                            asset_type=static.keys['ASSETS']['CRYPTO'])
        else:
            #   validate over trading days. since (date - 100 days) > (date - 100 trading days), always
            #   take the largest sample so intersect_dict_keys will return a sample of the correct size
            #   for mixed asset types.
            start_date, end_date = errors.validate_dates(start_date=start_date, end_date=end_date,
                                                                asset_type=static.keys['ASSETS']['EQUITY'])
    except errors.InputValidationError as ive:
        raise ive

    if sample_prices is None:
        # TODO: extra save_or_update argument for estimation method, i.e. moments, percentiles or likelihood
        correlation = correlation_cache.filter_correlation_cache(ticker_1=ticker_1, ticker_2=ticker_2,
                                                                    start_date=start_date, end_date=end_date,
                                                                    method=static.keys['ESTIMATION']['LIKE'])
        if correlation is not None:
            return correlation

        sample_prices = {}
        logger.debug(f'No sample prices provided or cached ({ticker_1}, {ticker_2}) correlation found.')
        logger.debug('Retrieving price histories for calculation.')
        try: 
            sample_prices[ticker_1] = services.get_daily_price_history(ticker=ticker_1, start_date=start_date, 
                                                                        end_date=end_date, asset_type=asset_type_1)
            sample_prices[ticker_2] = services.get_daily_price_history(ticker=ticker_2, start_date=start_date, 
                                                                        end_date=end_date, asset_type=asset_type_2)
        except errors.APIResponseError as api:
            raise api
        
    if asset_type_1 != asset_type_2:
        # remove weekends and holidays from crypto prices so samples can be compared
            # NOTE: data is lost here.
        sample_prices[ticker_1], sample_prices[ticker_2] = helper.intersect_dict_keys(sample_prices[ticker_1], sample_prices[ticker_2])

    if 0 in [len(sample_prices[ticker_1]), len(sample_prices[ticker_2])]:
        raise errors.PriceError("Prices cannot be retrieved for correlation calculation")

    if asset_type_1 == asset_type_2 and asset_type_1 == static.keys['ASSETS']['CRYPTO']:
        trading_period = static.constants['ONE_TRADING_DAY']['CRYPTO']
    else:
        trading_period = static.constants['ONE_TRADING_DAY']['EQUITY']
    
    sample_of_returns_1 = get_sample_of_returns(prices=sample_prices[ticker_1], asset_type=asset_type_1, trading_period=trading_period)
    sample_of_returns_2 = get_sample_of_returns(prices=sample_prices[ticker_2], asset_type=asset_type_2, trading_period=trading_period)
    
    combined_sample = [ [sample_of_returns_1[i], sample_of_returns_2[i]] for i, el in enumerate(sample_of_returns_1)]

    likelihood_estimates = optimizer.maximize_multivariate_normal_likelihood(data=combined_sample)

    vol_1 = likelihood_estimates[2]*sqrt(trading_period)
    vol_2 = likelihood_estimates[3]*sqrt(trading_period)

    correlation = likelihood_estimates[4] / (vol_1*vol_2)

    result = { 'correlation' : correlation }

    correlation_cache.save_row(ticker_1=ticker_1, ticker_2=ticker_2, 
                                start_date=start_date, end_date=end_date, 
                                correlation = correlation, method=static.keys['ESTIMATION']['LIKE'])
    return result

def calculate_moment_correlation(ticker_1, ticker_2, asset_type_1=None, asset_type_2=None, start_date=None, end_date=None, sample_prices=None):
    """
    Returns the sample correlation using the method of Moment Matching, assuming underlying price process follows Geometric Brownian Motion, i.e. the price distribution is lognormal. 

    Parameters
    ----------
    1. *ticker_1* : ``str`` \n
        Ticker symbol for first asset. \n \n
    2. *ticker_2* : ``str`` \n 
        Ticker symbol for second asset \n \n
    3. *asset_type_1* : ``str`` \n
        **Optional**. Specify asset type to prevent overusing redundant calculations. Allowable values can be found in `scrilla.static.keys['ASSETS]' dictionary. \n \n
    4. *asset_type_2* : ``str`` \n
        **Optional**. Specify asset type to prevent overusing redundant calculations. Allowable values can be found in `scrilla.static.keys['ASSETS]' dictionary. \n \n 
    5. *start_date* : ``datetime.date`` \n 
        **Optional**. Start date of the time period over which correlation will be calculated. If `None`, defaults to 100 trading days ago. \n \n 
    6. *end_date* : ``datetime.date`` \n 
        **Optional**. End date of the time period over which correlation will be calculated. If `None`, defaults to last trading day. \n \n  
    7. *sample_prices* : ``dict``
        **Optional**. A list of the asset prices for which correlation will be calculated. Overrides calls to service and calculates correlation for sample of prices supplied. Will disregard start_date and end_date. Must be of the format: {'AAPL': { 'date_1' : 'price_1', 'date_2': 'price_2' ...}, 'BX': { 'date_1' : 'price_1:, ... } } and ordered from latest date to earliest date.  \n \n
    
    Raises
    ------
    1. *errors.InputValidationError*
    2. *errors.SampleSizeError*
    3. *errors.PriceError*

    Returns
    ------
    ``dict`` \n
    ``{ 'correlation' : float }``\n\n
    """
    ### START ARGUMENT PARSING ###
    try:
        asset_type_1 = errors.validate_asset_type(ticker=ticker_1, asset_type=asset_type_1)
        asset_type_2 = errors.validate_asset_type(ticker=ticker_2, asset_type=asset_type_2)
        if asset_type_1 == static.keys['ASSETS']['CRYPTO'] and asset_type_2 == static.keys['ASSETS']['CRYPTO']:
            # validate over all days
            start_date, end_date = errors.validate_dates(start_date=start_date, end_date=end_date,
                                                            asset_type=static.keys['ASSETS']['CRYPTO'])
        else:
            #   validate over trading days. since (date - 100 days) > (date - 100 trading days), always
            #   take the largest sample so intersect_dict_keys will return a sample of the correct size
            #   for mixed asset types.
            start_date, end_date = errors.validate_dates(start_date=start_date, end_date=end_date,
                                                                asset_type=static.keys['ASSETS']['EQUITY'])
    except errors.InputValidationError as ive:
        raise ive

    if sample_prices is None:
        correlation = correlation_cache.filter_correlation_cache(ticker_1=ticker_1, ticker_2=ticker_2,
                                                                    start_date=start_date, end_date=end_date,
                                                                    method=static.keys['ESTIMATION']['MOMENT'])
        if correlation is not None:
            return correlation

        sample_prices = {}
        logger.debug(f'No sample prices provided or cached ({ticker_1}, {ticker_2}) correlation found.')
        logger.debug('Retrieving price histories for calculation.')
        try: 
            sample_prices[ticker_1] = services.get_daily_price_history(ticker=ticker_1, start_date=start_date, 
                                                                        end_date=end_date, asset_type=asset_type_1)
            sample_prices[ticker_2] = services.get_daily_price_history(ticker=ticker_2, start_date=start_date, 
                                                                        end_date=end_date, asset_type=asset_type_2)
        except errors.APIResponseError as api:
            raise api
        
    if asset_type_1 != asset_type_2:
        # remove weekends and holidays from crypto prices so samples can be compared
            # NOTE: data is lost here.
        sample_prices[ticker_1], sample_prices[ticker_2] = helper.intersect_dict_keys(sample_prices[ticker_1], sample_prices[ticker_2])

    if 0 in [len(sample_prices[ticker_1]), len(sample_prices[ticker_2])]:
        raise errors.PriceError("Prices cannot be retrieved for correlation calculation")

    if asset_type_1 == asset_type_2 and asset_type_1 == static.keys['ASSETS']['CRYPTO']:
        trading_period = static.constants['ONE_TRADING_DAY']['CRYPTO']
    else:
        trading_period = static.constants['ONE_TRADING_DAY']['EQUITY']
    ### END ARGUMENT PARSING ###

    ### START SAMPLE STATISTICS CALCULATION DEPENDENCIES ###
        ### i.e. statistics that need to be calculated before correlation can be calculated
    logger.debug(f'Preparing calculation dependencies for ({ticker_1},{ticker_2}) correlation')
    try:
        stats_1 = calculate_moment_risk_return(ticker=ticker_1, start_date=start_date, end_date=end_date, 
                                        sample_prices=sample_prices[ticker_1], asset_type=asset_type_1)
        stats_2 = calculate_moment_risk_return(ticker=ticker_2, start_date=start_date, end_date=end_date, 
                                        sample_prices=sample_prices[ticker_2], asset_type=asset_type_2)
    except errors.SampleSizeError as se:
        raise errors.SampleSizeError(se)
    except errors.PriceError as pe:
        raise errors.PriceError(pe)
        
    # ito's lemma
        # note: can't use trading_period to condense this conditional because the mod_mean_i's need 
        #       to be scaled to the correlation calculation differently based on the asset type. 
    if asset_type_1 == static.keys['ASSETS']['EQUITY']:
        mod_mean_1 = (stats_1['annual_return'] - 0.5*(stats_1['annual_volatility'])**2)*sqrt(static.constants['ONE_TRADING_DAY']['EQUITY'])
    elif asset_type_1 == static.keys['ASSETS']['CRYPTO']:
        mod_mean_1 = (stats_1['annual_return'] - 0.5*(stats_1['annual_volatility'])**2)*sqrt(static.constants['ONE_TRADING_DAY']['CRYPTO'])

    if asset_type_2 == static.keys['ASSETS']['EQUITY']:
        mod_mean_2 = (stats_2['annual_return'] - 0.5*(stats_2['annual_volatility'])**2)*sqrt(static.constants['ONE_TRADING_DAY']['EQUITY'])
    elif asset_type_2 == static.keys['ASSETS']['CRYPTO']:
        mod_mean_2 = (stats_2['annual_return'] - 0.5*(stats_2['annual_volatility'])**2)*sqrt(static.constants['ONE_TRADING_DAY']['CRYPTO'])
    
    logger.debug(f'Calculating ({ticker_1}, {ticker_2}) correlation.')
    ### END SAMPLE STATISTICS CALCULATION DEPENDENCIES

    # Initialize loop variables
    i, covariance, time_delta = 0, 0, 1
    today, tomorrows_date = False, None
    sample = len(sample_prices[ticker_1])

    #### START CORRELATION LOOP ####
    for date in sample_prices[ticker_1]:
        todays_price_1 = sample_prices[ticker_1][date][static.keys['PRICES']['CLOSE']]
        todays_price_2 = sample_prices[ticker_2][date][static.keys['PRICES']['CLOSE']]
        logger.verbose(f'(todays_date, todays_price_{ticker_1}, todays_price_{ticker_2}) = ({date}, {todays_price_1}, {todays_price_2})')
            
        if today:
            logger.verbose(f'Iteration #{i}')
            logger.verbose(f'(todays_price, tomorrows_price)_{ticker_1} = ({todays_price_1}, {tomorrows_price_1})')
            logger.verbose(f'(todays_price, tomorrows_price)_{ticker_2} = ({todays_price_2}, {tomorrows_price_2})')

            # NOTE: crypto prices may have weekends and holidays removed during correlation algorithm 
            # so samples can be compared to equities, need to account for these dates by increasing
            # the time_delta by the number of missed days, to offset the weekend and holiday return.
            if asset_type_1 == static.keys['ASSETS']['CRYPTO'] or \
                (asset_type_1 == static.keys['ASSETS']['EQUITY'] and not helper.consecutive_trading_days(tomorrows_date, date)):
                time_delta = (helper.parse_date_string(tomorrows_date) - helper.parse_date_string(date)).days 
            else:
                time_delta = 1

            current_mod_return_1= log(float(tomorrows_price_1)/float(todays_price_1))/sqrt(time_delta*trading_period)

            # see above note
            if asset_type_2 == static.keys['ASSETS']['CRYPTO'] or \
                (asset_type_2 == static.keys['ASSETS']['EQUITY'] and not helper.consecutive_trading_days(tomorrows_date, date)):
                time_delta = (helper.parse_date_string(tomorrows_date) - helper.parse_date_string(date)).days 
            else:
                time_delta = 1

            current_mod_return_2= log(float(tomorrows_price_2)/float(todays_price_2))/sqrt(time_delta*trading_period)

            current_sample_covariance = (current_mod_return_1 - mod_mean_1)*(current_mod_return_2 - mod_mean_2)/(sample - 1)
            covariance = covariance + current_sample_covariance
        
            logger.verbose(f'(return_1, return_2) = ({round(current_mod_return_1, 2)}, {round(current_mod_return_2, 2)})')
            logger.verbose(f'(current_sample_covariance, covariance) = ({round(current_sample_covariance, 2)}, {round(covariance, 2)})')
                
        else:
            today = True
        
        i += 1
        tomorrows_price_1, tomorrows_price_2, tomorrows_date = todays_price_1, todays_price_2, date
    #### END CORRELATION LOOP ####

    # Scale covariance into correlation
    correlation = covariance/(stats_1['annual_volatility']*stats_2['annual_volatility'])

    logger.debug(f'correlation = ({round(correlation, 2)})')

    result = { 'correlation' : correlation }

    correlation_cache.save_row(ticker_1=ticker_1, ticker_2=ticker_2, 
                                start_date=start_date, end_date=end_date, 
                                correlation = correlation, method=static.keys['ESTIMATION']['MOMENT'])
    return result

def correlation_matrix(tickers, asset_types=None, start_date=None, end_date=None, sample_prices=None, method=settings.ESTIMATION_METHOD):
    correlation_matrix = [[0 for x in range(len(tickers))] for y in range(len(tickers))]

    # let correlation function handle argument parsing
    if asset_types is None:
        asset_types = []
        for ticker in tickers:
            asset_types.append(None)

    if(len(tickers) > 1):
        for i, item in enumerate(tickers):
            correlation_matrix[i][i] = 1
            for j in range(i+1, len(tickers)):
                cor = calculate_correlation(ticker_1 = item, 
                                                ticker_2=tickers[j],
                                                asset_type_1=asset_types[i], 
                                                asset_type_2=asset_types[j],
                                                start_date = start_date, 
                                                end_date = end_date,
                                                sample_prices = sample_prices, 
                                                method=method)
                correlation_matrix[i][j] = cor['correlation']
                correlation_matrix[j][i] = correlation_matrix[i][j]

        correlation_matrix[len(tickers) - 1][len(tickers) - 1] = 1
        return correlation_matrix
    if (len(tickers)==1):
        correlation_matrix[0][0]=1
        return correlation_matrix
    raise errors.SampleSizeError('Cannot calculate correlation matrix for portfolio size <= 1.')

def calculate_moment_correlation_series(ticker_1, ticker_2, start_date=None, end_date=None):
    asset_type_1 = files.get_asset_type(ticker_1)
    asset_type_2 = files.get_asset_type(ticker_2)
    same_type = False
    correlation_series={}

    if asset_type_1 == asset_type_2:
        same_type = True
    
    # TODO: what if start_date or end_date is None?
    if same_type:
        if asset_type_1 == static.keys['ASSETS']['EQUITY']:
            date_range = [helper.get_previous_business_date(start_date)] + helper.business_dates_between(start_date,end_date)
        elif asset_type_1 == static.keys['ASSETS']['CRYPTO']:
            date_range = [start_date] + helper.dates_between(start_date, end_date)
    else: # default to business days
        date_range = [helper.get_previous_business_date(start_date)] + helper.business_dates_between(start_date,end_date)

    for date in date_range:
        calc_date_end = date
        
        if same_type and asset_type_1 == static.keys['ASSETS']['EQUITY']:
            calc_date_start = helper.decrement_date_by_business_days(start_date=date, 
                                                                        business_days=settings.DEFAULT_ANALYSIS_PERIOD)
        elif same_type and asset_type_1 == static.keys['ASSETS']['CRYPTO']:
            calc_date_start = helper.decrement_date_by_days(start_date=date, days=settings.DEFAULT_ANALYSIS_PERIOD)

        todays_cor = calculate_moment_correlation(ticker_1, ticker_2, start_date=calc_date_start, end_date=calc_date_end)
        correlation_series[date] = todays_cor['correlation']
    
    result = {}
    result[f'{ticker_1}_{ticker_2}_correlation_time_series'] = correlation_series

def calculate_return_covariance(ticker_1, ticker_2, start_date=None, end_date=None, sample_prices=None, 
                                correlation=None, profile_1=None, profile_2=None):
    try:
        if correlation is None:
            if sample_prices is None:
                correlation = calculate_moment_correlation(ticker_1=ticker_1, ticker_2=ticker_2, start_date=start_date, 
                                                    end_date=end_date)
            else:
                correlation = calculate_moment_correlation(ticker_1=ticker_1, ticker_2=ticker_2, sample_prices=sample_prices)

        if profile_1 is None:
            if sample_prices is None:
                profile_1 = calculate_moment_risk_return(ticker=ticker_1, start_date=start_date, end_date=end_date)
            else:
                profile_1 = calculate_moment_risk_return(ticker=ticker_1, sample_prices=sample_prices[ticker_1])

        if profile_2 is None:
            if sample_prices is None:
                profile_2 = calculate_moment_risk_return(ticker=ticker_2, start_date=start_date, end_date=end_date)
            else:
                profile_2 = calculate_moment_risk_return(ticker=ticker_2,sample_prices=sample_prices[ticker_2])
    except errors.SampleSizeError as sse:
        raise sse
    except errors.PriceError as pe:
        raise pe
    except errors.InputValidationError as ive:
        raise ive
    except errors.APIResponseError as api:
        raise api


    covariance = profile_1['annual_volatility']*profile_2['annual_volatility']*correlation['correlation']
    return covariance