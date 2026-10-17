package tn.tekup.smartenergy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.tekup.smartenergy.entity.PasswordResetToken;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
}
