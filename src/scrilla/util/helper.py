import datetime, math, holidays

import dateutil.easter as easter

from scrilla import static
import scrilla.util.formatter as formatter

################################################
##### FORMATTING FUNCTIONS
def truncate(number, digits) -> float:
    stepper = 10.0 ** digits
    return math.trunc(stepper * number) / stepper

def get_number_input(msg_prompt) -> str:
    while True:
        user_input = input(msg_prompt)
        if user_input.isnumeric():
            return user_input
        print('Input Not Understood. Please Enter A Numerical Value.')
    
def strip_string_array(array) -> list:
    new_array = []
    for string in array:
        new_array.append(string.strip())
    return new_array

def round_array(array, decimals):
    cutoff = (1/10**decimals)
    return [0 if element < cutoff else truncate(element, decimals) for element in array]

def intersect_dict_keys(dict1, dict2):
    intersection = [x for x in dict1.keys() if x in dict2.keys()]

    new_dict1, new_dict2 = {}, {}
    for key, value in dict1.items():
        if key in intersection:
            new_dict1[key] = value
    for key, value in dict2.items():
        if key in intersection:
            new_dict2[key] = value
    
    return new_dict1, new_dict2

################################################
##### DATE FUNCTIONS

def get_today():
    return datetime.date.today()

def get_last_trading_date():
    today = datetime.datetime.now()
    if is_date_holiday(today) or is_date_weekend(today):
        today = get_previous_business_date(today)
    trading_close_today = today.replace(hour=20)
    if today > trading_close_today:
        return today.date()
    return get_previous_business_date(today.date())

def this_date_or_last_trading_date(date : datetime.date):
    if is_date_holiday(date) or is_date_weekend(date):
        date = get_previous_business_date(date)
    return date

def validate_date_string(parsed_date_string):
    length_check = (len(parsed_date_string) == 3 )
    year_check = (int(parsed_date_string[0]) > 1950)
    month_check = (int(parsed_date_string[1])>0 and int(parsed_date_string[1])<13)
    day_check = (int(parsed_date_string[2])>0 and int(parsed_date_string[2])<32)
    return (length_check and year_check and month_check and day_check)

def validate_order_of_dates(start_date, end_date):
    delta = (end_date - start_date).days
    if delta < 0:
        return end_date, start_date
    return start_date, end_date

# YYYY-MM-DD
def parse_date_string(date_string) -> datetime.date:
    parsed = str(date_string).split('-')
    if validate_date_string(parsed):
        date = datetime.date(year=int(parsed[0]), month=int(parsed[1]), day=int(parsed[2]))
        return date
    return False

def verify_date_types(dates):
    verified_dates = []
    for date in dates:
        if isinstance(date, str):
            verified_dates.append(parse_date_string(date))
        elif isinstance(date, datetime.date):
            verified_dates.append(date)
        else:
            return None
    return verified_dates

def date_to_string(date) -> str:
    month, day = date.month, date.day
    if month<10:
        month_string = "0"+str(month)
    else:
        month_string = str(month)
    if day<10:
        day_string = "0"+str(day)
    else:
        day_string = str(day)
    return f'{date.year}-{month_string}-{day_string}'

def format_date_range(start_date, end_date):
    result = ""
    if start_date is not None:
        start_string = date_to_string(start_date)
        result += f'From {start_string}'
    if end_date is not None:
        end_string = date_to_string(end_date)
        result += f' Until {end_string}'
    return result

def is_date_today(date) -> bool:
    return (date == datetime.date.today())

def is_date_string_today(date) -> bool:
    return is_date_today(parse_date_string(date))

def is_date_weekend(date) -> bool:
    return date.weekday() in [5, 6]

# YYYY-MM-DD
def is_date_string_weekend(date_string) -> bool:
    return is_date_weekend(parse_date_string(date_string))

# YYYY-MM-DD
def is_date_holiday(date : datetime.date) -> bool:
    us_holidays = holidays.UnitedStates(years=date.year)
    # generate list without columbus day since markets are open on columbus day
    custom_holidays = [ date for date in us_holidays if us_holidays[date] != "Columbus Day" ]
    # add good friday to list since markets are closed on good friday
    custom_holidays.append(easter.easter(year=date.year) - datetime.timedelta(days=2))

    return (date in custom_holidays)

