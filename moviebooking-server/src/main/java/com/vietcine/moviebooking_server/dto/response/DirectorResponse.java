package com.vietcine.moviebooking_server.dto.response;

import com.vietcine.moviebooking_server.entity.Director;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DirectorResponse {
    private Integer id;
    private String name;
    private String avatar;

    public DirectorResponse(Director director) {
        this.id = director.getId();
        this.name = director.getName();
        this.avatar = director.getAvatar();
    }
}
