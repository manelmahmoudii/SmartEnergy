package tn.tekup.smartenergy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.tekup.smartenergy.dto.UserDtos.*;
import tn.tekup.smartenergy.entity.*;
import tn.tekup.smartenergy.service.UserService;
import java.util.List;

@RestController @RequestMapping("/api/users") @RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @GetMapping("/me") public UserResponse me(Authentication a) { return service.me(a.getName()); }
    @PutMapping("/me") public UserResponse updateMe(Authentication a, @Valid @RequestBody UpdateProfileRequest r) { return service.updateMe(a.getName(), r); }

    @GetMapping @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> search(@RequestParam(required = false) UserStatus status, @RequestParam(required = false) Role role, @RequestParam(required = false) String q) {
        return service.search(status, role, q);
    }
    @GetMapping("/pending") @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> pending() { return service.search(UserStatus.PENDING, null, ""); }

    @PatchMapping("/{id}/approve") @PreAuthorize("hasRole('ADMIN')") public UserResponse approve(@PathVariable Long id) { return service.setStatus(id, UserStatus.APPROVED); }
    @PatchMapping("/{id}/reject") @PreAuthorize("hasRole('ADMIN')") public UserResponse reject(@PathVariable Long id) { return service.setStatus(id, UserStatus.REJECTED); }
    @PatchMapping("/{id}/ban") @PreAuthorize("hasRole('ADMIN')") public UserResponse ban(@PathVariable Long id) { return service.setStatus(id, UserStatus.BANNED); }

    @PostMapping @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody CreateUserRequest r) { return service.create(r); }
    @PutMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    public UserResponse update(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest r) { return service.update(id, r); }
    @DeleteMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
