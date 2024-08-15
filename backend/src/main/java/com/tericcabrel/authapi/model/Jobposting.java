package com.tericcabrel.authapi.model;



import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_postings")
public class    Jobposting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false, length = 255)
    private String companyName;

    @Column(name = "job_link", nullable = false, length = 255)
    private String jobLink;

    public String getJobLink() {
        return jobLink;
    }

    public void setJobLink(String jobLink) {
        this.jobLink = jobLink;
    }

    @Column(name = "job_title", nullable = false, length = 255)
    private String jobTitle;

    @Column(name = "job_description", nullable = false, columnDefinition = "TEXT")
    private String jobDescription;

    @Column(name = "location", nullable = false, length = 255)
    private String location;

    @Column(name = "duration", nullable = false)
    private Integer duration;

    @Column(name = "stipend", nullable = false, length = 50)
    private String stipend;

    @Column(name = "apply_by", nullable = false)
    private LocalDate applyBy;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "job_posting_id")
    public List<WebStack> webStacks = new ArrayList<>();

    @Column(name = "requirements", nullable = false, columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "perks", columnDefinition = "TEXT")
    private String perks;

    @Column(name = "contact_email", nullable = false, length = 255)
    private String contactEmail;

    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDate.now();
        if (this.applyBy == null) {
            this.applyBy = this.createdAt.plusDays(30); // Default to 30 days from creation
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getStipend() {
        return stipend;
    }

    public void setStipend(String stipend) {
        this.stipend = stipend;
    }

    public LocalDate getApplyBy() {
        return applyBy;
    }

    public void setApplyBy(LocalDate applyBy) {
        this.applyBy = applyBy;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public List<WebStack> getWebStacks() {
        return webStacks;
    }

    public void setWebStacks(List<WebStack> webStacks) {
        this.webStacks = webStacks;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getPerks() {
        return perks;
    }

    public void setPerks(String perks) {
        this.perks = perks;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
}
