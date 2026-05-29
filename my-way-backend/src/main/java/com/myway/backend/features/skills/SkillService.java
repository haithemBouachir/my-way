package com.myway.backend.features.skills;

import com.myway.backend.common.exception.ResourceNotFoundException;
import com.myway.backend.features.skills.dto.SkillRequest;
import com.myway.backend.features.skills.dto.SkillResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService implements SkillUseCase {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Override
    public List<SkillResponse> findAll() {
        return skillRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public SkillResponse create(SkillRequest request) {
        Skill skill = new Skill(null, request.name(), request.category(), request.level());
        return toResponse(skillRepository.save(skill));
    }

    @Override
    public SkillResponse update(Long id, SkillRequest request) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found: " + id));

        skill.setName(request.name());
        skill.setCategory(request.category());
        skill.setLevel(request.level());

        return toResponse(skillRepository.save(skill));
    }

    @Override
    public void delete(Long id) {
        if (!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill not found: " + id);
        }
        skillRepository.deleteById(id);
    }

    private SkillResponse toResponse(Skill skill) {
        return new SkillResponse(skill.getId(), skill.getName(), skill.getCategory(), skill.getLevel());
    }
}
