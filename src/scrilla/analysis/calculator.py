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

from scipy.stats import norm
from scipy.integrate import quad
from numpy import isinf, inf

import random

import  settings
import  util.outputter as outputter

logger = outputter.Logger("calculator", settings.LOG_LEVEL)

def generate_random_walk(periods):
    return [norm.ppf(random.uniform(0,1)) for i in range(periods)]

# Condition: E(integral of vol ^2 dt) < inf
def verify_volatility_condition(volatility_function):
    integral = quad(func=lambda x: volatility_function(x)**2, a=0, b=inf)
    return not isinf(x = integral)

# Remember forward increments!
def ito_integral(mean_function, volatilty_function, time_to_expiration=None):
    if verify_volatility_condition(volatility_function=volatilty_function):
        random_walk = generate_random_walk(settings.ITO_STEPS)
        
        # NOTE: Compute Ito Integral using forward increments due to the fact
        #       the value at the end of the interval can be conditioned on 
        #       the value at the beginning of the interval. In other words, Ito 
        #       Processes are Markovian, ie. E(X2 | X1) = X1.
        for i in range(settings.ITO_STEPS):
            # TODO
            pass
    else:
        logger.info('Supplied volatility function does not meet condition : ')
        logger.info('E(Integral(volatility_function^2 dt) from 0 to infinity < infinity)')