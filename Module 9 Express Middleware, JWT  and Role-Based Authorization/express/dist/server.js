

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";

// src/middleware/logger.ts
import fs from "fs";
var logger = (req, res, next) => {
  const currentDate = /* @__PURE__ */ new Date();
  const date = currentDate.toLocaleDateString();
  const time = currentDate.toLocaleTimeString();
  const log = `
Method -> ${req.method}
URL -> ${req.url}
Date -> ${date}
Time -> ${time}
`;
  fs.appendFile("logger.txt", log, (err) => {
  });
  next();
};
var logger_default = logger;

// src/modules/user/user.route.ts
import { Router } from "express";

// src/modules/user/user.controller.ts
import "express";

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config = {
  connection_string: process.env.CONNECTIONSTRING,
  port: process.env.PORT,
  secret_key: process.env.JWT_SECRET_KEY
};
var config_default = config;

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.connection_string
});
var initDB = async () => {
  try {
    await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    age INTEGER,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
    await pool.query(`
  CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    address VARCHAR(255),
    phone VARCHAR(20),
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    console.log("Database initialized successfully");
  }
};

// src/modules/user/user.service.ts
import bycrypt from "bcryptjs";
var createUserIntoDB = async (payload) => {
  const { name, email, password, age, role } = payload;
  const hashedPassword = await bycrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO users(name, email, password, age, role) VALUES($1, $2, $3, $4, COALESCE($5, 'user')) RETURNING *`,
    [name, email, hashedPassword, age, role]
  );
  console.log(result.rows[0]);
  delete result.rows[0].password;
  delete result.rows[0].is_active;
  return result.rows[0];
};
var getAllUsersFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};
var getSingleUserFromDB = async (id) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result;
};
var updateUserFromDB = async (payload, id) => {
  const { name, password, age, is_active } = payload;
  const hashedPassword = password ? await bycrypt.hash(password, 12) : void 0;
  const result = await pool.query(
    `
    UPDATE users 
    SET 
    name=COALESCE($1,name),
    password=COALESCE($2,password),
    age=COALESCE($3,age),
    is_active=COALESCE($4,is_active) 

    WHERE id=$5 RETURNING *
    `,
    [name, hashedPassword, age, is_active, id]
  );
  return result;
};
var deleteUserFromDB = async (id) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
    id
  ]);
  return result;
};
var userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB
};

// src/utility/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error
  });
};
var sendResponse_default = sendResponse;

// src/modules/user/user.controller.ts
var createUser = async (req, res) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "Data received successfully",
      data: result
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while inserting data",
      error
    });
  }
};
var getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsersFromDB();
    const users = result.rows.map((user) => {
      delete user.password;
      delete user.is_active;
      return user;
    });
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while retrieving users",
      error
    });
  }
};
var getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    console.log(result.rows[0]);
    const user = result.rows[0];
    if (user) {
      delete user.password;
      delete user.is_active;
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while retrieving the user",
      error
    });
  }
};
var updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.updateUserFromDB(req.body, id);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not found!"
      });
    }
    const updatedUser = result.rows[0];
    if (updatedUser) {
      delete updatedUser.password;
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: updatedUser
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(id);
    console.log(result);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not found!"
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: {}
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};

// src/middleware/auth.ts
import jwt from "jsonwebtoken";
var auth = (...roles) => {
  console.log("Roles in auth middleware:", roles);
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          sucess: false,
          message: "Unauthorized"
        });
      }
      const decoded = jwt.verify(
        token,
        config_default.secret_key
      );
      const userData = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [decoded.email]
      );
      const user = userData.rows[0];
      if (userData.rowCount === 0) {
        return res.status(404).json({
          sucess: false,
          message: "user not found"
        });
      }
      if (!user?.is_active) {
        return res.status(403).json({
          success: false,
          message: "user is not active"
        });
      }
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden"
        });
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/types/index.ts
var USER_ROLE = {
  admin: "admin",
  user: "user",
  agent: "agent"
};

