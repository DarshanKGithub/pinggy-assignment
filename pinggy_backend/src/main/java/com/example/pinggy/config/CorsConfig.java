package com.example.pinggy.config;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

public class CorsConfig implements WebMvcConfigurer {

    public void addCorsMapping(CorsRegistry registry){
        registry.addMapping("/**").allowedOrigins("http://localhost:3000").allowedMethods("GET","POST","PUT","DELETE","OPTIONS").allowedHeaders("*")
                .allowCredentials(true);
    }
}
