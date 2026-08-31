package com.track.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.track.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	Optional<Employee> findByEmployeeCode(String employeeCode);

	Optional<Employee> findByEmail(String email);

	Optional<Employee> findByUserId(Long userId);

	boolean existsByEmployeeCode(String employeeCode);

	boolean existsByEmail(String email);

	// Get all employees sorted by employee code ascending
	List<Employee> findAllByOrderByEmployeeCodeAsc();

	// Remove manager assignment from all employees before deleting manager
	@Modifying
	@Query("UPDATE Employee e SET e.manager = NULL WHERE e.manager.id = :managerId")
	void removeManagerFromEmployees(@Param("managerId") Long managerId);

}