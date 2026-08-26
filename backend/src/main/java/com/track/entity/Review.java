package com.track.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer rating;

    private String comments;

    private LocalDate reviewDate;


    // =========================================
    // EMPLOYEE
    // =========================================

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = true)
    private Employee employee;


    // =========================================
    // MANAGER
    // =========================================

    @ManyToOne
    @JoinColumn(name = "manager_id", nullable = true)
    private Manager manager;


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public Review() {
    }


    public Review(
            Long id,
            Integer rating,
            String comments,
            LocalDate reviewDate,
            Employee employee,
            Manager manager) {

        this.id = id;
        this.rating = rating;
        this.comments = comments;
        this.reviewDate = reviewDate;
        this.employee = employee;
        this.manager = manager;
    }


    // =========================================
    // GETTERS / SETTERS
    // =========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }


    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }


    public LocalDate getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDate reviewDate) {
        this.reviewDate = reviewDate;
    }


    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }


    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
    }
}