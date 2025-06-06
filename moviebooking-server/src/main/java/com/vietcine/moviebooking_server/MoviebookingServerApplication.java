package com.vietcine.moviebooking_server;

import com.vietcine.moviebooking_server.service.user.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class MoviebookingServerApplication {

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(MoviebookingServerApplication.class, args);
	}

}
