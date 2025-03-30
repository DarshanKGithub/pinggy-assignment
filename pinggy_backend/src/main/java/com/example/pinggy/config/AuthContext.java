package com.example.pinggy.config;

public class AuthContext {
    public static final ThreadLocal<String> authHeader = new ThreadLocal<>();

    public static void setAuthHeader(String header){
        authHeader.set(header);
    }
    public static String getAuthHeader(){
        return authHeader.get();
    }
    public static void clear(){
        authHeader.remove();
    }
}
