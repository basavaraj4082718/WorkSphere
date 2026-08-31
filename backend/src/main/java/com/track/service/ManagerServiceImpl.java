package com.track.service;

import com.track.dto.ManagerRequestDto;
import com.track.dto.ManagerResponseDto;
import com.track.entity.Manager;
import com.track.entity.User;
import com.track.enums.Role;
import com.track.repository.EmployeeRepository;
import com.track.repository.ManagerRepository;
import com.track.repository.ReviewRepository;
import com.track.repository.TaskRepository;
import com.track.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManagerServiceImpl implements ManagerService {

    private final ManagerRepository managerRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public ManagerServiceImpl(
            ManagerRepository managerRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository,
            TaskRepository taskRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder) {

        this.managerRepository = managerRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================================
    // CREATE MANAGER
    // =========================================================

    @Override
    @Transactional
    public ManagerResponseDto createManager(
            ManagerRequestDto requestDto) {

        if (managerRepository.existsByManagerCode(
                requestDto.getManagerCode())) {

            throw new RuntimeException(
                    "Manager code already exists");
        }

        if (managerRepository.existsByEmail(
                requestDto.getEmail())) {

            throw new RuntimeException(
                    "Manager email already exists");
        }

        if (userRepository.findByEmail(
                requestDto.getEmail()).isPresent()) {

            throw new RuntimeException(
                    "A user with this email already exists");
        }

        Manager manager = new Manager();

        manager.setManagerCode(
                requestDto.getManagerCode());

        manager.setFirstName(
                requestDto.getFirstName());

        manager.setLastName(
                requestDto.getLastName());

        manager.setEmail(
                requestDto.getEmail());

        manager.setDepartment(
                requestDto.getDepartment());

        Manager savedManager =
                managerRepository.save(manager);

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

        user.setRole(Role.MANAGER);

        userRepository.save(user);

        return mapToResponseDto(savedManager);
    }

    // =========================================================
    // GET ALL MANAGERS - SORTED BY MANAGER CODE ASCENDING
    // =========================================================

    @Override
    public List<ManagerResponseDto> getAllManagers() {

        return managerRepository
                .findAllByOrderByManagerCodeAsc()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET MANAGER BY ID
    // =========================================================

    @Override
    public ManagerResponseDto getManagerById(Long id) {

        Manager manager =
                managerRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Manager not found"));

        return mapToResponseDto(manager);
    }

    // =========================================================
    // UPDATE MANAGER
    // =========================================================

    @Override
    @Transactional
    public ManagerResponseDto updateManager(
            Long id,
            ManagerRequestDto requestDto) {

        Manager manager =
                managerRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Manager not found"));

        manager.setManagerCode(
                requestDto.getManagerCode());

        manager.setFirstName(
                requestDto.getFirstName());

        manager.setLastName(
                requestDto.getLastName());

        manager.setEmail(
                requestDto.getEmail());

        manager.setDepartment(
                requestDto.getDepartment());

        Manager updatedManager =
                managerRepository.save(manager);

        return mapToResponseDto(updatedManager);
    }

    // =========================================================
    // DELETE MANAGER
    // =========================================================

    @Override
    @Transactional
    public void deleteManager(Long id) {

        Manager manager =
                managerRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Manager not found"));

        employeeRepository.removeManagerFromEmployees(id);

        reviewRepository.deleteByManagerId(id);

        taskRepository.deleteByManagerId(id);

        User user =
                userRepository.findByEmail(
                                manager.getEmail())
                        .orElse(null);

        if (user != null) {
            userRepository.delete(user);
        }

        managerRepository.delete(manager);
    }

    // =========================================================
    // MAP RESPONSE DTO
    // =========================================================

    private ManagerResponseDto mapToResponseDto(
            Manager manager) {

        ManagerResponseDto responseDto =
                new ManagerResponseDto();

        responseDto.setId(
                manager.getId());

        responseDto.setManagerCode(
                manager.getManagerCode());

        responseDto.setFirstName(
                manager.getFirstName());

        responseDto.setLastName(
                manager.getLastName());

        responseDto.setEmail(
                manager.getEmail());

        responseDto.setDepartment(
                manager.getDepartment());

        return responseDto;
    }
}