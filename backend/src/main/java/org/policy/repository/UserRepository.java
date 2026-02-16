package org.policy.repository;

import java.util.Optional;
import org.policy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndPassword(String username, String password);

    Optional<User> findByUsernameAndEmail(String username, String Email);
}
