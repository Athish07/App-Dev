package com.tericcabrel.authapi.services;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.tericcabrel.authapi.dtos.GoogleUserDto;
import org.springframework.stereotype.Service;

import java.util.Collections;

@SuppressWarnings("deprecation")
@Service
public class GoogleTokenVerifierService {
    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifierService() {
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList("174186813687-u3pam09d85kprapgi9eotffr6s9ob05r.apps.googleusercontent.com"))
                .build();
    }

    public GoogleUserDto verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String userId = payload.getSubject();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                return new GoogleUserDto(userId, email, name);
            }
        } catch (Exception e) {
            // Handle token verification error
            e.printStackTrace(); // Consider logging the error
        }
        return null;
    }
}
