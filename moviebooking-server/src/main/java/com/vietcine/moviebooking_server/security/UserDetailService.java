package com.vietcine.moviebooking_server.security;

import com.vietcine.moviebooking_server.entity.User;
import com.vietcine.moviebooking_server.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailService implements UserDetailsService {
    @Autowired
    private IUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmail(username);
        if (user.isPresent()) {
            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.get().getEmail())
                    .password(user.get().getPasswordHash())
                    .roles(user.get().getRole())
                    .build();
        }
        throw new UsernameNotFoundException("Account not found in database");
    }
}
