# Pynance: A Financial Optimization Application

This is a financial application that calculates asset correlations, statistics and optimal portfolio allocations using data it retrieves from external services (currently: [AlphaVantage](https://www.alphavantage.co), [IEX](https://iexcloud.io/) and [Quandl](https://www.quandl.com/)). Statistics are calculated using [Ito Calculus](https://en.wikipedia.org/wiki/It%C3%B4_calculus) and should be consistent with the results demanded by [Modern Portfolio Theory](https://en.wikipedia.org/wiki/Modern_portfolio_theory) and [Financial Engineering](https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_equation). The portfolios are optimized by minimizing the portfolio's variance/volatility, i.e. by finding the optimal spot on the portfolio's efficient frontier as defined by the [CAPM model](https://en.wikipedia.org/wiki/Capital_asset_pricing_model), or alternatively, by maximizing the portfolio's [Sharpe ratio](https://en.wikipedia.org/wiki/Sharpe_ratio).

The program's functions are wrapped in [PyQt5](https://doc.qt.io/qtforpython/index.html) widgets which provide a user interface (this feature is still in development and may explode). In addition, visualizations are created by [matplotlib](https://matplotlib.org/3.3.3/contents.html) for easier presentation.

## Required Configuration

In order to use this application, you will need to register for API keys at AlphaVantage, IEX and Quandl. Store these in your session's environment. <b>pynance</b> will search for environment variables named <b>ALPHA_VANTAGE_KEY</b>, <b>QUANDL_KEY</b> and <b>IEX_KEY</b>. You can add the following lines to your <i>.bashrc</i> profile,

`export ALPHA_VANTAGE_KEY=<key goes here>`<br>
`export QUANDL_KEY=<key goes here>`<br>
`export IEX_KEY=<key goes here>`<br>

If no API keys are found in these variables, the application will not function properly; be sure to load these variables into your shell session before using <b>pynance</b>. The link below will take you to the registration pages for each service API Key,

[AlphaVantage API Key Registration](https://www.alphavantage.co/support/#api-key)<br>
[Quandl API Key Registration](https://www.quandl.com/account/api)<br>
[IEX API Key Registration](https://iexcloud.io/docs/api/)<br>
## Optional Configuration 

<b>pynance</b> can be configured with the following environment variables. Each variable in this list has a suitable default set and so does not need changed unless the user prefers a different setting.

### RISK_FREE

Determines which US-Treasury yield is used as the basis for the risk free rate. This variable will default to a value of `10-Year`, but can be modified to any of the following: `"3-Month"`, `"5-Year"`, `"10-Year"`, or `"30-Year"`.

### MARKET_PROXY

Determines which ticker symbol is used as a proxy for the market return. This variable will default to a value of `SPY`, but can be set to any ticker on the stock market.

### FRONTIER_STEPS

Determines the number of data points in a portfolio's efficient frontier. This variable will default to a value of `5`, but can be set equal to any integer.


### MA_1, MA_2, MA_3

Determines the period in days used to calculuate moving average series. These variables default to the values of `20`, `60` and `100`, but can be set equal to any integer, as long as <b>MA_3</b> > <b>MA_2</b> > <b>MA_1</b>.

### FILE_EXT 

Determines the type of files that are output by <b>pynance</b>. This variable is ccurrently only defined for an argument of `json`. A future release will include `csv`. 

## Usage

For a full list of <b>pynance</b>'s functionality,

`pynance -help`

The main usage of <b>pynance</b> are detailed below.

### Optimization

A portfolio of consisting of the equities <i>ALLY</i>, <i>BX</i> and <i>SONY</i> can be optimized with the following command,

`pynance -opt ALLY BX SONY`

By default, <b>pynance</b> will optimize over the last 100 trading days. If you wish to optimize over a different time period, you may use the `-start` and `-end` argument flags to provide starting and ending dates in the `YYYY-MM-DD` format. 

Also by default, the optimization function will minimize the portfolio variance. You can also specify the portfolio should be maximized with respect to the Sharpe ratio,

`pynance -opt -sh ALLY BX SONY`

There are several other arguments you may use to configure your optimization program. The full list of arguments is shown below,

`pynance -opt -sh -start <YYYY-MM-DD> -end <YYYY-MM-DD> -save <absolute path to json file> -target <double> -invest <double> [TICKERS]`

`-target` will optimize the portfolio with the additional constraint that its rate of return must equal `target`. Note the target return must be between the minimum rate of return and maximum rate of return in a basket of equities. For example, if ALLY had a rate of return of 10%, BX 15%, SONY 20%, the frontier of possible rates of returns resides in the range [10%, 20%]. It is impossible to combine the equities in such a way to get a rate of return less than 10% or one greater than 20%. Note, this assumes shorting is not possible. A future release will relax this assumption and allow portfolio weights to be negative.

`-invest` represents the total amount of money invested in a portfolio. 

For example, the following command,

`pynance -opt -sh -save <path-to-json-file> -target 0.25 -invest 10000 -start 2020-01-03 -end 2021-05-15 ALLY BX SONY`

Will optimize a portfolio consisting of <i>ALLY</i>, <i>BX</i> and <i>SONY</i> using historical data between the dates of January 1st, 2020 and May 15th, 2021. The portfolio will be constrained to return a rate of 25%. A total $10,000 will be invested into this portfolio (to the nearest whole share). The output of this command will look like this,

> ---------------------------------------------- Results ----------------------------------------------<br>
> ----------------------------------------------------------------------------------------------------<br>
> ----------------------------------- Optimal Percentage Allocation -----------------------------------<br>
>           ALLY = 22.83 %<br>
>           BX = 19.26 %<br>
>           SONY = 57.91 %<br>
> ----------------------------------------------------------------------------------------------------<br>
> ----------------------------------------------------------------------------------------------------<br>
> -------------------------------------- Optimal Share Allocation --------------------------------------<br>
>           ALLY = 42<br>
>           BX = 15<br>
>           SONY = 56<br>
> -------------------------------------- Optimal Portfolio Value --------------------------------------<br>
>           >> Total  = $ 9893.98<br>
> ---------------------------------------- Risk-Return Profile ----------------------------------------<br>
>           >> Return  =  0.25<br>
>           >> Volatility  =  0.201<br>
> ----------------------------------------------------------------------------------------------------<br>

Note the optimal share allocation does not allow fractional shares. <b>pynance</b> will attempt to get as close to the total investment inputted without going over using only whole shares. Also note the return of this portfolio is 25%, as this was inputted into the target return constraint. 

### Other Notable Features

1. Discount Dividend Model

<b>pynance</b> will pull an equity's dividend payment history, regress the payment amount against its date and infer a linear regression from this time series. It will use this model to project future dividend payments and then calculate the current cost of equity and use that to discount the sum of dividend payments back to the present,

`pynance -ddm ALLY`

Alternatively, you can visualize the dividend payments against the regression model,

`pynance -plot-ddm ALLY`

2. Financial Statistics
    - Beta: `pynance -capm-beta [TICKERS]`
    - Correlation Matrix: `pynance -cor [TICKERS]`
    - Cost Of Equity: `pynance -capm-equity [TICKERS]`
    - Risk-Return Profile: `pynance -rr [TICKERS]`
    - Sharpe Ratio: `pynance -sharpe [TICKERS]`

3. Stock Watchlist and Screening

Stocks can be added to your watchlist with,

`pynance -watch [TICKERS]`

You can then screen stocks according to some criteria. For example, the following command will search your watchlist for stock prices that are less than their Discount Dividend Model (very rare this happens...),

`pynance -screen -model DDM`

4. Visualizations
    - Discount Dividend Model: `pynance -plot-div [TICKER]`
        - NOTE: THIS FUNCTION ONLY ACCEPTS ONE TICKER AT A TIME.
    - Efficient Fronter: `pynance -plot-ef [TICKERS]`
    - Moving Averages: `pynance -plot-mov [TICKERS]`
    - Risk Return Profile: `pynance -plot-rr [TICKERS]`
    - Yield Curve: `pynance -plot-yield` (not implemented yet)



