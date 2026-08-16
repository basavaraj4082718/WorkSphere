package com.track.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.track.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

            	    // Public Routes
            	    .requestMatchers("/auth/**").permitAll()

            	    // =========================
            	    // EMPLOYEE ENDPOINTS
            	    // =========================

            	    .requestMatchers(
            	            HttpMethod.POST,
            	            "/api/employees/**"
            	    ).hasRole("ADMIN")

            	    .requestMatchers(
            	            HttpMethod.DELETE,
            	            "/api/employees/**"
            	    ).hasRole("ADMIN")

            	    // Assign Manager Endpoint
            	    .requestMatchers(
            	            HttpMethod.PUT,
            	            "/api/employees/*/assign-manager/*"
            	    ).hasRole("ADMIN")

            	    .requestMatchers(
            	            HttpMethod.PUT,
            	            "/api/employees/**"
            	    ).hasAnyRole("ADMIN", "MANAGER")

            	    .requestMatchers(
            	            HttpMethod.GET,
            	            "/api/employees/**"
            	    ).hasAnyRole("ADMIN", "MANAGER")

            	    // =========================
            	    // MANAGER ENDPOINTS
            	    // =========================

            	    .requestMatchers(
            	            HttpMethod.POST,
            	            "/api/managers/**"
            	    ).hasRole("ADMIN")

            	    .requestMatchers(
            	            HttpMethod.PUT,
            	            "/api/managers/**"
            	    ).hasRole("ADMIN")

            	    .requestMatchers(
            	            HttpMethod.DELETE,
            	            "/api/managers/**"
            	    ).hasRole("ADMIN")

            	    .requestMatchers(
            	            HttpMethod.GET,
            	            "/api/managers/**"
            	    ).hasAnyRole("ADMIN", "MANAGER")

            	 // =========================
            	 // TASK ENDPOINTS
            	 // =========================

            	 // Create Task
            	 .requestMatchers(
            	         HttpMethod.POST,
            	         "/api/tasks/**"
            	 ).hasAnyRole("ADMIN", "MANAGER")

            	 // Get Tasks
            	 .requestMatchers(
            	         HttpMethod.GET,
            	         "/api/tasks/**"
            	 ).hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

            	 // Employee Status Update
            	 .requestMatchers(
            	         HttpMethod.PUT,
            	         "/api/tasks/*/status"
            	 ).hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

            	 // Update Task Details
            	 .requestMatchers(
            	         HttpMethod.PUT,
            	         "/api/tasks/**"
            	 ).hasAnyRole("ADMIN", "MANAGER")

            	 // Delete Task
            	 .requestMatchers(
            	         HttpMethod.DELETE,
            	         "/api/tasks/**"
            	 ).hasRole("ADMIN")
            	 
            	 
            	// =========================
            	// ATTENDANCE ENDPOINTS
            	// =========================

            	.requestMatchers(
            	        HttpMethod.POST,
            	        "/api/attendance/checkin/**",
            	        "/api/attendance/checkout/**"
            	).hasAnyRole("EMPLOYEE", "ADMIN")

            	.requestMatchers(
            	        HttpMethod.GET,
            	        "/api/attendance/**"
            	).hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")
            	
            	
            	// =========================
            	// REVIEW ENDPOINTS
            	// =========================

            	// Create Review
            	.requestMatchers(
            	        HttpMethod.POST,
            	        "/api/reviews/**"
            	).hasAnyRole("ADMIN", "MANAGER")

            	// View Reviews
            	.requestMatchers(
            	        HttpMethod.GET,
            	        "/api/reviews/**"
            	).hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

            	// Delete Review
            	.requestMatchers(
            	        HttpMethod.DELETE,
            	        "/api/reviews/**"
            	).hasRole("ADMIN")
            	
            	
            	
              //// performance review endpoints
             
            	.requestMatchers(
            	        "/api/performance/**")
            	.hasAnyRole(
            	        "ADMIN",
            	        "MANAGER",
						"EMPLOYEE"
            	)
            	
            	//admin dashboard
            	
            	.requestMatchers("/api/dashboard/admin")
            	.hasRole("ADMIN")
            	
            	
            	//employee dashboard
            	
            	.requestMatchers("/api/dashboard/employee/**")
            	.hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")
            	
            	
            	//manager dashboard
            	
            	.requestMatchers("/api/dashboard/manager/**")
            	.hasAnyRole("MANAGER", "ADMIN")
            	
            	//leave management 
            	
            	.requestMatchers("/api/leaves/apply")
            	.hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")

            	.requestMatchers("/api/leaves/*/approve")
            	.hasAnyRole("MANAGER", "ADMIN")

            	.requestMatchers("/api/leaves/*/reject")
            	.hasAnyRole("MANAGER", "ADMIN")

            	.requestMatchers("/api/leaves/all")
            	.hasAnyRole("ADMIN", "MANAGER")

            	.requestMatchers("/api/leaves/employee/**")
            	.hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")
            	

            	    
            	    
            	    .anyRequest().authenticated()
            	)

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            )

            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}