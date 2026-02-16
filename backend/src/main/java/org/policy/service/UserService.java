package org.policy.service;

import java.util.Optional;
import org.policy.dto.UserDTO;
import org.policy.entity.User;

public interface UserService {
    UserDTO register(String email, String username, String password, String role, Long id);

    Optional<User> login(String username, String password);
}