def is_date_string_holiday(date_string) -> bool:
    return is_date_holiday(parse_date_string(date_string))

def is_trading_date(date):
    return not is_date_weekend(date) and not is_date_holiday(date)

# YYYY-MM-DD
def get_holidays_between(start_date_string, end_date_string) -> int:
    us_holidays = holidays.UnitedStates()
    return len(us_holidays[start_date_string: end_date_string])

# YYYY-MM-DD
def consecutive_trading_days(start_date_string, end_date_string) -> bool:
    """
    Parameters
    ----------
    start_date_string : str
        Required. The start date of the time period under consideration. Must be formatted "YYYY-MM-DD"
    end_date_string : str
        Required. The end date of the time period under consideration. Must be formatted "YYYY-MM-DD"
    
    Returns 
    -------
    True
        if start_date_string and end_date_string are consecutive trading days, i.e. Tuesday -> Wednesday or Friday -> Monday,
        or Tuesday -> Thursday where Wednesday is a Holiday.
    False
        if start_date_string and end_date_string are NOT consecutive trading days.
    """
    if is_date_string_weekend(start_date_string) or is_date_string_weekend(end_date_string):
        return False

    start_date = parse_date_string(start_date_string)
    end_date = parse_date_string(end_date_string)
    delta = end_date - start_date

    if delta.days < 0:
        start_date, end_date = end_date, start_date
        delta = end_date - start_date

    holiday_count = get_holidays_between(start_date_string=start_date_string, end_date_string=end_date_string)

    if (delta.days - holiday_count) == 0:
        return False

    if (delta.days - holiday_count) == 1:
        return True

    if ((delta.days - holiday_count) > 1 and (delta.days - holiday_count) < 4):
        start_week, end_week = start_date.isocalendar()[1], end_date.isocalendar()[1]

        if start_week == end_week:
            return False

        return True

    return False

def dates_between(start_date, end_date):
    return [start_date + datetime.timedelta(x + 1) for x in range((end_date - start_date).days)]

def days_between(start_date, end_date):
    return (end_date - start_date).days

# excludes start_date
def business_dates_between(start_date, end_date):
    new_start, new_end = validate_order_of_dates(start_date, end_date)
    dates = []
    for x in range((new_end - new_start).days):
        this_date = new_start + datetime.timedelta(x+1)
        if not (is_date_weekend(this_date) or is_date_holiday(this_date)):
            dates.append(this_date)
    return dates

def business_days_between(start_date, end_date):
    new_start, new_end = validate_order_of_dates(start_date, end_date)
    dates = dates_between(new_start, new_end)
    return len([1 for date in dates if not (is_date_weekend(date) or is_date_holiday(date))])

def weekends_between(start_date, end_date):
    start_date, end_date = verify_date_types(dates=[start_date, end_date])
    new_start, new_end = validate_order_of_dates(start_date, end_date)
    dates = dates_between(new_start, new_end)
    return len([1 for day in dates if day.weekday() > 4])

def decrement_date_by_days(start_date, days):
    while days > 0:
        days -= 1
        start_date -= datetime.timedelta(days=1)
    return start_date

def decrement_date_by_business_days(start_date, business_days):
    days_to_subtract = business_days
    first_pass=True
    while days_to_subtract > 0:
        if not (is_date_weekend(start_date) or is_date_holiday(start_date)):
            if first_pass:
                first_pass = False
            else:
                days_to_subtract -= 1
                
        if days_to_subtract > 0:
            start_date -= datetime.timedelta(days=1)
            
    return start_date

def decrement_date_string_by_business_days(start_date_string, business_days):
    start_date = parse_date_string(start_date_string)
    return date_to_string(decrement_date_by_business_days(start_date, business_days))

