package com.example.pinggy.controller;

import com.example.pinggy.config.AuthContext;
import com.example.pinggy.dto.PostRequest;
import com.example.pinggy.dto.PostResponse;
import com.example.pinggy.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class PostController {
    private final PostService postService;

    public PostController(PostService postService){
        this.postService = postService;
    }

    @PostMapping("/post")
    public ResponseEntity<Void> createPost(@RequestBody PostRequest postRequest){
        String authHeader = AuthContext.getAuthHeader();
        postService.createPost(postRequest.getTitle(), postRequest.getBody(), authHeader);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list")
    public ResponseEntity<List<PostResponse>> getAllPosts(){
        List<PostResponse> response = postService.getAllPosts().stream().map(post -> {
            PostResponse postResponse = new PostResponse();
            postResponse.setTitle(post.getTitle());
            postResponse.setBody(post.getBody());
            postResponse.setPinggyAuthHeader(post.getAuthHeader());
            return postResponse;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
