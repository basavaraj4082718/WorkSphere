package com.track.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.track.dto.LeaveRequestDto;
import com.track.dto.LeaveResponseDto;
import com.track.entity.Employee;
import com.track.entity.LeaveRequest;
import com.track.entity.Manager;
import com.track.enums.LeaveStatus;
import com.track.repository.EmployeeRepository;
import com.track.repository.LeaveRequestRepository;
import com.track.repository.ManagerRepository;

@Service
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRequestRepository leaveRepository;
    private final EmployeeRepository employeeRepository;
    private final ManagerRepository managerRepository;

    public LeaveServiceImpl(
            LeaveRequestRepository leaveRepository,
            EmployeeRepository employeeRepository,
            ManagerRepository managerRepository) {

        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
        this.managerRepository = managerRepository;
    }

    // =====================================================
    // APPLY LEAVE
    // =====================================================

    @Override
    public LeaveResponseDto applyLeave(
            LeaveRequestDto requestDto) {

        Employee employee = employeeRepository
                .findById(requestDto.getEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found"));

        LeaveRequest leave = new LeaveRequest();

        leave.setEmployee(employee);
        leave.setStartDate(requestDto.getStartDate());
        leave.setEndDate(requestDto.getEndDate());
        leave.setReason(requestDto.getReason());
        leave.setAppliedDate(LocalDate.now());
        leave.setStatus(LeaveStatus.PENDING);

        LeaveRequest savedLeave =
                leaveRepository.save(leave);

        return mapToDto(savedLeave);
    }

    // =====================================================
    // APPROVE LEAVE
    // =====================================================

    @Override
    public LeaveResponseDto approveLeave(
            Long leaveId) {

        LeaveRequest leave =
                leaveRepository.findById(leaveId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Leave request not found"));

        leave.setStatus(LeaveStatus.APPROVED);

        LeaveRequest updatedLeave =
                leaveRepository.save(leave);

        return mapToDto(updatedLeave);
    }

    // =====================================================
    // REJECT LEAVE
    // =====================================================

    @Override
    public LeaveResponseDto rejectLeave(
            Long leaveId) {

        LeaveRequest leave =
                leaveRepository.findById(leaveId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Leave request not found"));

        leave.setStatus(LeaveStatus.REJECTED);

        LeaveRequest updatedLeave =
                leaveRepository.save(leave);

        return mapToDto(updatedLeave);
    }

    // =====================================================
    // GET EMPLOYEE LEAVES
    // =====================================================

    @Override
    public List<LeaveResponseDto> getEmployeeLeaves(
            Long employeeId) {

        return leaveRepository
                .findByEmployeeId(employeeId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // =====================================================
    // GET ALL LEAVES - ADMIN
    // =====================================================

    @Override
    public List<LeaveResponseDto> getAllLeaves() {

        return leaveRepository
                .findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // =====================================================
    // GET LOGGED-IN MANAGER TEAM LEAVES
    // =====================================================

    @Override
    public List<LeaveResponseDto> getManagerTeamLeaves(
            String managerEmail) {

        Manager manager = managerRepository
                .findByEmail(managerEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Manager not found"));

        return leaveRepository
                .findByEmployeeManagerId(manager.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // =====================================================
    // MAP ENTITY TO DTO
    // =====================================================

    private LeaveResponseDto mapToDto(
            LeaveRequest leave) {

        LeaveResponseDto dto =
                new LeaveResponseDto();

        dto.setLeaveId(leave.getId());

        dto.setEmployeeName(
                leave.getEmployee().getFirstName()
                        + " "
                        + leave.getEmployee().getLastName());

        dto.setStartDate(
                leave.getStartDate());

        dto.setEndDate(
                leave.getEndDate());

        dto.setReason(
                leave.getReason());

        dto.setStatus(
                leave.getStatus().name());

        return dto;
    }
}