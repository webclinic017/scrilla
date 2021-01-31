import os, sys, math, json
import datetime
import numpy
from decimal import Decimal

import app.settings as settings
import app.services as services
import app.markets as markets

import util.logger as logger
import util.formatting as formatter
import util.helper as helper

output = logger.Logger('app.statistics')

# NOTE: assumes price history returns from latest to earliest date.
# NOTE: If no start_date and end_date passed in, static snapshot of moving averages,
#       i.e. the moving averages as of today (or last close), are calculated and 
#       returned.
def calculate_moving_averages(tickers, start_date=None, end_date=None):
    moving_averages = []

    if start_date is None and end_date is None:
        for ticker in tickers:
            output.verbose(f'Calculating Moving Average For {ticker}')

            prices = services.retrieve_prices_from_cache(ticker, start_date, end_date)
            asset_type = markets.get_asset_type(ticker)
            trading_period = markets.get_trading_period(asset_type)

            today = False
            count, tomorrows_price, MA_1, MA_2, MA_3 = 1, 0, 0, 0, 0
    
            for date in prices:
                todays_price = services.parse_price_from_date(prices, date, asset_type)
                if today:
                    todays_return = numpy.log(float(tomorrows_price) / float(todays_price))/trading_period
                    
                    if count < settings.MA_1_PERIOD:
                        MA_1 += todays_return / settings.MA_1_PERIOD
                        
                    if count < settings.MA_2_PERIOD:
                        MA_2 += todays_return / settings.MA_2_PERIOD

                    if count < settings.MA_3_PERIOD:
                        MA_3 += todays_return / settings.MA_3_PERIOD  
                        count += 1

                else:
                    today = True

                tomorrows_price = services.parse_price_from_date(prices, date, asset_type)

            output.verbose(f'(MA_1, MA_2, MA_3)_{ticker} = ({MA_1}, {MA_2}, {MA_3}')
            moving_averages.append([MA_1, MA_2, MA_3])

        return moving_averages, None

    else:
        # get period of time consistent with MA Periods
        day_count = (end_date - start_date).days
        for ticker in tickers:
            asset_type = markets.get_asset_type(ticker)
            trading_period = markets.get_trading_period(asset_type)

            if asset_type == settings.ASSET_CRYPTO:
                new_start_date = start_date - datetime.timedelta(days=settings.MA_3_PERIOD)

            # amend equity trading dates to take account of weekends
            elif asset_type == settings.ASSET_EQUITY:
                new_start_date = helper.decrement_date_by_business_days(days=settings.MA_3_PERIOD)

            else:
                new_start_date = start_date - datetime.timedelta(days=settings.MA_3_PERIOD)

            prices = services.retrieve_prices_from_cache(ticker, new_start_date, end_date)

            today = False
            count= 1
            tomorrows_price, MA_1, MA_2, MA_3
            MAs_1, MAs_2, MAs_3 = [], [], []

            # TODO: this is totally fucked. needs a redo.
            for date in prices:
                todays_price = services.parse_price_from_date(prices, date, asset_type)
                if today:
                   todays_return = numpy.log(float(tomorrows_price) / float(todays_price))/trading_period
               
                   for MA in MAs_1:
                       if len(MAs_1) - MAs_1.index(MA) + 1 < settings.MA_1_PERIOD:
                           MA += todays_return / settings.MA_1_PERIOD
                   MA_1.append( (todays_return / settings.MA_1_PERIOD) )
         
                   for MA in MA_2:
                       if len(MA_2) - MA_2.index(MA) + 1 < settings.MA_2_PERIOD:
                           MA += todays_return / settings.MA_2_PERIOD
                   MA_2.append( (todays_return / settings.MA_2_PERIOD) )
        
                   for MA in MA_3:
                       if len(MA_3) - MA_3.index(MA) + 1 < settings.MA_3_PERIOD:
                           MA += todays_return / settings.MA_3_PERIOD
                   MA_3.append( (todays_return) / settings.MA_3_PERIOD)
                
                else:
                    today = True
                    tomorrows_price = services.parse_price_from_date(prices, date, asset_type)

            MA_1 = MA_1[:day_count]
            MA_2 = MA_2[:day_count]
            MA_3 = MA_3[:day_count]

            moving_averages.append([MA_1, MA_2, MA_3])

        dates_between = helper.dates_between(start_date, end_date)
        # len(moving_averages[0]) == len(dates_between) 
        #       if everything has been done correctly, that is!
        print('len(moving_averages[0]) =', len(moving_averages[0]))
        print('len(dates_between) = ', len(dates_between))
        return moving_averages, dates_between 

