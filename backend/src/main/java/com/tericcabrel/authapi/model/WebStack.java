package com.tericcabrel.authapi.model;


import jakarta.persistence.*;


@Entity
@Table(name = "web_stacks")
public class WebStack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "technology", nullable = false)
    public String technology;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTechnology() {
        return technology;
    }

    public void setTechnology(String technology) {
        this.technology = technology;
    }
}
