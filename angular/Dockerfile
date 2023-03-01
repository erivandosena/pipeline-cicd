# Dockerfile for app-sample (frontend) Angular
#
# Maintainer: Erivando Sena <erivandoramos@unilab.edu.br>
#
# Description: Este Dockerfile cria uma imagem para app-sample, um aplicativo da Web escrito em Angula.
#
# Build instructions:
#
#   docker buildx build -t dti-registro.unilab.edu.br/unilab/angular:latest --build-arg 'COMMIT_SHA=$(git rev-parse --short HEAD) VERSION=1.0.0 BUILDKIT_INLINE_CACHE=1' --no-cache .
#   docker push dti-registro.unilab.edu.br/unilab/angular:latest
#
# Usage:
#
#   docker run -it --rm -d -p 80:80 --name app-sample dti-registro.unilab.edu.br/unilab/angular:latest
#   docker logs -f --tail --until=2s app-sample
#   docker exec -it app-sample bash
#
# Dependencies: nginx:alpine
#
# Environment variables:
#
#   COMMIT_SHA: o hash SHA-1 de um determinado commit do Git.
#   VERSION: usado na tag de imagem ou como parte dos metadados.
#
# Notes:
#
# - Este Dockerfile assume que o código do aplicativo está localizado no diretório atual
# - O aplicativo pode ser acessado em um navegador da Web em https://hello-world-test.unilab.edu.br/
#
# Version: 1.0

FROM nginx:latest

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get upgrade -y \
  && apt-get autoremove -y \
  && apt-get install -y --no-install-recommends --allow-remove-essential \
    curl \
    telnet \
    iputils-ping \
    lsb-release \
    locales

ARG VERSION
ARG COMMIT_SHA
ENV TZ America/Fortaleza
ENV LANG pt_BR.UTF-8 
ENV LC_CTYPE pt_BR.UTF-8 
ENV LC_ALL C
ENV LANGUAGE pt_BR:pt:en
RUN locale-gen pt_BR.UTF-8 
RUN dpkg-reconfigure locales tzdata -f noninteractive

COPY dist/crud/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

LABEL \
    org.opencontainers.image.vendor="Divisão de Infraestrutura, Segurança da Informação e Redes" \
    org.opencontainers.image.title="Exemplo de Microsserviço de Aplicação em container Docker Linux" \
    org.opencontainers.image.description="sample-app é um software Angular usado para demostrar aplicativos conteinerizados." \
    org.opencontainers.image.version="${VERSION}" \
    org.opencontainers.image.url="https://hello-world-test.unilab.edu.br/" \
    org.opencontainers.image.source="https://github.com/erivandosena/pipeline-cicd" \
    org.opencontainers.image.revision="${COMMIT_SHA}" \
    org.opencontainers.image.licenses="N/A" \
    org.opencontainers.image.author="Erivando Sena<erivandoramos@unilab.edu.br>" \
    org.opencontainers.image.company="Universidade da Integração Internacional da Lusofonia Afro-Brasileira (UNILAB)" \
    org.opencontainers.image.maintainer="DTI/Unilab"