def increment_date_by_business_days(start_date, business_days):
    days_to_add = business_days
    while days_to_add > 0:
        if not (is_date_weekend(start_date) or is_date_holiday(start_date)):
            days_to_add -= 1
        start_date += datetime.timedelta(days=1)
    return start_date

def increment_date_string_by_business_days(start_date_string, business_days):
    start_date = parse_date_string(start_date_string)
    return date_to_string(increment_date_by_business_days(start_date, business_days))

def get_next_business_date(date):
    while is_date_weekend(date) or is_date_holiday(date):
        date += datetime.timedelta(days=1)
    return date

def get_previous_business_date(date):
    date = decrement_date_by_days(start_date=date, days=1)
    while is_date_weekend(date) or is_date_holiday(date):
        date -= datetime.timedelta(days=1)
    return date

# in years
def get_time_to_next_month():
    today = datetime.date.today()
    next_month=datetime.date(year=today.year, month=(today.month+1), day=1)
    return ((next_month - today).days / 365)

def get_time_to_next_year():
    today = datetime.date.today()
    next_year=datetime.datetime(year=today.year+1, day=1, month=1)
    return ((next_year - today).days / 365)
# in years
# 365 or 252? 
def get_time_to_next_quarter():
    today = datetime.date.today()

    first_q = datetime.date(year=today.year, month=1, day=1)
    second_q = datetime.date(year=today.year, month=4, day=1)
    third_q = datetime.date(year=today.year, month=7, day=1)
    fourth_q = datetime.date(year=today.year, month=10, day=1)
    next_first_q = datetime.date(year=(today.year+1), month=1, day=1)

    first_delta = (first_q - today).days / 365
    second_delta = (second_q - today).days / 365
    third_delta = (third_q - today).days / 365
    fourth_delta = (fourth_q - today).days /365
    next_delta = (next_first_q - today).days / 365 

    return min(i for i in [first_delta, second_delta, third_delta, fourth_delta, next_delta] if i > 0)

# in years
def get_time_to_year(date):
    today = datetime.date.today()
    next_year = datetime.date(year=(today.year+1), month=1, day=1)
    return ((next_year - today).days / 365)

def get_time_to_next_period(starting_date, period):
    if period is None:
        return 0
    
    today = datetime.date.today()
    floored_days=math.floor(365*period)

    while ((starting_date - today).days<0):
        starting_date += datetime.timedelta(days=floored_days)
    
    return ((today - starting_date).days / 365)

################################################
##### PARSING FUNCTIONS

### CLI PARSING
def get_start_date(xtra_args, xtra_values):
    if formatter.FUNC_XTRA_VALUED_ARGS_DICT['start_date'] in xtra_args:
        unparsed_start = xtra_values[xtra_args.index(formatter.FUNC_XTRA_VALUED_ARGS_DICT['start_date'])]
        return parse_date_string(unparsed_start)
    return None

def get_end_date(xtra_args, xtra_values):
    if formatter.FUNC_XTRA_VALUED_ARGS_DICT['end_date'] in xtra_args:
        unparsed_end = xtra_values[xtra_args.index(formatter.FUNC_XTRA_VALUED_ARGS_DICT['end_date'])]
        return parse_date_string(unparsed_end)
    return None


def get_float_arg(xtra_args, xtra_values, which_arg):
    if which_arg in xtra_args:
        try:
            return float(xtra_values[xtra_args.index(which_arg)])
        except ValueError as ve:
            raise ve
    return None

def get_int_arg(xtra_args, xtra_values, which_arg):
    if which_arg in xtra_args:
        try:
            return int(xtra_values[xtra_args.index(which_arg)])
        except ValueError as ve:
            raise ve
    return None

def get_date_arg(xtra_args, xtra_values, which_arg):
    if which_arg in xtra_args:
        unparsed_date = xtra_values[xtra_args.index(which_arg)]
        return parse_date_string(unparsed_date)
    return None

def get_str_arg(xtra_args, xtra_values, which_arg, lowerCase = False):
    if which_arg in xtra_args:
        if not lowerCase:
            return str(xtra_values[xtra_args.index(which_arg)])
        return str(xtra_values[xtra_args.index(which_arg)]).lower()
    return None

