package com.track.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.track.entity.LeaveRequest;
import com.track.enums.LeaveStatus;

public interface LeaveRequestRepository
        extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployeeId(Long employeeId);

    List<LeaveRequest> findByStatus(LeaveStatus status);

    List<LeaveRequest> findByEmployeeManagerId(Long managerId);
}