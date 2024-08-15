package com.tericcabrel.authapi.services;


import com.tericcabrel.authapi.dtos.RegisterUserDto;
import com.tericcabrel.authapi.entities.User;
import com.tericcabrel.authapi.model.Jobposting;
import com.tericcabrel.authapi.repositories.JobPostingRepo;
import com.tericcabrel.authapi.repositories.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private  UserRepository userRepository;

    @Autowired
    private JobPostingRepo  jobRepo;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users;
    }

     @Transactional
    public Jobposting saveJobposting(Jobposting job) {
        return jobRepo.save(job);
    }

    public List<Jobposting> alljobs()
    {
         return jobRepo.findAll();
    }

    public List<Jobposting> filter(String email) {
        System.out.println("Filtering jobs for email: " + email);
        List<Jobposting> jobs = jobRepo.filterr(email);
        System.out.println("Filtered jobs: " + jobs);
        return jobs;
    }

    public List<Jobposting> findJobPostings(String jobTitle, String location, Integer duration, Integer stipendMin, Integer stipendMax) {
        return jobRepo.findJobPostings(jobTitle, location, duration, stipendMin, stipendMax);
    }

    public User updateUser(String email, RegisterUserDto registerUserDto) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setFullName(registerUserDto.getFullName());
            user.setEmail(registerUserDto.getEmail());
            user.setPassword(registerUserDto.getPassword());
            if (registerUserDto.getProfileImageUrl() != null && !registerUserDto.getProfileImageUrl().equals("null")) {
                user.setProfileImageUrl(registerUserDto.getProfileImageUrl());
            }
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public Jobposting updateJob(Long id, Jobposting jobPosting) {
        if (jobRepo.existsById(id)) {
            jobPosting.setId(id); // Ensure ID is set
            return jobRepo.save(jobPosting);
        } else {
            return null;
        }
    }

    @Transactional
    public void del(Long id) {
        // Check if the user exists before attempting to delete
        if (jobRepo.existsById(id)) {
            jobRepo.deleteById(id);
            System.out.println("User with ID " + id + " deleted successfully.");
        } else {
            System.out.println("User with ID " + id + " does not exist.");
        }
    }
    
}
