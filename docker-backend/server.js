const express = require("express");
const cors = require("cors");
const Docker = require("dockerode");

const app = express();
const docker = new Docker();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));

// Simple shared-secret auth
app.use((req, res, next) => {
  if (req.headers["x-backend-secret"] !== process.env.BACKEND_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// List available demo projects
app.get("/demos", (req, res) => {
  res.json({ demos: [] }); // populate with real demo configs
});

// Launch a demo container (max 15 min TTL, limited resources)
app.post("/demos/:id/start", async (req, res) => {
  try {
    const container = await docker.createContainer({
      Image: `demo-${req.params.id}`,
      HostConfig: {
        Memory: 256 * 1024 * 1024, // 256 MB
        CpuQuota: 50000,            // 50% of one CPU
        NetworkMode: "none",        // no outbound network
        AutoRemove: true,
      },
    });
    await container.start();
    res.json({ containerId: container.id });

    // Auto-kill after 15 minutes
    setTimeout(() => container.stop().catch(() => {}), 15 * 60 * 1000);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stop a running container
app.post("/containers/:id/stop", async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.stop();
    res.json({ stopped: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Docker backend listening on :${PORT}`));
