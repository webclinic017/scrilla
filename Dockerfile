FROM python:3.8.8

USER root

RUN useradd -ms /bin/bash chinchalinchin && \
     groupadd admin && \
     usermod -a -G admin chinchalinchin && \ 
     apt-get update -y && \
     apt-get install -y curl wait-for-it postgresql-client-11 libpq-dev build-essential \ 
                         libffi-dev git && \
     apt-get clean && \
     rm -rf /var/lib/apt/lists/*

WORKDIR /home/
COPY /requirements-docker.txt /home/requirements.txt
RUN pip install --compile --no-cache-dir --requirement requirements.txt

COPY --chown=chinchalinchin:admin /scrilla/ /home/scrilla/
COPY --chown=chinchalinchin:admin /scripts/ /home/scripts/
RUN chown -R chinchalinchin:admin /home/ /usr/local/lib/python3.8/site-packages/scrilla/data/ && \
     chmod -R 744 /home/

USER chinchalinchin
WORKDIR /home/scrilla/
EXPOSE 8000
ENTRYPOINT [ "/home/scripts/docker/entrypoint.sh" ]