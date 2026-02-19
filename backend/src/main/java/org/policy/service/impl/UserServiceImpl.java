package org.policy.service.impl;

import java.util.Optional;
import org.policy.dto.UserDTO;
import org.policy.entity.User;
import org.policy.repository.UserRepository;
import org.policy.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDTO register(String email, String username, String password, String role, Long id) {
        User user = new User();
        if (id != null) {
            user.setId(id);
        }
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(password);

        String normalizedRole = role == null || role.isBlank() ? "USER" : role.toUpperCase();
        user.setRole(normalizedRole);

        if ("APPROVER".equals(normalizedRole) || "READONLY".equals(normalizedRole)) {
            user.setStatus("INACTIVE");
        } else {
            user.setStatus("ACTIVE");
        }

        User saved = userRepository.save(user);
        return new UserDTO(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getPassword(), saved.getRole());
    }

    @Override
    public Optional<User> login(String username, String password) {
        Optional<User> user = userRepository.findByUsernameAndPassword(username, password);
        if (user.isPresent() && "INACTIVE".equalsIgnoreCase(user.get().getStatus())) {
            throw new RuntimeException("Contact Admin");
        }
        return user;
    }

    @Override
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public java.util.List<User> getInactiveUsers() {
        return userRepository.findByStatus("INACTIVE");
    }

    @Override
    public User activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus("ACTIVE");
        return userRepository.save(user);
    }

    @Override
    public User deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus("INACTIVE");
        return userRepository.save(user);
    }
}
