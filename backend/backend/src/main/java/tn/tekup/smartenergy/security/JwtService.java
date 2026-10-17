package tn.tekup.smartenergy.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
    @Value("${app.jwt.secret}") private String secret;
    @Value("${app.jwt.expiration-ms}") private long expirationMs;

    private SecretKey key() { return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)); }

    public String generate(String email, String role) {
        return Jwts.builder().subject(email).claim("role", role).issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs)).signWith(key()).compact();
    }
    public String extractEmail(String token) { return claims(token).getSubject(); }
    public boolean isValid(String token) {
        try { claims(token); return true; } catch (JwtException | IllegalArgumentException e) { return false; }
    }
    private Claims claims(String token) { return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload(); }
}
