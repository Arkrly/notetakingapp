package com.notetakingapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.notetakingapp.entity")
public class NotetakingappApplication {

	public static void main(String[] args) {
		SpringApplication.run(NotetakingappApplication.class, args);
	}

}
