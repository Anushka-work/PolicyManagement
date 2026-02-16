package org.policy.controller;

import java.util.Optional;
import org.policy.dto.UserDTO;
import org.policy.entity.User;
import org.policy.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO userDTO) {
        try {
            UserDTO created = userService.register(
                    userDTO.getEmail(),
                    userDTO.getUsername(),
                    userDTO.getPassword(),
                    userDTO.getRole(),
                    userDTO.getId());
            return ResponseEntity.ok(created);
        } catch (Exception ex) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Optional<User>> login(
            @RequestParam String username,
            @RequestParam String password) {
        Optional<User> user = userService.login(username, password);
        if (user.isPresent()) {
            return ResponseEntity.ok(user);
        }
        throw new RuntimeException("Invalid credentials");
    }
}
