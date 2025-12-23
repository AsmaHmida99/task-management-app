package com.hahnsoftware.projecttasks.service;

import com.hahnsoftware.projecttasks.dto.JwtResponse;
import com.hahnsoftware.projecttasks.dto.LoginRequest;
import com.hahnsoftware.projecttasks.dto.SignupRequest;
import com.hahnsoftware.projecttasks.model.User;
import com.hahnsoftware.projecttasks.repository.UserRepository;
import com.hahnsoftware.projecttasks.security.JwtUtils;
import com.hahnsoftware.projecttasks.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder encoder,
                       JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    /**
     * Authentifie un utilisateur et génère un token JWT
     * @param loginRequest Requête de connexion contenant email et mot de passe
     * @return JwtResponse contenant le token et les informations utilisateur
     * @throws org.springframework.security.core.AuthenticationException si les credentials sont invalides
     */
    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getEmail(), roles);
    }

    /**
     * Inscrit un nouvel utilisateur
     * @param signUpRequest Requête d'inscription contenant email et mot de passe
     * @throws IllegalArgumentException si l'email existe déjà
     */
    @Transactional
    public void register(SignupRequest signUpRequest) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        // Créer le nouvel utilisateur
        User user = new User(signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);
    }
}
