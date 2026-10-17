package tn.tekup.smartenergy.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import tn.tekup.smartenergy.entity.*;
import java.util.*;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByRole(Role role);
    List<User> findByStatus(UserStatus status);

    @Query("""
        select u from User u
        where (:status is null or u.status = :status)
          and (:role is null or u.role = :role)
          and (lower(u.nom) like lower(concat('%', :q, '%')) or lower(u.email) like lower(concat('%', :q, '%')))
        order by u.createdAt desc""")
    List<User> search(@Param("status") UserStatus status, @Param("role") Role role, @Param("q") String q);
}
