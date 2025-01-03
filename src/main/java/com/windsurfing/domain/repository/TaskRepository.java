package com.windsurfing.domain.repository;

import com.windsurfing.domain.model.Task;
import com.windsurfing.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByUserAndSubject(User user, String subject);
}
