package com.track.service;

import java.util.List;

import com.track.dto.LeaveRequestDto;
import com.track.dto.LeaveResponseDto;

public interface LeaveService {

    LeaveResponseDto applyLeave(LeaveRequestDto requestDto);

    LeaveResponseDto approveLeave(Long leaveId);

    LeaveResponseDto rejectLeave(Long leaveId);

    List<LeaveResponseDto> getEmployeeLeaves(Long employeeId);

    List<LeaveResponseDto> getAllLeaves();

    List<LeaveResponseDto> getManagerTeamLeaves(String managerEmail);
}