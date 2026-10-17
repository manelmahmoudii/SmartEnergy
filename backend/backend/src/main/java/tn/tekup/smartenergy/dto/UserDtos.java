package tn.tekup.smartenergy.dto;

import jakarta.validation.constraints.*;
import tn.tekup.smartenergy.entity.*;

public class UserDtos {
    public record UserResponse(Long id, String nom, String email, Role role, UserStatus status) {
        public static UserResponse of(User u) { return new UserResponse(u.getId(), u.getNom(), u.getEmail(), u.getRole(), u.getStatus()); }
    }
    public record CreateUserRequest(@NotBlank String nom, @Email @NotBlank String email, @NotNull Role role) {}
    public record UpdateUserRequest(@NotBlank String nom, @NotNull Role role) {}
    public record UpdateProfileRequest(@NotBlank String nom, @Size(min = 8) String newPassword) {}
}