def get_flag_arg(xtra_args, which_arg):
    if which_arg in xtra_args:
        return which_arg
    return None

def format_xtra_args_dict(xtra_args, xtra_values, default_estimation_method):
    current_estimation_method = default_estimation_method
    if get_flag_arg(xtra_args, formatter.FUNC_XTRA_SINGLE_ARGS_DICT['moments']) is not None:
        current_estimation_method = static.keys['ESTIMATION']['MOMENT']
    elif get_flag_arg(xtra_args, formatter.FUNC_XTRA_SINGLE_ARGS_DICT['likelihood']) is not None:
       current_estimation_method = static.keys['ESTIMATION']['LIKE']
    elif get_flag_arg(xtra_args,formatter.FUNC_XTRA_SINGLE_ARGS_DICT['percentiles']) is not None:
       current_estimation_method = static.keys['ESTIMATION']['PERCENT']

    return {
        'start_date': get_date_arg(xtra_args, xtra_values, formatter.FUNC_XTRA_VALUED_ARGS_DICT['start_date']),
        'end_date': get_date_arg(xtra_args, xtra_values, formatter.FUNC_XTRA_VALUED_ARGS_DICT['end_date']),
        'save_file': get_str_arg(xtra_args, xtra_values, formatter.FUNC_XTRA_VALUED_ARGS_DICT['save']),
        'target': get_float_arg(xtra_args, xtra_values, formatter.FUNC_XTRA_VALUED_ARGS_DICT['target']),
        'discount': get_float_arg(xtra_args, xtra_values, formatter.FUNC_XTRA_VALUED_ARGS_DICT['discount']),
        'investment': get_float_arg(xtra_args, xtra_values, formatter.FUNC_XTRA_VALUED_ARGS_DICT['investment']),
        'expiry': get_float_arg(xtra_args, xtra_values, formatter.FUNC_XTRA_VALUED_ARGS_DICT['expiry']),
        'probability': get_float_arg(xtra_args, xtra_values, formatter.FUNC_XTRA_VALUED_ARGS_DICT['probability']),
        'model': get_str_arg(xtra_args, xtra_values,formatter.FUNC_XTRA_VALUED_ARGS_DICT['model'], True),
        'steps': get_int_arg(xtra_args, xtra_values,formatter.FUNC_XTRA_VALUED_ARGS_DICT['steps']),
        'optimize_sharpe': get_flag_arg(xtra_args, formatter.FUNC_XTRA_SINGLE_ARGS_DICT['optimize_sharpe']),
        'suppress': get_flag_arg(xtra_args,formatter.FUNC_XTRA_SINGLE_ARGS_DICT['suppress_output']),
        'json': get_flag_arg(xtra_args, formatter.FUNC_XTRA_SINGLE_ARGS_DICT['json']),
        'estimation': current_estimation_method
    }

def separate_and_parse_args(args):
    extra_args, extra_values= [], []
    reduced_args = args
    
    for arg in args:
        if arg in formatter.FUNC_XTRA_VALUED_ARGS_DICT.values() or arg in formatter.FUNC_XTRA_SINGLE_ARGS_DICT.values():
            extra_args.append(arg)
            if arg not in formatter.FUNC_XTRA_SINGLE_ARGS_DICT.values():
                extra_values.append(args[args.index(arg)+1])
            else:
                extra_values.append(None)

    for arg in extra_args:
        reduced_args.remove(arg)

    for arg in extra_values:
        if arg is not None:
            reduced_args.remove(arg)

    extra_reduced_args = reduced_args
    offset = 0
    for i, arg in enumerate(reduced_args):
        if arg.startswith('-'):
            extra_reduced_args.remove(arg)
            offset += 1
        else:
            extra_reduced_args[i-offset] = extra_reduced_args[i-offset].upper()

    return (extra_args, extra_values, extra_reduced_args)
    
def get_first_json_key(this_json):
    return list(this_json.keys())[0]

def replace_troublesome_chars(msg):
    return msg.replace('\u2265','').replace('\u0142', '')
