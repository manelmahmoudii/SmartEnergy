package tn.tekup.smartenergy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.tekup.smartenergy.dto.BuildingDtos.*;
import tn.tekup.smartenergy.service.BuildingService;
import java.util.List;

@RestController @RequestMapping("/api/buildings") @RequiredArgsConstructor
public class BuildingController {
    private final BuildingService service;

    @GetMapping public List<BuildingResponse> all() { return service.all(); }
    @GetMapping("/{id}") public BuildingResponse one(@PathVariable Long id) { return service.one(id); }
    @PostMapping @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.CREATED)
    public BuildingResponse create(@Valid @RequestBody BuildingRequest r) { return service.create(r); }
    @PutMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    public BuildingResponse update(@PathVariable Long id, @Valid @RequestBody BuildingRequest r) { return service.update(id, r); }
    @DeleteMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
