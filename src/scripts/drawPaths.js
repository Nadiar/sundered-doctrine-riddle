const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const circleRadius = 15;
const circleColor = '#a75904';

// Define colors locally
const pathColors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];

window.drawingState = {
    currentPath: [],
    scale: 1,
    isDragging: false,
    dragIndex: -1,
    isDrawing: false,
    paths: [],
    currentSetIndex: 0,
    pathSets: [[]]
};

// Core drawing functions
function resizeCanvas() {
    const aspectRatio = mapImage.width / mapImage.height;
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth / aspectRatio;
    window.drawingState.scale = canvas.width / mapImage.width;
    drawPaths();
}

const mapImage = new Image();
mapImage.src = 'src/images/map.png';
mapImage.onload = () => {
    console.log('Map image loaded, initializing canvas');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.drawingSystem = { ready: true, colors: pathColors };
    window.dispatchEvent(new Event('drawingSystemReady'));
};

function drawPaths() {
    const { paths, currentPath, scale } = window.drawingState;
    console.log('Drawing paths:', paths);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

    paths.forEach((pathObj, index) => {
        console.log('Drawing path:', pathObj);
        drawPath(pathObj);
    });
    if (currentPath.length > 0) {
        drawPath({ path: currentPath, color: pathColors[paths.length % pathColors.length] });
    }
}

function drawPath(pathObj) {
    const { path, color } = pathObj;
    const { scale } = window.drawingState;
    if (!path || path.length === 0) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(path[0].x * scale, path[0].y * scale);
    drawCircle(path[0].x * scale, path[0].y * scale);
    for (let i = 1; i < path.length; i++) {
        const start = adjustPoint(path[i - 1].x * scale, path[i - 1].y * scale, path[i].x * scale, path[i].y * scale, circleRadius);
        const end = adjustPoint(path[i].x * scale, path[i].y * scale, path[i - 1].x * scale, path[i - 1].y * scale, circleRadius);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        if (i < path.length - 1) {
            drawCircle(path[i].x * scale, path[i].y * scale);
        }
    }
    if (path.length > 1) {
        drawArrow(path[path.length - 2].x * scale, path[path.length - 2].y * scale, path[path.length - 1].x * scale, path[path.length - 1].y * scale);
    }
}

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.strokeStyle = circleColor;
    ctx.fillStyle = circleColor;
    
    try {
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        const pointColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        
        if (pointColor === circleColor) {
            ctx.fill();
        }
    } catch (e) {
        // If we can't get the pixel data, just draw an unfilled circle
    }
    
    ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawArrow(x1, y1, x2, y2) {
    const headLength = 20;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function adjustPoint(x1, y1, x2, y2, radius) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const ratio = (distance - radius) / distance;
    return {
        x: x1 + dx * ratio,
        y: y1 + dy * ratio
    };
}

// Canvas event handlers
canvas.addEventListener('click', (event) => {
    if (!window.drawingState.isDrawing || window.drawingState.paths.some(p => JSON.stringify(p.path) === JSON.stringify(window.drawingState.currentPath))) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / window.drawingState.scale;
    const y = (event.clientY - rect.top) / window.drawingState.scale;
    window.drawingState.currentPath.push({ x, y });
    drawPaths();
});

canvas.addEventListener('mousedown', (event) => {
    if (!window.drawingState.isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / window.drawingState.scale;
    const y = (event.clientY - rect.top) / window.drawingState.scale;
    window.drawingState.currentPath.forEach((point, index) => {
        const dx = point.x - x;
        const dy = point.y - y;
        if (Math.sqrt(dx * dx + dy * dy) < circleRadius / window.drawingState.scale) {
            window.drawingState.isDragging = true;
            window.drawingState.dragIndex = index;
        }
    });
});

canvas.addEventListener('mousemove', (event) => {
    if (!window.drawingState.isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / window.drawingState.scale;
    const y = (event.clientY - rect.top) / window.drawingState.scale;
    window.drawingState.currentPath[window.drawingState.dragIndex] = { x, y };
    drawPaths();
});

canvas.addEventListener('mouseup', () => {
    window.drawingState.isDragging = false;
    window.drawingState.dragIndex = -1;
});

// Public API
window.drawingAPI = {
    drawPaths,
    setDrawingEnabled: (enabled) => window.drawingState.isDrawing = enabled,
    determineLabel: (x, y) => {
        const horizontal = x < canvas.width / 2 ? 'L' : 'R';
        const vertical = y < canvas.height / 2 ? '2' : '1';
        return `${horizontal}${vertical}`;
    }
};
