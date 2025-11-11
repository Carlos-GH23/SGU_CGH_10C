package utez.edu.mx.server.user.control;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.server.user.model.User;
import utez.edu.mx.server.user.model.UserRepository;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public User update(User user) {
        Optional<User> userOptional = userRepository.findById(user.getId());
        if (userOptional.isPresent()) {
            User userNew = userOptional.get();
            userNew.setName(user.getName());
            userNew.setEmail(user.getEmail());
            userNew.setPhoneNumber(user.getPhoneNumber());
            return userRepository.save(userNew);
        }
        return null;
    }

    @Transactional(rollbackFor = {SQLException.class})
    public boolean delete(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