# NOTE: assumes price history returns from latest to earliest date.
def calculate_risk_return(ticker, start_date=None, end_date=None):
    asset_type = markets.get_asset_type(ticker)
    trading_period = markets.get_trading_period(asset_type)

    if not trading_period:
        output.debug("Asset did not map to (crypto, equity) grouping")
        return False

    if start_date is None and end_date is None:
        now = datetime.datetime.now()
        timestamp = '{}{}{}'.format(now.month, now.day, now.year)
        buffer_store= os.path.join(settings.CACHE_DIR, f'{timestamp}_{ticker}_{settings.CACHE_STAT_KEY}.{settings.CACHE_EXT}')

        if os.path.isfile(buffer_store):
            output.debug(f'Loading in cached {ticker} statistics...')
            with open(buffer_store, 'r') as infile:
                results = json.load(infile)
            return results

    
    prices = services.retrieve_prices_from_cache(ticker, start_date, end_date)
    if not prices:
        output.debug(f'No prices could be retrieved for {ticker}')
        return False
    
    sample = len(prices)

    # calculate sample mean annual return
    i, mean_return, tomorrows_price = 0, 0, 0 
    output.debug(f'Calculating mean annual return over last {sample} days for {ticker}')

    for date in prices:
        todays_price = services.parse_price_from_date(prices, date, asset_type)

        if i != 0:
            output.verbose(f'{date}: (todays_price, tomorrows_price) = ({todays_price}, {tomorrows_price})')
            daily_return = numpy.log(float(tomorrows_price)/float(todays_price))/trading_period
            mean_return = mean_return + daily_return/sample
            output.verbose(f'{date}: (daily_return, mean_return) = ({round(daily_return, 2)}, {round(mean_return, 2)})')

        else:
            output.verbose('Skipping first date.')
            i += 1  

        tomorrows_price = services.parse_price_from_date(prices, date, asset_type)
        
    # calculate sample annual volatility
    i, variance, tomorrows_price = 0, 0, 0
    mean_mod_return = mean_return*numpy.sqrt(trading_period)
    output.debug(f'Calculating mean annual volatility over last {sample} days for {ticker}')

    for date in prices:
        todays_price = services.parse_price_from_date(prices, date, asset_type)

        if i != 0:
            output.verbose(f'{date}: (todays_price, tomorrows_price) = ({todays_price}, {tomorrows_price})')
            current_mod_return= numpy.log(float(tomorrows_price)/float(todays_price))/numpy.sqrt(trading_period) 
            variance = variance + (current_mod_return - mean_mod_return)**2/(sample - 1)
            output.verbose(f'{date}: (daily_variance, sample_variance) = ({round(current_mod_return, 2)}, {round(variance, 2)})')

        else:
            i += 1

        tomorrows_price = services.parse_price_from_date(prices, date, asset_type)

    # adjust for output
    volatility = numpy.sqrt(variance)
    # ito's lemma
    mean_return = mean_return + 0.5*(volatility**2)
    output.debug(f'(mean_return, sample_volatility) = ({round(mean_return, 2)}, {round(volatility, 2)})')

    results = {
        'annual_return': mean_return,
        'annual_volatility': volatility
    }

    # store results in buffer for quick access
    if start_date is None and end_date is None:
        output.debug(f'Storing {ticker} statistics in cache...')
        with open(buffer_store, 'w') as outfile:
            json.dump(results, outfile)

    return results

