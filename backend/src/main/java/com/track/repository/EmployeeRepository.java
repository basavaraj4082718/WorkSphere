package com.track.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.track.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	Optional<Employee> findByEmployeeCode(String employeeCode);

	Optional<Employee> findByEmail(String email);

	Optional<Employee> findByUserId(Long userId);

	boolean existsByEmployeeCode(String employeeCode);

	boolean existsByEmail(String email);

}