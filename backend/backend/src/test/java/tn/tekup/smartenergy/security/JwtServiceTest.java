package tn.tekup.smartenergy.security;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.Base64;
import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {
    private JwtService service() {
        var s = new JwtService();
        ReflectionTestUtils.setField(s, "secret", Base64.getEncoder().encodeToString("test-secret-key-with-at-least-32-bytes!!".getBytes()));
        ReflectionTestUtils.setField(s, "expirationMs", 60000L);
        return s;
    }
    @Test void generatedTokenIsValidAndKeepsEmail() {
        var s = service();
        String t = s.generate("a@b.tn", "ADMIN");
        assertTrue(s.isValid(t));
        assertEquals("a@b.tn", s.extractEmail(t));
    }
    @Test void invalidTokenIsRejected() { assertFalse(service().isValid("not-a-token")); }
}