# NOTE: assumes price history returns from latest to earliest date.
# NOTE: does not cache correlation if start_date and end_date are specified, 
#       i.e. only caches current correlation from the last 100 days.
def calculate_correlation(ticker_1, ticker_2, start_date=None, end_date=None):
    now = datetime.datetime.now()
    timestamp = '{}{}{}'.format(now.month, now.day, now.year)
    buffer_store_1= os.path.join(settings.CACHE_DIR, f'{timestamp}_{ticker_1}_{ticker_2}_correlation.json')
    buffer_store_2= os.path.join(settings.CACHE_DIR, f'{timestamp}_{ticker_2}_{ticker_1}_correlation.json')

    if start_date is None and end_date is None:
        # check if results exist in cache location 1
        if os.path.isfile(buffer_store_1):
            output.debug(f'Loading in cached ({ticker_1}, {ticker_2}) correlation...')
            with open(buffer_store_1, 'r') as infile:
                results = json.load(infile)
                correlation = results
            return correlation

        # check if results exist in cache location 2
        elif os.path.isfile(buffer_store_2):
            output.debug(f'Loading in cached ({ticker_1}, {ticker_2}) correlation...')
            with open(buffer_store_2, 'r') as infile:
                results = json.load(infile)
                correlation = results
            return correlation

    # calculate results from sample
    output.debug(f'Preparing to calculate correlation for ({ticker_1},{ticker_2})')
    prices_1 = services.retrieve_prices_from_cache(ticker_1, start_date, end_date)
    prices_2 = services.retrieve_prices_from_cache(ticker_2, start_date, end_date)

    if (not prices_1) or (not prices_2):
        output.debug("Prices cannot be retrieved for correlation calculation")
        return False 
    
    stats_1 = calculate_risk_return(ticker_1, start_date, end_date)
    stats_2 = calculate_risk_return(ticker_2, start_date, end_date)

    if (not stats_1) or (not stats_2):
        output.debug("Sample statistics cannot be calculated for correlation calculation")
        return False

    asset_type_1 = markets.get_asset_type(ticker_1)
    asset_type_2 = markets.get_asset_type(ticker_2)
    
    # ito's lemma
    if asset_type_1 == settings.ASSET_EQUITY:
        mod_mean_1 = (stats_1['annual_return'] - 0.5*(stats_1['annual_volatility'])**2)*numpy.sqrt(settings.ONE_TRADING_DAY)
    elif asset_type_1 == settings.ASSET_CRYPTO:
        mod_mean_1 = (stats_1['annual_return'] - 0.5*(stats_1['annual_volatility'])**2)*numpy.sqrt((1/365))

    if asset_type_2 == settings.ASSET_EQUITY:
        mod_mean_2 = (stats_2['annual_return'] - 0.5*(stats_2['annual_volatility'])**2)*numpy.sqrt(settings.ONE_TRADING_DAY)
    elif asset_type_2 == settings.ASSET_CRYPTO:
        mod_mean_2 = (stats_2['annual_return'] - 0.5*(stats_2['annual_volatility'])**2)*numpy.sqrt((1/365))

    weekend_offset_1, weekend_offset_2 = 0, 0

    # if asset_types are same
    if asset_type_1 == asset_type_2:
        same_type = True
        output.debug(f'Asset({ticker_1}) and Asset({ticker_2}) are the same type of asset')

        if asset_type_1 == settings.ASSET_CRYPTO:
            trading_period = (1/365)
        elif asset_type_1 == settings.ASSET_EQUITY:
            trading_period = settings.ONE_TRADING_DAY
        else:
            trading_period = settings.ONE_TRADING_DAY


    # if asset_types are different, collect # of days where one assets trades and the other does not.
    else:
        same_type = False
        output.debug(f'Asset({ticker_1}) and Asset({ticker_2}) are not the same type of asset')

        if asset_type_1 == settings.ASSET_CRYPTO and asset_type_2 == settings.ASSET_EQUITY:
            for date in prices_1:
                if helper.is_date_string_weekend(date):
                    weekend_offset_1 += 1
            trading_period = settings.ONE_TRADING_DAY

        elif asset_type_1 == settings.ASSET_EQUITY and asset_type_2 == settings.ASSET_CRYPTO:
            for date in prices_2:
                if helper.is_date_string_weekend(date):
                    weekend_offset_1 += 1
            trading_period = settings.ONE_TRADING_DAY

    # make sure datasets are only compared over corresponding intervals, i.e.
    # always calculate correlation over smallest interval.
    if (len(prices_1) - weekend_offset_1) == (len(prices_2) - weekend_offset_2) \
        or (len(prices_1) - weekend_offset_1) < (len(prices_2) - weekend_offset_2):
        sample_prices = prices_1
        offset = weekend_offset_1
    else:
        sample_prices = prices_2
        offset = weekend_offset_2
    
    output.debug(f'(trading_period, offset) = ({trading_period}, {offset})')
    output.debug(f'Calculating ({ticker_1}, {ticker_2}) correlation...')

    # Initialize loop variables
    i, covariance, tomorrows_price_1, tomorrows_price_2 = 0, 0, 1, 1
    delta = 0
    tomorrows_date, todays_date = "", ""
    sample = len(sample_prices)

    #### START CORRELATION LOOP ####
    for date in sample_prices:
        todays_price_1 = services.parse_price_from_date(prices_1, date, asset_type_1)
        todays_price_2 = services.parse_price_from_date(prices_2, date, asset_type_2)
        todays_date = date
        output.verbose(f'(todays_date, todays_price_{ticker_1}, todays_price_{ticker_2}) = ({todays_date}, {todays_price_1}, {todays_price_2})')
            
        # if both prices exist, proceed
        if todays_price_1 and todays_price_2 and tomorrows_price_1 and tomorrows_price_2:
            if i != 0:
                output.verbose(f'Iteration #{i}')
                output.verbose(f'(todays_price, tomorrows_price)_{ticker_1} = ({todays_price_1}, {tomorrows_price_1})')
                output.verbose(f'(todays_price, tomorrows_price)_{ticker_2} = ({todays_price_2}, {tomorrows_price_2})')
                
                if delta != 0:
                    output.verbose(f'current delta = {delta}')

                time_delta = (1+delta)/numpy.sqrt(trading_period)
                current_mod_return_1= numpy.log(float(tomorrows_price_1)/float(todays_price_1))*time_delta
                current_mod_return_2= numpy.log(float(tomorrows_price_2)/float(todays_price_2))*time_delta
                current_sample_covariance = (current_mod_return_1 - mod_mean_1)*(current_mod_return_2 - mod_mean_2)/(sample - 1)
                covariance = covariance + current_sample_covariance
            
                output.verbose(f'(return_1, return_2) = ({round(current_mod_return_1, 2)}, {round(current_mod_return_2, 2)})')
                output.verbose(f'(current_sample_covariance, covariance) = ({round(current_sample_covariance, 2)}, {round(covariance, 2)})')
                
                # once missed data points are skipped, annihiliate delta
                if delta != 0:
                    delta = 0
                
            i += 1

        # if one price doesn't exist, then a data point has been lost, so revise sample. 
        # collect number of missed data points (delta) to offset return calculation
        else: 
            output.verbose('Lost a day. Revising covariance and sample...')
            revised_covariance = covariance*(sample - 1)
            sample -= 1 
            covariance = revised_covariance/(sample - 1)
            delta += 1
            if i == 0:
                i += 1
            output.verbose(f'(revised_covariance, revised_sample) = ({covariance}, {sample})')
        
        tomorrows_price_1 = services.parse_price_from_date(prices_1, date, asset_type_1)
        tomorrows_price_2 = services.parse_price_from_date(prices_2, date, asset_type_2)
        tomorrows_date = date
    #### END CORRELATION LOOP ####

    correlation = covariance/(stats_1['annual_volatility']*stats_2['annual_volatility'])

    result = { 'correlation' : correlation }

    if start_date is None and end_date is None:
        output.debug(f'Storing ({ticker_1}, {ticker_2}) correlation in cache...')
        with open(buffer_store_1, 'w') as outfile:
            json.dump(result, outfile)

    return result

