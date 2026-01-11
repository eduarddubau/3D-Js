const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"

console.log(game)
game.width = 1280
game.height = 720

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

    const aspect_ratio = game.width / game.height;
    // -1..1 => 0..2 => 0..1 => 0..w/h => 0..w
    return {
        x: (p.x + aspect_ratio) / (2 * aspect_ratio) * game.width,
        y: (1 - (p.y + 1) / 2) * game.height
    }

}
 
function project({x, y, z}) {
    return {
        x: x/z,
        y: y/z
    }
}

let dz = 1;
let z_step = 0.1;
angle = 0;
let lastTime = performance.now();

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

let current_object = 'CUBE';

const objects = {
    CUBE: {
        vertices: cube_v,
        faces: cube_f
    },
    PENGER: {
        vertices: penger_v,
        faces: penger_f
    }
}

function frame() {
    const currentTime = performance.now();
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    //dz += 1 * dt
    angle += Math.PI * dt;

    const vertices = objects[current_object].vertices;
    const faces = objects[current_object].faces;

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

    requestAnimationFrame(frame);
}

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case ' ':
            console.log("Switch!");
            current_object = current_object === 'CUBE' ? 'PENGER' : 'CUBE';
            break;
        default:
            console.log(`Key pressed: ${event.key}`);
    }
});

window.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
        console.log("Scroll up - Forward! dz="+dz);
        dz -= z_step;
    } else {
        console.log("Scroll down - Backward! dz="+dz);
        dz += z_step;
    }
});

requestAnimationFrame(frame);
