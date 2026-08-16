package com.track.service;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.track.dto.LoginRequest;
import com.track.dto.LoginResponse;
import com.track.dto.RegisterRequest;
import com.track.entity.Employee;
import com.track.entity.User;
import com.track.enums.Role;
import com.track.repository.EmployeeRepository;
import com.track.repository.UserRepository;
import com.track.security.JwtService;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final EmployeeRepository employeeRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;


	public AuthService(
			UserRepository userRepository,
			EmployeeRepository employeeRepository,
			PasswordEncoder passwordEncoder,
			JwtService jwtService) {

		this.userRepository = userRepository;
		this.employeeRepository = employeeRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}


	// =========================================
	// REGISTER
	// =========================================

	@Transactional
	public String register(RegisterRequest request) {

		// =========================================
		// CHECK USER
		// =========================================

		if (userRepository
				.findByEmail(request.getEmail())
				.isPresent()) {

			return "User Already exists";
		}


		// =========================================
		// CREATE USER
		// =========================================

		User user = new User();

		user.setName(request.getName());

		user.setEmail(request.getEmail());

		user.setPassword(
				passwordEncoder.encode(
						request.getPassword()
				)
		);

		// Public registration can ONLY create employees
		user.setRole(Role.EMPLOYEE);


		User savedUser =
				userRepository.save(user);


		// =========================================
		// CREATE EMPLOYEE PROFILE
		// =========================================

		Employee employee = new Employee();


		// Generate employee code automatically
		employee.setEmployeeCode(
				"EMP-" +
						UUID.randomUUID()
								.toString()
								.substring(0, 8)
								.toUpperCase()
		);


		// =========================================
		// HANDLE NAME
		// =========================================

		String fullName =
				request.getName().trim();

		String[] nameParts =
				fullName.split("\\s+", 2);


		// First name
		employee.setFirstName(
				nameParts[0]
		);


		// Last name
		if (nameParts.length > 1) {

			employee.setLastName(
					nameParts[1]
			);

		} else {

			employee.setLastName("");
		}


		// =========================================
		// EMPLOYEE LOGIN EMAIL
		// =========================================

		employee.setEmail(
				request.getEmail()
		);


		// =========================================
		// DEFAULT VALUES
		// =========================================

		employee.setDepartment(
				"Not Assigned"
		);

		employee.setDesignation(
				"Employee"
		);


		// =========================================
		// SAVE EMPLOYEE
		// =========================================

		employeeRepository.save(employee);


		return "User Registered Successfully";
	}


	// =========================================
	// LOGIN
	// =========================================

	public LoginResponse login(LoginRequest request) {

		User user =
				userRepository
						.findByEmail(request.getEmail())
						.orElse(null);


		if (user == null) {

			throw new RuntimeException(
					"User not found"
			);
		}


		boolean match =
				passwordEncoder.matches(
						request.getPassword(),
						user.getPassword()
				);


		if (!match) {

			throw new RuntimeException(
					"Invalid Password"
			);
		}


		String token =
				jwtService.generateToken(
						user.getEmail(),
						user.getRole().name()
				);


		return new LoginResponse(
				token,
				user.getRole().name()
		);
	}
}