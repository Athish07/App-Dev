package com.tericcabrel.authapi.dtos;

public class RegisterUserDto {
    private String email;
    private String password;
    private String fullName;
    private String profileImageUrl; // Update field name to match the User entity

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public RegisterUserDto setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public RegisterUserDto setPassword(String password) {
        this.password = password;
        return this;
    }

    public String getFullName() {
        return fullName;
    }

    public RegisterUserDto setFullName(String fullName) {
        this.fullName = fullName;
        return this;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public RegisterUserDto setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
        return this;
    }

    @Override
    public String toString() {
        return "RegisterUserDto{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", fullName='" + fullName + '\'' +
                ", profileImageUrl='" + profileImageUrl + '\'' +
                '}';
    }
}
