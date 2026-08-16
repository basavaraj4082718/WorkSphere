package com.track.service;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.track.dto.TaskRequestDto;
import com.track.dto.TaskResponseDto;
import com.track.entity.Employee;
import com.track.entity.Manager;
import com.track.entity.Task;
import com.track.repository.EmployeeRepository;
import com.track.repository.ManagerRepository;
import com.track.repository.TaskRepository;
import com.track.dto.TaskStatusUpdateDto;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final ManagerRepository managerRepository;

    public TaskServiceImpl(
            TaskRepository taskRepository,
            EmployeeRepository employeeRepository,
            ManagerRepository managerRepository) {

        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
        this.managerRepository = managerRepository;
    }

    @Override
    public TaskResponseDto createTask(TaskRequestDto requestDto) {

        Task task = new Task();

        task.setTitle(requestDto.getTitle());
        task.setDescription(requestDto.getDescription());
        task.setPriority(requestDto.getPriority());
        task.setDeadline(requestDto.getDeadline());

        Task savedTask = taskRepository.save(task);

        return mapToDto(savedTask);
    }

    @Override
    public List<TaskResponseDto> getAllTasks() {

        return taskRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponseDto getTaskById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        return mapToDto(task);
    }

    @Override
    public TaskResponseDto updateTask(Long id, TaskRequestDto requestDto) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(requestDto.getTitle());
        task.setDescription(requestDto.getDescription());
        task.setPriority(requestDto.getPriority());
        task.setDeadline(requestDto.getDeadline());

        Task updatedTask = taskRepository.save(task);

        return mapToDto(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        taskRepository.delete(task);
    }
    
    @Override
    public TaskResponseDto assignEmployeeToTask(
            Long taskId,
            Long employeeId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        Employee employee =
                employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        task.setEmployee(employee);

        Task updatedTask = taskRepository.save(task);

        return mapToDto(updatedTask);
    }
    
    @Override
    public TaskResponseDto assignManagerToTask(
            Long taskId,
            Long managerId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        Manager manager =
                managerRepository.findById(managerId)
                .orElseThrow(() ->
                        new RuntimeException("Manager not found"));

        task.setManager(manager);

        Task updatedTask = taskRepository.save(task);

        return mapToDto(updatedTask);
    }
    
    @Override
    public TaskResponseDto updateTaskStatus(
            Long taskId,
            TaskStatusUpdateDto statusDto) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        task.setStatus(statusDto.getStatus());

        Task updatedTask = taskRepository.save(task);

        return mapToDto(updatedTask);
    }

    @Override
    public List<TaskResponseDto> getTasksByEmployee(Long employeeId) {

        return taskRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }



    private TaskResponseDto mapToDto(Task task) {

        TaskResponseDto dto = new TaskResponseDto();

        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDeadline(task.getDeadline());
        dto.setCreatedAt(task.getCreatedAt());

        if (task.getEmployee() != null) {
            dto.setEmployeeId(task.getEmployee().getId());
            dto.setEmployeeName(
                task.getEmployee().getFirstName() + " " +
                task.getEmployee().getLastName()
            );
        }

        if (task.getManager() != null) {
            dto.setManagerId(task.getManager().getId());
            dto.setManagerName(
                task.getManager().getFirstName() + " " +
                task.getManager().getLastName()
            );
        }

        return dto;
    }
}