// src/modules/user/user.route.ts
var router = Router();
router.post("/", userController.createUser);
router.get("/", auth_default(USER_ROLE.admin, USER_ROLE.agent), userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
var userRoute = router;

// src/modules/profile/profile.routes.ts
import { Router as Router2 } from "express";

// src/modules/profile/profile.controller.ts
import "express";

// src/modules/profile/profile.service.ts
var createProfileIntoDB = async (payload) => {
  const { user_id, bio, address, phone, gender } = payload;
  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
  if (user.rowCount === 0) {
    throw new Error("User not found");
  }
  const existingProfile = await pool.query(`SELECT * FROM profiles WHERE user_id = $1`, [user_id]);
  if (existingProfile.rowCount && existingProfile.rowCount > 0) {
    throw new Error("Profile already exists for this user");
  }
  const result = await pool.query(
    `INSERT INTO profiles (user_id, bio, address, phone, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [user_id, bio, address, phone, gender]
  );
  return result;
};
var profileService = {
  createProfileIntoDB
};

// src/modules/profile/profile.controller.ts
var createProfile = async (req, res) => {
  try {
    const result = await profileService.createProfileIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating the profile",
      error
    });
  }
};
var profileController = {
  createProfile
};

// src/modules/profile/profile.routes.ts
var router2 = Router2();
router2.post("/", profileController.createProfile);
var profileRoute = router2;

// src/modules/auth/auth.route.ts
import { Router as Router3 } from "express";

// src/modules/auth/auth.controller.ts
import "express";

// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt2 from "jsonwebtoken";
var loginUserIntoDB = async (payload) => {
  const { email, password } = payload;
  const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email
  ]);
  if (userData.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid password");
  }
  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    is_active: user.is_active
  };
  const accessToken = jwt2.sign(jwtPayload, config_default.secret_key, {
    expiresIn: "1d"
  });
  const refreshToken2 = jwt2.sign(jwtPayload, config_default.secret_key, {
    expiresIn: "365d"
  });
  return {
    accessToken,
    refreshToken: refreshToken2
  };
};
var generateRefreshToken = async (token) => {
  if (!token) {
    throw new Error("Unauthorized");
  }
  const decoded = jwt2.verify(
    token,
    config_default.secret_key
  );
  const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
    decoded.email
  ]);
  if (userData.rowCount === 0) {
    throw new Error("User not found");
  }
  const user = userData.rows[0];
  if (!user.is_active) {
    throw new Error("User is not active");
  }
  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    is_active: user.is_active
  };
  const accessToken = jwt2.sign(jwtPayload, config_default.secret_key, {
    expiresIn: "1d"
  });
  return {
    accessToken
  };
};
var authService = {
  loginUserIntoDB,
  generateRefreshToken
};

// src/modules/auth/auth.controller.ts
var loginUser = async (req, res) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const { refreshToken: refreshToken2 } = result;
    res.cookie("refreshToken", refreshToken2, {
      secure: false,
      httpOnly: true,
      sameSite: "lax"
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken: result.accessToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const result = await authService.generateRefreshToken(token);
    res.status(200).json({
      success: true,
      message: "Access token generated successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var authController = {
  loginUser,
  refreshToken
};

// src/modules/auth/auth.route.ts
var router3 = Router3();
router3.post("/login", authController.loginUser);
router3.post("/refresh-token", authController.refreshToken);
var authRoute = router3;

// src/app.ts
import cookieParser from "cookie-parser";
import cros from "cors";

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/app.ts
var app = express();
app.use(cros());
app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cros({ origin: "http://localhost:3000", credentials: true }));
app.use(logger_default);
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
var main = () => {
  initDB();
  app_default.listen(config_default.port, () => {
    console.log(`Server is running on http://localhost:${config_default.port}`);
  });
};
main();
//# sourceMappingURL=server.js.map