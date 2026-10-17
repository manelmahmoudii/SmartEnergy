package tn.tekup.smartenergy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tekup.smartenergy.dto.*;
import tn.tekup.smartenergy.dto.AuthDtos.*;
import tn.tekup.smartenergy.entity.*;
import tn.tekup.smartenergy.exception.ApiException;
import tn.tekup.smartenergy.repository.*;
import tn.tekup.smartenergy.security.JwtService;
import java.time.LocalDateTime;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository users;
    private final PasswordResetTokenRepository tokens;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwt;
    private final EmailService email;
    @Value("${app.frontend-url}") private String frontendUrl;

    public MessageResponse register(RegisterRequest r) {
        if (r.role() == Role.ADMIN) throw ApiException.badRequest("Ce rôle ne peut pas être demandé à l'inscription");
        if (users.existsByEmail(r.email())) throw ApiException.conflict("Cette adresse e-mail est déjà utilisée");
        users.save(User.builder().nom(r.nom()).email(r.email()).password(encoder.encode(r.password()))
                .role(r.role()).status(UserStatus.PENDING).build());
        return new MessageResponse("Inscription envoyée. Un administrateur doit valider votre compte.");
    }

    public AuthResponse login(LoginRequest r) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(r.email(), r.password()));
        User u = users.findByEmail(r.email()).orElseThrow();
        return new AuthResponse(jwt.generate(u.getEmail(), u.getRole().name()), UserDtos.UserResponse.of(u));
    }

    /** Réponse identique que l'e-mail existe ou non, pour ne pas révéler les comptes. */
    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest r) {
        users.findByEmail(r.email()).ifPresent(u -> {
            var t = tokens.save(PasswordResetToken.builder().token(UUID.randomUUID().toString()).user(u)
                    .expiresAt(LocalDateTime.now().plusMinutes(30)).used(false).build());
            email.send(u.getEmail(), "Smart Energy – Réinitialisation du mot de passe",
                    "Cliquez sur ce lien (valable 30 minutes) : " + frontendUrl + "/reset-password?token=" + t.getToken());
        });
        return new MessageResponse("Si cette adresse existe, un e-mail de réinitialisation a été envoyé.");
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest r) {
        var t = tokens.findByToken(r.token()).orElseThrow(() -> ApiException.badRequest("Lien invalide"));
        if (t.isUsed() || t.getExpiresAt().isBefore(LocalDateTime.now())) throw ApiException.badRequest("Lien expiré ou déjà utilisé");
        t.getUser().setPassword(encoder.encode(r.newPassword()));
        t.setUsed(true);
        return new MessageResponse("Mot de passe modifié");
    }
}
