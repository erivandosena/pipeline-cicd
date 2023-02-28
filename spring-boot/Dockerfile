# Dockerfile para Spring Boot - backend

FROM openjdk:11.0-jre-bullseye

VOLUME /tmp

EXPOSE 8081

ADD target/app-sample-1.0.0-SNAPSHOT.jar app-sample.jar

LABEL \
    org.opencontainers.image.vendor="Divisão de Infraestrutura, Segurança da Informação e Redes" \
    org.opencontainers.image.title="Exemplo de Microsserviço de Aplicação em container Docker Linux" \
    org.opencontainers.image.description="sample-app é um software Java usado para demostrar aplicativos conteinerizados." \
    org.opencontainers.image.version="${VERSION}" \
    org.opencontainers.image.url="https://hello-world-test.unilab.edu.br/" \
    org.opencontainers.image.source="https://github.com/erivandosena/pipeline-cicd" \
    org.opencontainers.image.revision="${COMMIT_SHA}" \
    org.opencontainers.image.licenses="N/A" \
    org.opencontainers.image.author="Erivando Sena<erivandoramos@unilab.edu.br>" \
    org.opencontainers.image.company="Universidade da Integração Internacional da Lusofonia Afro-Brasileira (UNILAB)" \
    org.opencontainers.image.maintainer="DTI/Unilab"

ENTRYPOINT ["java","-jar","app-sample.jar"]
