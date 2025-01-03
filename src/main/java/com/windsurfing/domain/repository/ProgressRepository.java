package com.windsurfing.domain.repository;

import com.windsurfing.domain.model.Progress;
import com.windsurfing.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUser(User user);
    List<Progress> findByUserOrderByCompletedAtDesc(User user);
}
