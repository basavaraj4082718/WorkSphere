package com.track.service;

import java.util.List;

import com.track.dto.TaskRequestDto;
import com.track.dto.TaskResponseDto;
import com.track.dto.TaskStatusUpdateDto;

public interface TaskService {

    TaskResponseDto createTask(TaskRequestDto requestDto);

    List<TaskResponseDto> getAllTasks();

    List<TaskResponseDto> getTasksByEmployee(Long employeeId);

    TaskResponseDto getTaskById(Long id);

    TaskResponseDto updateTask(Long id, TaskRequestDto requestDto);

    void deleteTask(Long id);

    TaskResponseDto assignEmployeeToTask(
            Long taskId,
            Long employeeId
    );

    TaskResponseDto assignManagerToTask(
            Long taskId,
            Long managerId
    );

    TaskResponseDto updateTaskStatus(
            Long taskId,
            TaskStatusUpdateDto statusDto
    );
}