package com.tericcabrel.authapi.repositories;

import java.util.List;

import org.springframework.boot.autoconfigure.batch.BatchProperties.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.Param;

import com.tericcabrel.authapi.model.Jobposting;



public interface JobPostingRepo extends JpaRepository<Jobposting, Long> {
    @Query(value = "SELECT p.* FROM job_postings p JOIN users l ON p.contact_email = l.email WHERE l.email = ?1", nativeQuery = true)
    List<Jobposting> filterr(String email);
   

    @Query(value = "SELECT * FROM job_postings jp WHERE "
            + "(:jobTitle IS NULL OR jp.job_title LIKE CONCAT('%', :jobTitle, '%')) "
            + "AND (:location IS NULL OR jp.location LIKE CONCAT('%', :location, '%')) "
            + "AND (:duration IS NULL OR jp.duration = :duration) "
            + "AND (:stipendMin IS NULL OR CAST(jp.stipend AS UNSIGNED) >= :stipendMin) "
            + "AND (:stipendMax IS NULL OR CAST(jp.stipend AS UNSIGNED) <= :stipendMax)", nativeQuery = true)
    List<Jobposting> findJobPostings(
            @Param("jobTitle") String jobTitle,
            @Param("location") String location,
            @Param("duration") Integer duration,
            @Param("stipendMin") Integer stipendMin,
            @Param("stipendMax") Integer stipendMax
    );


}
