
# Documentation

- [Angular Material](https://material.angular.io/) <br>
- [Angular Animations](https://angular.io/guide/animations)<br>
- [mat-currency-format](https://www.npmjs.com/package/mat-currency-format)<br>
- [ng2-charts](https://valor-software.com/ng2-charts/)<br>
- [chartsJS](https://www.chartjs.org/docs/latest/)<br>

# Stacks
- [scatter plot with line](https://stackoverflow.com/questions/54547903/scattered-plot-in-ng2-charts)

# Todo

1. ticker arg validation based on user role: nonAccountHolder -> five tickers per request, five requests per day.
    - form validation on angular side for five tickers, but also on backend.
    - throttling on backend, obviously.
2. need to set translateOn and translateOff positions before animating since the positiosn will be altered by the animation itself. 

3. need to change ddm response format so model dates are normalized relative to model starting point. will make plottign easier. angular app will need to do less calculation. 
    - OR BETTER YET. Return model and actual price for all data points. That way, no need to scale or recalcualte x axes tick marks. just use model price to generate line of best fit! bonus: this way, it will be easier to return error bars!