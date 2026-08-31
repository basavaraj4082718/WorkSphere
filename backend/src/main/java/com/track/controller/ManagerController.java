package com.track.controller;

import com.track.dto.ManagerRequestDto;
import com.track.dto.ManagerResponseDto;
import com.track.service.ManagerService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @PostMapping
    public ResponseEntity<ManagerResponseDto> createManager(
            @Valid @RequestBody ManagerRequestDto requestDto) {

        ManagerResponseDto response =
                managerService.createManager(requestDto);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<ManagerResponseDto>> getAllManagers() {

        return ResponseEntity.ok(
                managerService.getAllManagers()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManagerResponseDto> getManagerById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                managerService.getManagerById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ManagerResponseDto> updateManager(
            @PathVariable Long id,
            @RequestBody ManagerRequestDto requestDto) {

        return ResponseEntity.ok(
                managerService.updateManager(id, requestDto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteManager(
            @PathVariable Long id) {

        managerService.deleteManager(id);

        return ResponseEntity.ok(
                "Manager deleted successfully"
        );
    }
}