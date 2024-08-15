package com.tericcabrel.authapi.services;

import com.tericcabrel.authapi.dtos.GoogleUserDto;
import com.tericcabrel.authapi.dtos.LoginUserDto;
import com.tericcabrel.authapi.dtos.RegisterUserDto;
import com.tericcabrel.authapi.entities.User;
import com.tericcabrel.authapi.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
        UserRepository userRepository,
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User signup(RegisterUserDto input) {
        var user = new User()
            .setFullName(input.getFullName())
            .setEmail(input.getEmail())
            .setPassword(passwordEncoder.encode(input.getPassword()))
            .setProfileImageUrl(input.getProfileImageUrl());  // Set profileImageUrl

        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                input.getEmail(),
                input.getPassword()
            )
        );

        return userRepository.findByEmail(input.getEmail()).orElseThrow();
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users;
    }

    public User findOrRegisterGoogleUser(GoogleUserDto googleUserDto) {
        // Check if user already exists in the database
        Optional<User> optionalUser = userRepository.findByEmail(googleUserDto.getEmail());

        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            // If user does not exist, register a new one
            User newUser = new User()
                .setFullName(googleUserDto.getName())
                .setEmail(googleUserDto.getEmail());
            
            // Save user to the database
            return userRepository.save(newUser);
        }
    }
}
