package com.tericcabrel.authapi.controllers;

import com.tericcabrel.authapi.entities.User;
import com.tericcabrel.authapi.dtos.LoginUserDto;
import com.tericcabrel.authapi.dtos.RegisterUserDto;
import com.tericcabrel.authapi.responses.LoginResponse;
import com.tericcabrel.authapi.services.AuthenticationService;
import com.tericcabrel.authapi.services.JwtService;
import com.tericcabrel.authapi.services.GoogleTokenVerifierService;
import com.tericcabrel.authapi.dtos.GoogleUserDto;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final GoogleTokenVerifierService googleTokenVerifierService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, GoogleTokenVerifierService googleTokenVerifierService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.googleTokenVerifierService = googleTokenVerifierService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse().setToken(jwtToken).setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/google")
    public ResponseEntity<LoginResponse> authenticateWithGoogle(@RequestBody Map<String, String> request) {
        String googleToken = request.get("token");

        GoogleUserDto googleUser = googleTokenVerifierService.verifyGoogleToken(googleToken);

        if (googleUser == null) {
            return ResponseEntity.status(401).build();
        }

        // Find or register the user in your database
        User user = authenticationService.findOrRegisterGoogleUser(googleUser);

        // Generate a JWT token for the user
        String jwtToken = jwtService.generateToken(user);

        LoginResponse loginResponse = new LoginResponse().setToken(jwtToken).setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }
}
