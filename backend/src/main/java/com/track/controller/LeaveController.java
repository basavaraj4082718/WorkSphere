package com.track.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.track.dto.LeaveRequestDto;
import com.track.dto.LeaveResponseDto;
import com.track.service.LeaveService;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // =====================================================
    // APPLY LEAVE
    // =====================================================

    @PostMapping("/apply")
    public LeaveResponseDto applyLeave(
            @RequestBody LeaveRequestDto requestDto) {

        return leaveService.applyLeave(requestDto);
    }

    // =====================================================
    // APPROVE LEAVE
    // =====================================================

    @PutMapping("/{leaveId}/approve")
    public LeaveResponseDto approveLeave(
            @PathVariable Long leaveId) {

        return leaveService.approveLeave(leaveId);
    }

    // =====================================================
    // REJECT LEAVE
    // =====================================================

    @PutMapping("/{leaveId}/reject")
    public LeaveResponseDto rejectLeave(
            @PathVariable Long leaveId) {

        return leaveService.rejectLeave(leaveId);
    }

    // =====================================================
    // GET EMPLOYEE LEAVES
    // =====================================================

    @GetMapping("/employee/{employeeId}")
    public List<LeaveResponseDto> getEmployeeLeaves(
            @PathVariable Long employeeId) {

        return leaveService.getEmployeeLeaves(employeeId);
    }

    // =====================================================
    // GET ALL LEAVES - ADMIN
    // =====================================================

    @GetMapping("/all")
    public List<LeaveResponseDto> getAllLeaves() {

        return leaveService.getAllLeaves();
    }

    // =====================================================
    // GET LOGGED-IN MANAGER TEAM LEAVES
    // =====================================================

    @GetMapping("/manager/me")
    public List<LeaveResponseDto> getManagerTeamLeaves(
            Authentication authentication) {

        String managerEmail = authentication.getName();

        return leaveService.getManagerTeamLeaves(managerEmail);
    }
}