const User = require("../models/User");
const bcrypt = require("bcrypt");
const {generateToken} = require('../middlewares/authMiddleware')
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } })
      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }
      const passwordIsValid = bcrypt.compareSync(
        password, user.password
      );
      if (!passwordIsValid) {
        return res.status(401)
        .json({ 
          success: false,
          error: 'Invalid password' 
        });
      }
      const token = generateToken(user);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          username: user.username
        },
        token
      });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error logging in',
      details: error.message,
    });
  }
};

const register = async(req, res) => {
  try {
    console.log('Dados recebidos:', req.body);
    const { name, username, password } = req.body;
    
    // Validar se todos os campos foram fornecidos
    if (!name || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
        details: { name: !!name, username: !!username, password: !!password }
      });
    }
    
    const newPassword = bcrypt.hashSync(password, 10);

    const user = await User.create(
      {
        name,
        username,
        password: newPassword
      }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        username: user.username
      }
    });


  } catch (error) {
    console.error('Erro no registro:', error);
    
    // Verificar se é erro de username duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Username already exists',
        details: 'Please choose a different username'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error registering user',
      details: error.message,
    });
  }
};

module.exports = {
  login,
  register,
};
