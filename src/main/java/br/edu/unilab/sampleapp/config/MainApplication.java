package br.edu.unilab.sampleapp.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableAutoConfiguration
@ComponentScan("br.edu.unilab.sampleapp")
public class MainApplication implements WebMvcConfigurer {

    public static void main(final String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }
}