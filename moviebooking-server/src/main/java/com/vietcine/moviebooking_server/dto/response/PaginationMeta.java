package com.vietcine.moviebooking_server.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaginationMeta {
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;
}
