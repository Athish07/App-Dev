package com.tericcabrel.authapi.controllers;

import com.tericcabrel.authapi.dtos.RegisterUserDto;
import com.tericcabrel.authapi.entities.User;
import com.tericcabrel.authapi.model.Jobposting;
import com.tericcabrel.authapi.services.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping
    public ResponseEntity<List<User>> allUsers() {
        List<User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/joblisting")
    public List<Jobposting> addresslistng() {
        return userService.alljobs();
    }

    @PostMapping("/jobposting")
    public ResponseEntity<Jobposting> postJobposting(@RequestBody Jobposting job) {
        try {
            System.out.println("Received Jobposting: " + job);
            if (job.getJobLink() == null || job.getJobLink().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            if (job.getApplyBy() == null) {
                job.setApplyBy(LocalDate.now().plusDays(30));
            }
            Jobposting savedJob = userService.saveJobposting(job);
            return ResponseEntity.ok(savedJob);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/filter/{email}")
    public ResponseEntity<List<Jobposting>> filterJobPostings(@PathVariable String email) {
        try {
            List<Jobposting> filteredJobs = userService.filter(email);
            return ResponseEntity.ok(filteredJobs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public List<Jobposting> searchJobPostings(
            @RequestParam(required = false) String jobTitle,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer duration,
            @RequestParam(required = false) Integer stipendMin,
            @RequestParam(required = false) Integer stipendMax
    ) {
        return userService.findJobPostings(jobTitle, location, duration, stipendMin, stipendMax);
    }

    @PutMapping("/email/{email}")
public ResponseEntity<User> updateUser(@PathVariable String email, @RequestBody RegisterUserDto registerUserDto) {
    try {
        System.out.println(registerUserDto);
        User updatedUser = userService.updateUser(email, registerUserDto);
        return ResponseEntity.ok(updatedUser);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

@PutMapping("/id/{id}")
public ResponseEntity<Jobposting> updateJob(@PathVariable Long id, @RequestBody Jobposting jobPosting) {
    Jobposting updatedJob = userService.updateJob(id, jobPosting);
    if (updatedJob != null) {
        return ResponseEntity.ok(updatedJob);
    } else {
        return ResponseEntity.notFound().build();
    }
}

@DeleteMapping("/delete/{id}")
public String delbyId(@PathVariable Long id) {

    userService.del(id);

    return "successful";


}




}
