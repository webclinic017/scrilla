import json

from typing import Tuple

from scrilla import settings
from scrilla.static import constants

FUNCTIONS= [
    "Correlation Matrix",
    "Efficient Frontier",
    "Moving Averages",
    "Portfolio Optimization",
    "Risk Profile"
]

def format_stylesheet(sheet):
    if settings.GUI_DARK_MODE:
        mode = get_dark_mode_theme()
    else:
        mode = get_light_mode_theme()

    for element in mode:
        sheet = sheet.replace(element, mode[element])

    return sheet

def get_dark_mode_theme():
    with open(settings.GUI_THEME_FILE, 'r') as f:
        MATERIAL = json.load(f)

    dark_theme = {}
    for color in MATERIAL['grey']:
        dark_theme[f'$primary-{color}']= MATERIAL['grey'][color]
    for color in MATERIAL['green']:
        dark_theme[f'$accent-{color}'] = MATERIAL['green'][color]
    for color in MATERIAL['red']:
        dark_theme[f'$warn-{color}'] = MATERIAL['red'][color]

    return dark_theme

def get_light_mode_theme():
    with open(settings.GUI_THEME_FILE, 'r') as f:
        MATERIAL = json.load(f)
        
    light_theme = {}
    for color in MATERIAL['grey']:
        light_theme[f'$primary-{color}']= MATERIAL['grey'][color]
    for color in MATERIAL['green']:
        light_theme[f'$accent-{color}'] = MATERIAL['green'][color]
    for color in MATERIAL['red']:
        light_theme[f'$warn-{color}'] = MATERIAL['red'][color]

    return light_theme

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

def format_allocation(allocation: float)->str:
    return str(100*allocation)[:constants.constants['SIG_FIGS']]+"%"

def format_risk_return(stats: dict) -> Tuple[str]:
    formatted_ret = str(100*stats['annual_return'])[:constants.constants['SIG_FIGS']]+"%"
    formatted_vol = str(100*stats['annual_volatility'])[:constants.constants['SIG_FIGS']]+"%"
    return formatted_ret, formatted_vol

def format_correlation(correlation: dict):
    return str(100*correlation["correlation"])[:constants.constants['SIG_FIGS']]+"%"