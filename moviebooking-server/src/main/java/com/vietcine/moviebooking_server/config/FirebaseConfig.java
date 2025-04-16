package com.vietcine.moviebooking_server.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {
    @Value("${firebase.service-account-file:src/main/resources/viet-cine-firebase-adminsdk.json}")
    private String serviceAccountPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {

        InputStream serviceAccount = getClass().getClassLoader()
                .getResourceAsStream("viet-cine-firebase-adminsdk.json");

        if (serviceAccount == null) {
            throw new IOException("Firebase service account file not found in resources. " +
                    "Please ensure 'viet-cine-firebase-adminsdk.json' is in src/main/resources/");
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        return FirebaseApp.initializeApp(options);
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}
