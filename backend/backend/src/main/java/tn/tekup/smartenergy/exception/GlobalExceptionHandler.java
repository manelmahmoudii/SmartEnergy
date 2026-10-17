package tn.tekup.smartenergy.exception;

import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    public record ErrorResponse(Instant timestamp, int status, String message) {}

    private ResponseEntity<ErrorResponse> build(HttpStatus s, String m) {
        return ResponseEntity.status(s).body(new ErrorResponse(Instant.now(), s.value(), m));
    }
    @ExceptionHandler(ApiException.class) ResponseEntity<ErrorResponse> api(ApiException e) { return build(e.getStatus(), e.getMessage()); }
    @ExceptionHandler(BadCredentialsException.class) ResponseEntity<ErrorResponse> bad(BadCredentialsException e) { return build(HttpStatus.UNAUTHORIZED, "E-mail ou mot de passe incorrect"); }
    @ExceptionHandler(DisabledException.class) ResponseEntity<ErrorResponse> disabled(DisabledException e) { return build(HttpStatus.FORBIDDEN, "Compte en attente de validation, rejeté ou banni"); }
    @ExceptionHandler(AccessDeniedException.class) ResponseEntity<ErrorResponse> denied(AccessDeniedException e) { return build(HttpStatus.FORBIDDEN, "Accès refusé"); }
    @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ErrorResponse> invalid(MethodArgumentNotValidException e) {
        return build(HttpStatus.BAD_REQUEST, e.getBindingResult().getFieldErrors().stream().map(f -> f.getField() + " : " + f.getDefaultMessage()).collect(Collectors.joining(", ")));
    }
}
