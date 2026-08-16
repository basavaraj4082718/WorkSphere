package com.track.controller;

import com.track.dto.AdminDashboardResponseDto;
import com.track.dto.EmployeeDashboardResponseDto;
import com.track.dto.ManagerDashboardResponseDto;
import com.track.entity.Employee;
import com.track.entity.Manager;
import com.track.entity.User;
import com.track.repository.EmployeeRepository;
import com.track.repository.ManagerRepository;
import com.track.repository.UserRepository;
import com.track.service.DashboardService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final ManagerRepository managerRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public DashboardController(
            DashboardService dashboardService,
            ManagerRepository managerRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository) {

        this.dashboardService = dashboardService;
        this.managerRepository = managerRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }


    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    @GetMapping("/admin")
    public AdminDashboardResponseDto getAdminDashboard() {

        return dashboardService.getAdminDashboard();
    }


    // ==========================================
    // EMPLOYEE DASHBOARD BY ID
    // ==========================================

    @GetMapping("/employee/{employeeId}")
    public EmployeeDashboardResponseDto getEmployeeDashboard(
            @PathVariable Long employeeId) {

        return dashboardService.getEmployeeDashboard(employeeId);
    }


    // ==========================================
    // LOGGED-IN EMPLOYEE DASHBOARD
    // ==========================================

    @GetMapping("/employee/me")
    public EmployeeDashboardResponseDto getMyEmployeeDashboard(
            Authentication authentication) {

        // Get email from logged-in JWT
        String email = authentication.getName();


        // ==========================================
        // FIND USER
        // ==========================================

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found for email: " + email
                        )
                );


        // ==========================================
        // FIND EMPLOYEE USING USER ID
        // ==========================================

        Employee employee = employeeRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee profile not linked to user: "
                                        + email
                        )
                );


        // ==========================================
        // GET EMPLOYEE DASHBOARD
        // ==========================================

        return dashboardService.getEmployeeDashboard(
                employee.getId()
        );
    }


    // ==========================================
    // MANAGER DASHBOARD BY ID
    // ==========================================

    @GetMapping("/manager/{managerId}")
    public ManagerDashboardResponseDto getManagerDashboard(
            @PathVariable Long managerId) {

        return dashboardService.getManagerDashboard(managerId);
    }


    // ==========================================
    // LOGGED-IN MANAGER DASHBOARD
    // ==========================================

    @GetMapping("/manager/me")
    public ManagerDashboardResponseDto getMyManagerDashboard(
            Authentication authentication) {

        String email = authentication.getName();

        Manager manager = managerRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Manager profile not found for email: "
                                        + email
                        )
                );

        return dashboardService.getManagerDashboard(
                manager.getId()
        );
    }
}