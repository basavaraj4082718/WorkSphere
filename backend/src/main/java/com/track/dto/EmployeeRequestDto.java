package com.track.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class EmployeeRequestDto {

	@NotBlank(message = "Employee code is required")
	private String employeeCode;

	@NotBlank(message = "Firstname is required")
	private String firstName;

	@NotBlank(message = "Lastname is required")
	private String lastName;

	@NotBlank(message = "Email is required")
	@Email(message = "Invalid Email format")
	private String email;

	@NotBlank(message = "Department is required")
	private String department;

	@NotBlank(message = "Designation is required")
	private String designation;

	@NotBlank(message = "Password is required")
	private String password;


	public EmployeeRequestDto() {
	}


	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}


	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}


	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}


	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}


	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}


	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}


	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}