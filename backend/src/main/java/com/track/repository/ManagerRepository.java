package com.track.repository;

import com.track.entity.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ManagerRepository extends JpaRepository<Manager, Long> {

    boolean existsByManagerCode(String managerCode);

    boolean existsByEmail(String email);

    Optional<Manager> findByEmail(String email);

    // Get all managers sorted by manager code ascending
    List<Manager> findAllByOrderByManagerCodeAsc();

}