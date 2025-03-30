package com.example.pinggy.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class AuthFilter extends OncePerRequestFilter {
    private static final String AUTH_HEADER = "PinggyAuthHeader";

    @Override
    protected void doFilterInternal(

            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        System.out.println("Received headers: " + Collections.list(request.getHeaderNames()));

        String authHeaderValue = request.getHeader(AUTH_HEADER);

        if (authHeaderValue == null || authHeaderValue.isEmpty()) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or empty PinggyAuthHeader");
            return;
        }

        try {
            AuthContext.setAuthHeader(authHeaderValue);
            filterChain.doFilter(request, response);
        } finally {
            AuthContext.clear();
        }
    }
}