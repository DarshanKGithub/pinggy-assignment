package com.example.pinggy.service;

import com.example.pinggy.model.Post;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {
    private final List<Post> posts = new ArrayList<>();

    public void createPost(String title, String body, String authHeader){
        Post post = new Post();
        post.setTitle(title);
        post.setBody(body);
        post.setAuthHeader(authHeader);
        posts.add(post);
    }

    public List<Post> getAllPosts(){
        return new ArrayList<>(posts);
    }
}
