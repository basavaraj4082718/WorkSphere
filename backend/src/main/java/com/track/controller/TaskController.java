package com.track.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.track.dto.TaskRequestDto;
import com.track.dto.TaskResponseDto;
import com.track.service.TaskService;

import jakarta.validation.Valid;

import com.track.dto.TaskStatusUpdateDto;

@RestController
@RequestMapping("/api/tasks")
@Validated
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(
            @Valid @RequestBody TaskRequestDto requestDto) {

        return new ResponseEntity<>(
                taskService.createTask(requestDto),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getAllTasks() {

        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTaskById(
            @PathVariable Long id) {

        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDto requestDto) {

        return ResponseEntity.ok(
                taskService.updateTask(id, requestDto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Long id) {

        taskService.deleteTask(id);

        return ResponseEntity.ok("Task deleted successfully");
    }
    
    @PutMapping("/{taskId}/assign-employee/{employeeId}")
    public ResponseEntity<TaskResponseDto> assignEmployeeToTask(
            @PathVariable Long taskId,
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                taskService.assignEmployeeToTask(
                        taskId,
                        employeeId)
        );
    }
    
    @PutMapping("/{taskId}/assign-manager/{managerId}")
    public ResponseEntity<TaskResponseDto> assignManagerToTask(
            @PathVariable Long taskId,
            @PathVariable Long managerId) {

        return ResponseEntity.ok(
                taskService.assignManagerToTask(
                        taskId,
                        managerId)
        );
    }
    
    @PutMapping("/{taskId}/status")
    public ResponseEntity<TaskResponseDto> updateTaskStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskStatusUpdateDto statusDto) {

        return ResponseEntity.ok(
                taskService.updateTaskStatus(
                        taskId,
                        statusDto)
        );
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByEmployee(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                taskService.getTasksByEmployee(employeeId)
        );
    }
}