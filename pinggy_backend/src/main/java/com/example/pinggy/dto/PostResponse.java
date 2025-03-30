package com.example.pinggy.dto;

import lombok.Data;

@Data
public class PostResponse {
    private String title;
    private String body;
    private String pinggyAuthHeader;
}
