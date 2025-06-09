package com.travel.api.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String generateJwtToken(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        String username;
        Collection<? extends GrantedAuthority> authorities;

        if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            username = userDetails.getUsername();
            authorities = userDetails.getAuthorities();
        } else {
            throw new IllegalStateException("Unexpected principal type: " + principal.getClass().getName());
        }

        String roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }


    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public List<GrantedAuthority> extractRoles(String token) {
        String rolesString = extractClaims(token).get("roles", String.class);
        if (rolesString == null || rolesString.isEmpty()) return Collections.emptyList();

        return Arrays.stream(rolesString.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    public boolean isTokenValid(String token) {
        try {
            extractClaims(token); // If this succeeds, token is valid
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("JWT validation error: " + e.getMessage());
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
