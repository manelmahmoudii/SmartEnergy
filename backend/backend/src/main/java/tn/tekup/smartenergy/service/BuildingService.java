package tn.tekup.smartenergy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tekup.smartenergy.dto.BuildingDtos.*;
import tn.tekup.smartenergy.entity.Building;
import tn.tekup.smartenergy.exception.ApiException;
import tn.tekup.smartenergy.repository.BuildingRepository;
import java.util.List;

@Service @RequiredArgsConstructor @Transactional
public class BuildingService {
    private final BuildingRepository repo;

    private Building get(Long id) { return repo.findById(id).orElseThrow(() -> ApiException.notFound("Bâtiment introuvable")); }
    private void apply(Building b, BuildingRequest r) {
        b.setNom(r.nom()); b.setType(r.type()); b.setSurface(r.surface());
        b.setAdresse(r.adresse()); b.setVille(r.ville()); b.setStatus(r.status());
    }

    @Transactional(readOnly = true) public List<BuildingResponse> all() { return repo.findAll().stream().map(BuildingResponse::of).toList(); }
    @Transactional(readOnly = true) public BuildingResponse one(Long id) { return BuildingResponse.of(get(id)); }
    public BuildingResponse create(BuildingRequest r) { var b = new Building(); apply(b, r); return BuildingResponse.of(repo.save(b)); }
    public BuildingResponse update(Long id, BuildingRequest r) { var b = get(id); apply(b, r); return BuildingResponse.of(b); }
    public void delete(Long id) { repo.delete(get(id)); }
}
