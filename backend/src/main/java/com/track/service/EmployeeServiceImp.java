package com.track.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.track.dto.EmployeeRequestDto;
import com.track.dto.EmployeeResponseDto;
import com.track.entity.Employee;
import com.track.entity.Manager;
import com.track.entity.User;
import com.track.enums.Role;
import com.track.repository.EmployeeRepository;
import com.track.repository.ManagerRepository;
import com.track.repository.ReviewRepository;
import com.track.repository.TaskRepository;
import com.track.repository.UserRepository;

@Service
public class EmployeeServiceImp implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;


    public EmployeeServiceImp(
            EmployeeRepository employeeRepository,
            ManagerRepository managerRepository,
            UserRepository userRepository,
            TaskRepository taskRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder) {

        this.employeeRepository = employeeRepository;
        this.managerRepository = managerRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // =========================================================
    // CREATE EMPLOYEE
    // =========================================================

    @Override
    @Transactional
    public EmployeeResponseDto createEmployee(
            EmployeeRequestDto requestDto) {

        if (employeeRepository.existsByEmployeeCode(
                requestDto.getEmployeeCode())) {

            throw new RuntimeException(
                    "Employee code already exists");
        }

        if (employeeRepository.existsByEmail(
                requestDto.getEmail())) {

            throw new RuntimeException(
                    "Employee email already exists");
        }

        if (userRepository.findByEmail(
                requestDto.getEmail()).isPresent()) {

            throw new RuntimeException(
                    "A user with this email already exists");
        }


        // CREATE USER

        User user = new User();

        user.setName(
                requestDto.getFirstName()
                        + " "
                        + requestDto.getLastName());

        user.setEmail(
                requestDto.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        requestDto.getPassword()));

        user.setRole(Role.EMPLOYEE);


        User savedUser =
                userRepository.save(user);


        // CREATE EMPLOYEE

        Employee employee = new Employee();

        employee.setEmployeeCode(
                requestDto.getEmployeeCode());

        employee.setFirstName(
                requestDto.getFirstName());

        employee.setLastName(
                requestDto.getLastName());

        employee.setEmail(
                requestDto.getEmail());

        employee.setDepartment(
                requestDto.getDepartment());

        employee.setDesignation(
                requestDto.getDesignation());

        employee.setUser(savedUser);


        Employee savedEmployee =
                employeeRepository.save(employee);


        return mapToResponseDto(savedEmployee);
    }


    // =========================================================
    // GET EMPLOYEE BY ID
    // =========================================================

    @Override
    public EmployeeResponseDto getEmployeeById(Long id) {

        Employee employee =
                employeeRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found with id: "
                                                + id));

        return mapToResponseDto(employee);
    }


    // =========================================================
    // GET ALL EMPLOYEES
    // =========================================================

    @Override
    public List<EmployeeResponseDto> getAllEmployees() {

        return employeeRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }


    // =========================================================
    // UPDATE EMPLOYEE
    // =========================================================

    @Override
    @Transactional
    public EmployeeResponseDto updateEmployee(
            Long id,
            EmployeeRequestDto requestDto) {

        Employee employee =
                employeeRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found with id: "
                                                + id));


        employee.setEmployeeCode(
                requestDto.getEmployeeCode());

        employee.setFirstName(
                requestDto.getFirstName());

        employee.setLastName(
                requestDto.getLastName());

        employee.setEmail(
                requestDto.getEmail());

        employee.setDepartment(
                requestDto.getDepartment());

        employee.setDesignation(
                requestDto.getDesignation());


        // UPDATE USER DETAILS

        User user = employee.getUser();

        if (user != null) {

            user.setName(
                    requestDto.getFirstName()
                            + " "
                            + requestDto.getLastName());

            user.setEmail(
                    requestDto.getEmail());


            if (requestDto.getPassword() != null
                    && !requestDto.getPassword().isBlank()) {

                user.setPassword(
                        passwordEncoder.encode(
                                requestDto.getPassword()));
            }

            userRepository.save(user);
        }


        Employee updatedEmployee =
                employeeRepository.save(employee);

        return mapToResponseDto(updatedEmployee);
    }


    // =========================================================
    // DELETE EMPLOYEE
    // =========================================================

    @Override
    @Transactional
    public void deleteEmployee(Long id) {

        Employee employee =
                employeeRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found with id: "
                                                + id));


        // Store user before deleting employee
        User user = employee.getUser();


        // ==========================================
        // 1. DELETE EMPLOYEE REVIEWS
        // ==========================================

        reviewRepository.deleteByEmployeeId(id);


        // ==========================================
        // 2. DELETE EMPLOYEE TASKS
        // ==========================================

        taskRepository.deleteByEmployeeId(id);


        // ==========================================
        // 3. DELETE EMPLOYEE
        // ==========================================

        employeeRepository.delete(employee);


        // ==========================================
        // 4. DELETE EMPLOYEE LOGIN USER
        // ==========================================

        if (user != null) {

            userRepository.delete(user);
        }
    }


    // =========================================================
    // ASSIGN MANAGER
    // =========================================================

    @Override
    @Transactional
    public EmployeeResponseDto assignManager(
            Long employeeId,
            Long managerId) {

        Employee employee =
                employeeRepository.findById(employeeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found"));

        Manager manager =
                managerRepository.findById(managerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Manager not found"));

        employee.setManager(manager);

        Employee savedEmployee =
                employeeRepository.save(employee);

        return mapToResponseDto(savedEmployee);
    }


    // =========================================================
    // MAP RESPONSE DTO
    // =========================================================

    private EmployeeResponseDto mapToResponseDto(
            Employee employee) {

        Long managerId = null;
        String managerName = null;


        if (employee.getManager() != null) {

            managerId =
                    employee.getManager().getId();

            managerName =
                    employee.getManager().getFirstName()
                            + " "
                            + employee.getManager().getLastName();
        }


        return new EmployeeResponseDto(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getDepartment(),
                employee.getDesignation(),
                managerId,
                managerName
        );
    }
}

