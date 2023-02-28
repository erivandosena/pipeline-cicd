# Dockerfile para Spring Boot - backend

FROM openjdk:11.0-jre-bullseye
VOLUME /tmp
EXPOSE 8081
ADD "${PWD}/app-sample-1.0.0-SNAPSHOT.jar app-sample.jar
ENTRYPOINT ["java","-jar","app-sample.jar"]
