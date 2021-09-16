FROM python:3.8.8-slim

USER root

RUN useradd -ms /bin/bash chinchalinchin && \
     groupadd admin && \
     usermod -a -G admin chinchalinchin && \ 
     apt-get update -y && \
     apt-get install -y curl wait-for-it postgresql-client-11 libpq-dev build-essential \ 
                         libffi-dev libopenblas-dev liblapack-dev libfreetype6 libpng-dev \
                         pkg-config python3-dev gfortran gcc 

WORKDIR /home/
COPY /requirements-docker.txt /home/requirements.txt
RUN CFLAGS="-g0 -Wl,--strip-all -I/usr/include:/usr/local/include -L/usr/lib:/usr/local/lib" && \
     pip install --upgrade pip && \
     pip install --compile \
                    --no-cache-dir \
                    --global-option=build_ext \
                    --global-option="-j 4" \
                    --requirement requirements.txt
     # separate layer because `pip install` takes forever to build from source. cache if possible.
RUN  apt-get purge -y --auto-remove build-essential gfortran gcc python3-dev && \
     apt-get clean && \
     rm -rf /var/lib/apt/lists/*

COPY --chown=chinchalinchin:admin /scrilla/ /home/scrilla/
COPY --chown=chinchalinchin:admin /scripts/ /home/scripts/
RUN chown -R chinchalinchin:admin /home/ /usr/local/lib/python3.8/site-packages/scrilla/data/ && \
     chmod -R 744 /home/

USER chinchalinchin
WORKDIR /home/scrilla/
EXPOSE 8000
ENTRYPOINT [ "/home/scripts/docker/entrypoint.sh" ]