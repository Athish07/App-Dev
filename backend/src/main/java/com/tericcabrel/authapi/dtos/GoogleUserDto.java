package com.tericcabrel.authapi.dtos;

public class GoogleUserDto {
    private String userId;
    private String email;
    private String name;

    public GoogleUserDto(String userId, String email, String name) {
        this.userId = userId;
        this.email = email;
        this.name = name;
    }

    public String getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }
}
