package tn.tekup.smartenergy.dto;

import jakarta.validation.constraints.*;
import tn.tekup.smartenergy.entity.*;

public class BuildingDtos {
    public record BuildingRequest(@NotBlank String nom, @NotBlank String type, @Positive double surface,
                                  String adresse, String ville, @NotNull BuildingStatus status) {}
    public record BuildingResponse(Long id, String nom, String type, double surface, String adresse, String ville, BuildingStatus status) {
        public static BuildingResponse of(Building b) { return new BuildingResponse(b.getId(), b.getNom(), b.getType(), b.getSurface(), b.getAdresse(), b.getVille(), b.getStatus()); }
    }
}
