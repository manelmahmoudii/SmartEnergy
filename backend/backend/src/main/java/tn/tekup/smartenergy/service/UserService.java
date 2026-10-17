package tn.tekup.smartenergy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tekup.smartenergy.dto.UserDtos.*;
import tn.tekup.smartenergy.entity.*;
import tn.tekup.smartenergy.exception.ApiException;
import tn.tekup.smartenergy.repository.UserRepository;
import java.security.SecureRandom;
import java.util.List;

@Service @RequiredArgsConstructor @Transactional
public class UserService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final EmailService email;
    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

    private User get(Long id) { return users.findById(id).orElseThrow(() -> ApiException.notFound("Utilisateur introuvable")); }
    private User byEmail(String e) { return users.findByEmail(e).orElseThrow(() -> ApiException.notFound("Utilisateur introuvable")); }

    public UserResponse me(String e) { return UserResponse.of(byEmail(e)); }

    public UserResponse updateMe(String e, UpdateProfileRequest r) {
        User u = byEmail(e);
        u.setNom(r.nom());
        if (r.newPassword() != null && !r.newPassword().isBlank()) u.setPassword(encoder.encode(r.newPassword()));
        return UserResponse.of(u);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> search(UserStatus status, Role role, String q) {
        return users.search(status, role, q == null ? "" : q).stream().map(UserResponse::of).toList();
    }

    public UserResponse setStatus(Long id, UserStatus status) {
        User u = get(id);
        if (u.getRole() == Role.ADMIN) throw ApiException.badRequest("Le statut d'un administrateur ne peut pas être modifié");
        u.setStatus(status);
        if (status == UserStatus.APPROVED) email.send(u.getEmail(), "Smart Energy – Compte validé", "Votre compte a été validé. Vous pouvez vous connecter.");
        return UserResponse.of(u);
    }

    public UserResponse create(CreateUserRequest r) {
        if (users.existsByEmail(r.email())) throw ApiException.conflict("Cette adresse e-mail est déjà utilisée");
        String temp = randomPassword();
        User u = users.save(User.builder().nom(r.nom()).email(r.email()).password(encoder.encode(temp))
                .role(r.role()).status(UserStatus.APPROVED).build());
        email.send(u.getEmail(), "Smart Energy – Votre compte", "Mot de passe temporaire : " + temp + "\nChangez-le dès votre première connexion.");
        return UserResponse.of(u);
    }

    public UserResponse update(Long id, UpdateUserRequest r) {
        User u = get(id);
        u.setNom(r.nom()); u.setRole(r.role());
        return UserResponse.of(u);
    }

    public void delete(Long id) {
        User u = get(id);
        if (u.getRole() == Role.ADMIN) throw ApiException.badRequest("Un administrateur ne peut pas être supprimé");
        users.delete(u);
    }

    private String randomPassword() {
        var rnd = new SecureRandom(); var sb = new StringBuilder();
        for (int i = 0; i < 12; i++) sb.append(CHARS.charAt(rnd.nextInt(CHARS.length())));
        return sb.toString();
    }
}
