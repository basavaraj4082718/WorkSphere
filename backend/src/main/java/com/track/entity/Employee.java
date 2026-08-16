package com.track.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.OneToOne;



@Entity
@Table(name = "employee")
public class Employee {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String employeeCode;
	private String firstName;
	private String lastName;
	private String email;
	private String department;
	private String designation;
	@ManyToOne
	@JoinColumn(name = "manager_id")
	private Manager manager;
	
	@OneToMany(mappedBy = "employee")
	private List<Task> tasks;
	
	@OneToMany(mappedBy = "employee")
	private List<Review> reviews;
	
	@OneToMany(mappedBy = "employee")
	private List<LeaveRequest> leaveRequests;

	@OneToOne
	@JoinColumn(name = "user_id", unique = true)
	private User user;
	
	
	public Employee() {
		
	}
	public Employee(Long id, String employeeCode, String firstName, String lastName, String email, String department,
			String designation, User user) {
		super();
		this.id = id;
		this.employeeCode = employeeCode;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.department = department;
		this.designation = designation;
		this.user = user;
	}


	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getEmployeeCode() {
		return employeeCode;
	}
	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getDesignation() {
		return designation;
	}
	public void setDesignation(String designation) {
		this.designation = designation;
	}
	public Manager getManager() {
	    return manager;
	}

	public void setManager(Manager manager) {
	    this.manager = manager;
	}

	public List<Task> getTasks() {
		return tasks;
	}
	public void setTasks(List<Task> tasks) {
		this.tasks = tasks;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
















}
