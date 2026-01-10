const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"

console.log(game)
game.width = 800
game.height = 800
const ctx = game.getContext("2d")
console.log(ctx)

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
    ctx.lineWidth = 3;
    ctx.strokeStyle = FOREGROUND;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function screen(p) {
    // -1..1 => 0..2 => 0..1 => 0..w/h => 0..w
    return {
        x: (p.x + 1) / 2 * game.width,
        y: (1 - (p.y + 1) / 2) * game.height
    }

}
 
function project({x, y, z}) {
    return {
        x: x/z,
        y: y/z
    }
}

const FPS = 60;
let dz = 2;
angle = 0;

function translate_z({x, y, z}, dz) {
    return {x, y, z: z + dz}
}

function rotate_xz({x, y, z}, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        x: x * cos - z * sin,
        y,
        z: x * sin + z * cos
    }

}

const vertices = [
    {x:  0.5, y:  0.5, z:  0.5},
    {x: -0.5, y:  0.5, z:  0.5},
    {x: -0.5, y: -0.5, z:  0.5},
    {x:  0.5, y: -0.5, z:  0.5},

    {x:  0.5, y:  0.5, z: -0.5},
    {x: -0.5, y:  0.5, z: -0.5},
    {x: -0.5, y: -0.5, z: -0.5},
    {x:  0.5, y: -0.5, z: -0.5},
]

const faces = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6], 
    [3, 7]
]

function frame() {
    const dt = 1 / FPS;
    //dz += 1 * dt
    angle += Math.PI * dt;

    clear()

    // for (const vertex of vertices) {
    //     point(screen(project(translate_z(rotate_xz(vertex, angle), dz))))
    // }

    for (const face of faces) {
        for (let i = 0; i < face.length; ++i) {
            const first_vertex = vertices[face[i]];
            const second_vertex = vertices[face[(i + 1) % face.length]];
            line(screen(project(translate_z(rotate_xz(first_vertex, angle), dz))),
                 screen(project(translate_z(rotate_xz(second_vertex, angle), dz))));
        }
    }
    setTimeout(frame, 1000/FPS);
}
setTimeout(frame, 1000/FPS);
