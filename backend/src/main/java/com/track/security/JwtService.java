    package com.track.security;

    import java.util.Date;
    import java.util.HashMap;
    import java.util.Map;

    import javax.crypto.SecretKey;

    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.stereotype.Service;

    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.security.Keys;

    @Service
    public class JwtService {

        @Value("${jwt.secret}")
        private String secret;

        private SecretKey getSignInKey() {
            return Keys.hmacShaKeyFor(secret.getBytes());
        }

        public String generateToken(String email, String role) {

            Map<String, Object> claims = new HashMap<>();

            claims.put("role", role);

            return Jwts.builder()
                    .claims(claims)
                    .subject(email)
                    .issuedAt(new Date())
                    .expiration(
                            new Date(System.currentTimeMillis() + 86400000)
                    )
                    .signWith(getSignInKey())
                    .compact();
        }

        public String extractUsername(String token) {

            return Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        }

        public String extractRole(String token) {

            return Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("role", String.class);
        }

        public boolean validateToken(String token, String email) {

            String extractedEmail = extractUsername(token);

            return extractedEmail.equals(email);
        }
    }