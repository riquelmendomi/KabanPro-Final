require('dotenv').config();

const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const sequelize = require("./database");
const authRoutes = require("./routes/api/auth/authRoutes");
const { tablero, lista, tarjeta } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use(
  session({
    secret: "kanbanpro-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "layout",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// rutas nuevas auth
app.use("/api/auth", authRoutes);

/* ================= HOME ================= */
app.get("/", (req, res) => res.render("home", { title: "Inicio" }));

/* ================= REGISTER ================= */
app.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});


/* ================= LOGIN ================= */
app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

/* ================= LOGOUT ================= */
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  req.session.destroy(() => {
    res.redirect('/');
  });
});

/* ================= DASHBOARD ================= */
app.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const boards = await tablero.findAll({
      where: { usuarioId: userId },
      include: [
        {
          model: lista,
          as: "listas",
          include: [
            {
              model: tarjeta,
              as: "tarjetas"
            }
          ]
        }
      ],
      order: [
        ["createdAt", "ASC"],
        [{ model: lista, as: "listas" }, "createdAt", "ASC"],
        [{ model: lista, as: "listas" }, { model: tarjeta, as: "tarjetas" }, "createdAt", "ASC"]
      ]
    });

    if (!boards.length) {
      const nuevoTablero = await tablero.create({
        nombre: "Proyecto",
        usuarioId: userId
      });

      return res.render("dashboard", {
        title: "Dashboard",
        board: {
          id: nuevoTablero.id,
          name: nuevoTablero.nombre
        },
        columns: [],
        boards: [
          {
            id: nuevoTablero.id,
            name: nuevoTablero.nombre
          }
        ],
        activeBoardId: nuevoTablero.id,
        user: req.session.user,
        layout: "layoutdashboard",
      });
    }

    const boardId = req.query.boardId;
    const selectedBoard = boardId
      ? boards.find((b) => String(b.id) === String(boardId))
      : boards[0];

    const safeBoard = selectedBoard || boards[0];

    const columns = safeBoard.listas.map((l) => ({
      id: l.id,
      name: l.nombre,
      tasks: l.tarjetas
        .sort((a, b) => a.orden - b.orden)
        .map((t) => ({
          id: t.id,
          title: t.titulo,
          description: t.descripcion || "",
          dueDate: t.dueDate || "",
          status: t.estado || "todo",
          createdAt: t.createdAt ? t.createdAt.toISOString().split("T")[0] : ""
        }))
    }));

    res.render("dashboard", {
      title: "Dashboard",
      board: {
        id: safeBoard.id,
        name: safeBoard.nombre
      },
      columns,
      boards: boards.map((b) => ({
        id: b.id,
        name: b.nombre
      })),
      activeBoardId: safeBoard.id,
      user: req.session.user,
      layout: "layoutdashboard",
    });
  } catch (error) {
    console.error("ERROR DASHBOARD:", error);
    res.status(500).send("Error al cargar el dashboard");
  }
});

/* =================  ================= */
app.post("/nueva-categoria", requireAuth, async (req, res) => {
  try {
    const { name, tableroId } = req.body;

    if (!name || !tableroId) {
      return res.redirect("/dashboard");
    }

    await lista.create({
      nombre: name,
      tableroId: tableroId
    });

    res.redirect(`/dashboard?boardId=${tableroId}`);
  } catch (error) {
    console.error("ERROR NUEVA CATEGORÍA:", error);
    res.status(500).send("Error al crear categoría");
  }
});
/* ================= NUEVA TAREA ================= */
app.post("/nueva-tarea", requireAuth, async (req, res) => {
  try {
    const { categoryId, title, description, dueDate, status } = req.body;

    if (!categoryId || !title) {
      return res.redirect("/dashboard");
    }

    const total = await tarjeta.count({
      where: { listaId: categoryId }
    });

    await tarjeta.create({
      titulo: title,
      descripcion: description || "",
      dueDate: dueDate || null,
      estado: status || "todo",
      listaId: categoryId,
      orden: total
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("ERROR NUEVA TAREA:", error);
    res.status(500).send("Error al crear tarea");
  }
});

/* ================= RENOMBRAR CATEGORIA ================= */
app.post("/renombrar-categoria", requireAuth, async (req, res) => {
  try {
    const { categoryId, name } = req.body;
    if (!categoryId || !name) return res.redirect("/dashboard");

    await lista.update(
      { nombre: name },
      { where: { id: categoryId } }
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.error("ERROR RENOMBRAR CATEGORÍA:", error);
    res.status(500).send("Error al renombrar categoría");
  }
});
 

/* ================= ELIMINAR CATEGORIA ================= */
app.post("/eliminar-categoria", requireAuth, async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) return res.redirect("/dashboard");

    await tarjeta.destroy({ where: { listaId: categoryId } });
    await lista.destroy({ where: { id: categoryId } });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("ERROR ELIMINAR CATEGORÍA:", error);
    res.status(500).send("Error al eliminar categoría");
  }
});

/* ================= eliminar categoria ================= */
app.post("/eliminar-categoria", requireAuth, async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) return res.redirect("/dashboard");

    await tarjeta.destroy({ where: { listaId: categoryId } });
    await lista.destroy({ where: { id: categoryId } });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("ERROR ELIMINAR CATEGORÍA:", error);
    res.status(500).send("Error al eliminar categoría");
  }
});

/* ================= EDITAR TAREA ================= */
app.post("/editar-tarea", requireAuth, async (req, res) => {
  try {
    const { taskId, title, description, dueDate } = req.body;
    if (!taskId) return res.redirect("/dashboard");

    const updates = {};
    if (typeof title !== "undefined" && title !== "") updates.titulo = title;
    updates.descripcion = description || "";
    updates.dueDate = dueDate || null;

    await tarjeta.update(updates, {
      where: { id: taskId }
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("ERROR EDITAR TAREA:", error);
    res.status(500).send("Error al editar tarea");
  }
});

/* ================= ELIMINAR TAREA ================= */
app.post("/eliminar-tarea", requireAuth, async (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) return res.redirect("/dashboard");

    await tarjeta.destroy({
      where: { id: taskId }
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("ERROR ELIMINAR TAREA:", error);
    res.status(500).send("Error al eliminar tarea");
  }
});

/* ================= MOVER / ORDENAR TAREA (Drag & Drop) ================= */
app.post("/orden-tareas", requireAuth, async (req, res) => {
  try {
    const { taskId, categoryId, position } = req.body;

    const pos = Number(position);
    const safePos = Number.isFinite(pos) && pos >= 0 ? pos : 0;

    await tarjeta.update(
      {
        listaId: categoryId,
        orden: safePos
      },
      {
        where: { id: taskId }
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("ERROR ORDEN TAREAS:", error);
    res.sendStatus(500);
  }
});


/* ================= cambiar estado ================= */
app.post("/cambiar-estado", requireAuth, async (req, res) => {
  try {
    const { taskId, status } = req.body;

    if (!taskId || !status) {
      return res.redirect("/dashboard");
    }

    await tarjeta.update(
      { estado: status },
      { where: { id: taskId } }
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.error("ERROR CAMBIAR ESTADO:", error);
    res.status(500).send("Error al cambiar estado");
  }
});

/* ================= RESTO DE TUS RUTAS ================= */

sequelize.sync({ alter: true })
  .then(() => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => {
    console.error("❌ Error al conectar DB:", err.message);
  });