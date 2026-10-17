package tn.tekup.smartenergy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import tn.tekup.smartenergy.dto.AuthDtos.*;
import tn.tekup.smartenergy.service.AuthService;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService service;

    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED)
    public MessageResponse register(@Valid @RequestBody RegisterRequest r) { return service.register(r); }
    @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest r) { return service.login(r); }
    @PostMapping("/forgot-password") public MessageResponse forgot(@Valid @RequestBody ForgotPasswordRequest r) { return service.forgotPassword(r); }
    @PostMapping("/reset-password") public MessageResponse reset(@Valid @RequestBody ResetPasswordRequest r) { return service.resetPassword(r); }
}
