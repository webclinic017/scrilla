FROM python:3.10.0b4-slim

USER root

RUN useradd -ms /bin/bash chinchalinchin && \
     groupadd admin && \
     usermod -a -G admin chinchalinchin && \ 
     apt-get update -y && \
     apt-get install -y curl wait-for-it postgresql-client-11 libpq-dev build-essential libffi-dev git && \
     apt-get clean && \
     rm -rf /var/lib/apt/lists/*

WORKDIR /home/
COPY /requirements.txt /home/requirements.txt
RUN pip install --compile --no-cache-dir --requirement requirements.txt

COPY --chown=chinchalinchin:admin /app/ /home/app/
COPY --chown=chinchalinchin:admin /scripts/ /home/scripts/
RUN chown -R chinchalinchin:admin /home/  && \
     chmod -R 744 /home/

USER chinchalinchin
WORKDIR /home/app/
EXPOSE 8000
ENTRYPOINT [ "/home/scripts/docker/entrypoint.sh" ]