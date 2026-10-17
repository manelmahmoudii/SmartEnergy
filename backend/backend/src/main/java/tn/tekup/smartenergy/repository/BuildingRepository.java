package tn.tekup.smartenergy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.tekup.smartenergy.entity.Building;

public interface BuildingRepository extends JpaRepository<Building, Long> { }
