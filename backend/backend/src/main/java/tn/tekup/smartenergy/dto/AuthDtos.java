package tn.tekup.smartenergy.dto;

import jakarta.validation.constraints.*;
import tn.tekup.smartenergy.entity.Role;

public class AuthDtos {
    public record RegisterRequest(@NotBlank String nom, @Email @NotBlank String email,
                                  @NotBlank @Size(min = 8, message = "8 caractères minimum") String password, @NotNull Role role) {}
    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record ForgotPasswordRequest(@Email @NotBlank String email) {}
    public record ResetPasswordRequest(@NotBlank String token, @NotBlank @Size(min = 8) String newPassword) {}
    public record AuthResponse(String token, UserDtos.UserResponse user) {}
    public record MessageResponse(String message) {}
}