def get_correlation_matrix_string(symbols, indent=0, start_date=None, end_date=None):
    entire_formatted_result, formatted_title = "", ""

    line_length, percent_length, first_symbol_length = 0, 0, 0
    new_line=""
    no_symbols = len(symbols)

    for i in range(no_symbols):
        this_symbol = symbols[i]
        symbol_string = ' '*indent + f'{this_symbol} '

        if i != 0:
            this_line = symbol_string + ' '*(line_length - len(symbol_string) - 7*(no_symbols - i))
            # NOTE: seven is number of chars in ' 100.0%'
        else: 
            this_line = symbol_string
            first_symbol_length = len(this_symbol)

        new_line = this_line
        
        for j in range(i, no_symbols):
            if j == i:
                new_line += " 100.0%"
            
            else:
                that_symbol = symbols[j]
                result = calculate_correlation(this_symbol, that_symbol, start_date, end_date) 
                if not result:
                    output.debug(f'Cannot correlation for ({this_symbol}, {that_symbol})')
                    return False
                formatted_result = str(100*result['correlation'])[:formatter.SIG_FIGS]
                new_line += f' {formatted_result}%'

        entire_formatted_result += new_line + '\n'
        
        if i == 0:
            line_length = len(new_line)

    formatted_title += ' '*(indent + first_symbol_length+1)
    for symbol in symbols:
        sym_len = len(symbol)
        formatted_title += f' {symbol}'+ ' '*(7-sym_len)
        # NOTE: seven is number of chars in ' 100.0%'
    formatted_title += '\n'

    whole_thing = formatted_title + entire_formatted_result
    return whole_thing