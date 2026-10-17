package tn.tekup.smartenergy.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import tn.tekup.smartenergy.entity.*;
import tn.tekup.smartenergy.repository.UserRepository;

@Configuration @RequiredArgsConstructor
public class DataInitializer {
    private final UserRepository users;
    private final PasswordEncoder encoder;

    /** Crée le premier administrateur au démarrage s'il n'existe pas. */
    @Bean
    CommandLineRunner seedAdmin(@Value("${app.admin.email}") String email, @Value("${app.admin.password}") String password) {
        return args -> {
            if (!users.existsByRole(Role.ADMIN)) {
                users.save(User.builder().nom("Administrateur").email(email).password(encoder.encode(password))
                        .role(Role.ADMIN).status(UserStatus.APPROVED).build());
            }
        };
    }
}
