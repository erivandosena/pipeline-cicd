# Alpine Linux with OpenJDK JRE
#FROM openjdk:8-jre-alpine
FROM openjdk:11.0-jre-bullseye

#RUN apk add --no-cache bash
RUN apt update && apt-get install -y --no-install-recommends --allow-remove-essential bash

# copy fat WAR
#COPY spring-boot-ops.war /app.war

# copy fat WAR
COPY logback.xml /logback.xml

COPY run.sh /run.sh

# runs application
#CMD ["/usr/bin/java", "-jar", "-Dspring.profiles.active=default", "-Dlogging.config=/logback.xml", "/app.war"]

ENTRYPOINT ["/run.sh"]
