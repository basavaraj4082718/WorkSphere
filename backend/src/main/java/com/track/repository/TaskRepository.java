package com.track.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.track.entity.Task;
import com.track.enums.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByEmployeeId(Long employeeId);

    List<Task> findByManagerId(Long managerId);

    long countByEmployeeId(Long employeeId);

    long countByEmployeeIdAndStatus(
            Long employeeId,
            TaskStatus status
    );

    long countByStatus(TaskStatus status);

    long countByManagerId(Long managerId);

    long countByManagerIdAndStatus(
            Long managerId,
            TaskStatus status
    );

    // =========================================
    // DELETE TASKS OF ONE EMPLOYEE
    // =========================================

    void deleteByEmployeeId(Long employeeId);

    // =========================================
    // DELETE TASKS OF ONE MANAGER
    // =========================================

    void deleteByManagerId(Long managerId);
}