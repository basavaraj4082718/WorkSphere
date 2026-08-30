 package com.track.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.track.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByEmployeeId(Long employeeId);

    List<Review> findByManagerId(Long managerId);

    void deleteByEmployeeId(Long employeeId);

    void deleteByManagerId(Long managerId);
}

