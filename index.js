// ===== CONFIGURATION =====
const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"
const CANVAS_WIDTH = 1280
const CANVAS_HEIGHT = 720
const Z_STEP = 0.1

// ===== INITIALIZATION =====
const game = document.getElementById("game")
game.width = CANVAS_WIDTH
game.height = CANVAS_HEIGHT

const ctx = game.getContext("2d")

// ===== STATE =====
let dz = 1
let angle = 0
let lastTime = performance.now()
let loadedModels = []
let currentModelIndex = 0

// ===== DRAWING FUNCTIONS =====
function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, game.width, game.height)
}

function point({x, y}) {
    const s = 20
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x - s/2, y - s/2, s, s)
}

function line(p1, p2) {
    ctx.lineWidth = 3
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}

// ===== 3D TRANSFORMATION FUNCTIONS =====
function project({x, y, z}) {
    return {
        x: x / z,
        y: y / z
    }
}

function screen(p) {
    const aspect_ratio = game.width / game.height
    return {
        x: (p.x + aspect_ratio) / (2 * aspect_ratio) * game.width,
        y: (1 - (p.y + 1) / 2) * game.height
    }
}

function translate_z({x, y, z}, dz) {
    return {x, y, z: z + dz}
}

function rotate_xz({x, y, z}, angle) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
        x: x * cos - z * sin,
        y,
        z: x * sin + z * cos
    }
}

function transformVertex(vertex, angle, dz) {
    return screen(project(translate_z(rotate_xz(vertex, angle), dz)))
}

// ===== RENDERING FUNCTIONS =====
function renderFace(face, vertices, angle, dz, isSolid = false) {
    const points = face.map(i => transformVertex(vertices[i], angle, dz))
    
    // Draw lines
    for (let i = 0; i < points.length; ++i) {
        line(points[i], points[(i + 1) % points.length])
    }
    
    // Fill if solid
    if (isSolid) {
        ctx.fillStyle = FOREGROUND
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.closePath()
        ctx.fill()
    }
}

function renderObject(model, angle, dz) {
    const {vertices, faces, edges, maxDim} = model.geometry
    const isSolid = model.name.includes('solid')
    const local_dz = dz * maxDim * 4
    
    for (const face of faces) {
        renderFace(face, vertices, angle, local_dz, isSolid)
    }
    for (const edge of edges) {
        const p1 = transformVertex(vertices[edge[0]], angle, local_dz)
        const p2 = transformVertex(vertices[edge[1]], angle, local_dz)
        line(p1, p2)
    }
}

// ===== INPUT HANDLING =====
function handleKeyDown(event) {
    switch (event.key) {
        case ' ':
            currentModelIndex = (currentModelIndex + 1) % loadedModels.length
            console.log("Switch to:", loadedModels[currentModelIndex].name)
            break
        default:
            console.log(`Key pressed: ${event.key}`)
    }
}

function handleWheel(event) {
    event.preventDefault()
    if (event.deltaY < 0) {
        dz -= Z_STEP
        console.log("Forward! dz=", dz)
    } else {
        dz += Z_STEP
        console.log("Backward! dz=", dz)
    }
}

function setupInputListeners() {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel)
}

// ===== ANIMATION LOOP =====
function frame() {
    const currentTime = performance.now()
    const dt = (currentTime - lastTime) / 1000
    lastTime = currentTime
    
    angle += Math.PI * dt

    if (loadedModels.length > 0) {
        const model = loadedModels[currentModelIndex]

        clear()
        renderObject(model, angle, dz)
    }

    requestAnimationFrame(frame)
}

// ===== STARTUP =====
async function start() {
    loadedModels = await loadAllModels()
    console.log("Loaded models:", loadedModels.map(m => m.name))
    setupInputListeners()
    requestAnimationFrame(frame)
}

start()
