package com.track.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.track.dto.EmployeeRequestDto;
import com.track.dto.EmployeeResponseDto;
import com.track.service.EmployeeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
@Validated
public class EmloyeeController {

	private final EmployeeService employeeService;

	public EmloyeeController(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}

	@PostMapping
	public ResponseEntity<EmployeeResponseDto> createEmployee(
			@Valid @RequestBody EmployeeRequestDto requestDto) {

		EmployeeResponseDto employee =
				employeeService.createEmployee(requestDto);

		return new ResponseEntity<>(employee, HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<EmployeeResponseDto> getEmployeeByID(
			@PathVariable Long id) {

		EmployeeResponseDto employee =
				employeeService.getEmployeeById(id);

		return ResponseEntity.ok(employee);
	}

	@GetMapping
	public ResponseEntity<List<EmployeeResponseDto>> getAllEmloyess() {

		List<EmployeeResponseDto> employee =
				employeeService.getAllEmployees();

		return ResponseEntity.ok(employee);
	}

	@PutMapping("/{id}")
	public ResponseEntity<EmployeeResponseDto> updateEmployee(
			@PathVariable Long id,
			@RequestBody EmployeeRequestDto requestDto) {

		EmployeeResponseDto updatedEmployee =
				employeeService.updateEmployee(id, requestDto);

		return ResponseEntity.ok(updatedEmployee);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteEmployee(
			@PathVariable Long id) {

		employeeService.deleteEmployee(id);

		return ResponseEntity.ok("Employee deleted successfully");
	}

	@PutMapping("/{employeeId}/assign-manager/{managerId}")
	public ResponseEntity<EmployeeResponseDto> assignManager(
			@PathVariable Long employeeId,
			@PathVariable Long managerId) {

		return ResponseEntity.ok(
				employeeService.assignManager(
						employeeId,
						managerId
				)
		);
	}
}