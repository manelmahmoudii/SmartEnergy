package tn.tekup.smartenergy.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor @Slf4j
public class EmailService {
    private final JavaMailSender sender;
    @Value("${app.mail-from}") private String from;

    /** Un échec d'envoi est journalisé sans bloquer l'opération métier. */
    public void send(String to, String subject, String body) {
        try {
            var m = new SimpleMailMessage();
            m.setFrom(from); m.setTo(to); m.setSubject(subject); m.setText(body);
            sender.send(m);
        } catch (Exception e) {
            log.warn("Envoi d'e-mail impossible vers {} : {}", to, e.getMessage());
        }
    }
}
