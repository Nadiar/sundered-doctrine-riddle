const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const BASE_CIRCLE_RADIUS = 32;  // Base size before scaling
const BASE_LINE_THICKNESS = 12;  // Fixed line thickness
const BASE_ARROW_LENGTH = 40;  // Base arrow length

// Define colors locally
const circleColor = '#945e19';
const pathColors = ['#FF6B6B', '#4ECDC4', '#ebd43f'];
const originColor = '#6c91d1';

window.drawingState = {
    currentPath: [],
    scale: 1,
    isDragging: false,
    dragIndex: -1,
    isDrawing: false,
    paths: [],
    currentSetIndex: 0,
    pathSets: [[]],
    dragTarget: null // Add this to track what we're dragging
};

// Core drawing functions
function resizeCanvas() {
    const aspectRatio = mapImage.width / mapImage.height;
    
    // Calculate available space
    const headerHeight = document.querySelector('.page-header')?.offsetHeight || 0;
    const controlsHeight = document.getElementById('mapControls')?.offsetHeight || 0;
    const statusHeight = document.getElementById('mapStatus')?.offsetHeight || 0;
    const footerHeight = document.querySelector('footer')?.offsetHeight || 0;
    const verticalPadding = 40;
    
    // Calculate maximum available height and width
    const maxAvailableHeight = window.innerHeight - (headerHeight + controlsHeight + statusHeight + footerHeight + verticalPadding);
    const maxAvailableWidth = window.innerWidth * 0.95;
    
    // Calculate dimensions that maintain aspect ratio within bounds
    let width = maxAvailableWidth;
    let height = width / aspectRatio;
    
    if (height > maxAvailableHeight) {
        height = maxAvailableHeight;
        width = height * aspectRatio;
    }
    
    canvas.width = width;
    canvas.height = height;
    window.drawingState.scale = width / mapImage.width;
    
    drawPaths();
}

// Add resize observer
const resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(resizeCanvas);
});

// Observe elements that affect layout
document.querySelectorAll('.page-header, #mapControls, #mapStatus, footer').forEach(el => {
    if (el) resizeObserver.observe(el);
});

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

    // First draw all paths and arrows
    paths.forEach((pathObj, index) => {
        console.log('Drawing path:', pathObj);
        drawPathOnly(pathObj);
    });
    if (currentPath.length > 0) {
        drawPathOnly({ path: currentPath, color: pathColors[paths.length % pathColors.length] });
    }

    // Then draw all circles on top
    paths.forEach((pathObj) => {
        drawPathCircles(pathObj);
    });
    if (currentPath.length > 0) {
        drawPathCircles({ path: currentPath });
    }
}

// Add helper function for consistent scaling
function getScaledSize(baseSize) {
    return baseSize * (window.drawingState.scale || 1);
}

function drawPathOnly(pathObj) {
    const { path, color } = pathObj;
    const { scale } = window.drawingState;
    if (!path || path.length === 0) return;
    
    const scaledRadius = getScaledSize(BASE_CIRCLE_RADIUS);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = getScaledSize(BASE_LINE_THICKNESS);
    ctx.lineCap = 'round';
    ctx.save();

    for (let i = 1; i < path.length; i++) {
        ctx.beginPath();
        const start = adjustPoint(
            path[i - 1].x * scale, 
            path[i - 1].y * scale, 
            path[i].x * scale, 
            path[i].y * scale, 
            scaledRadius
        );
        const end = adjustPoint(
            path[i].x * scale, 
            path[i].y * scale, 
            path[i - 1].x * scale, 
            path[i - 1].y * scale, 
            scaledRadius
        );
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }
    
    if (path.length > 1) {
        drawArrow(
            path[path.length - 2].x * scale,
            path[path.length - 2].y * scale,
            path[path.length - 1].x * scale,
            path[path.length - 1].y * scale
        );
    }
    ctx.restore();
}

function drawPathCircles(pathObj) {
    const { path } = pathObj;
    const { scale } = window.drawingState;
    if (!path || path.length === 0) return;

    path.forEach((point, index) => {
        if (index < path.length - 1) {
            // Use originColor for the first circle, circleColor for the rest
            const color = index === 0 ? originColor : circleColor;
            drawCircle(point.x * scale, point.y * scale, color);
        }
    });
}

function drawCircle(x, y, color) {
    const scaledRadius = getScaledSize(BASE_CIRCLE_RADIUS);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = getScaledSize(BASE_LINE_THICKNESS); // Use same thickness as lines
    ctx.arc(x, y, scaledRadius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawArrow(x1, y1, x2, y2) {
    const headLength = getScaledSize(BASE_ARROW_LENGTH);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    
    ctx.moveTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo((x2 - headLength * Math.cos(angle - Math.PI / 6) + x2 - headLength * Math.cos(angle + Math.PI / 6)) / 2, 
               (y2 - headLength * Math.sin(angle - Math.PI / 6) + y2 - headLength * Math.sin(angle + Math.PI / 6)) / 2);
    ctx.stroke();
    ctx.closePath();
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

// For hit detection in mouse events, use scaled radius
function isPointInCircle(x, y, circleX, circleY) {
    const scaledRadius = getScaledSize(BASE_CIRCLE_RADIUS);
    const dx = x - circleX;
    const dy = y - circleY;
    return Math.sqrt(dx * dx + dy * dy) < scaledRadius;
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
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / window.drawingState.scale;
    const y = (event.clientY - rect.top) / window.drawingState.scale;
    
    // Only allow dragging in edit mode
    if (window.isEditMode) {
        // Check for circle hits first
        window.currentPath.forEach((point, index) => {
            if (isPointInCircle(x, y, point.x, point.y)) {
                window.drawingState.isDragging = true;
                window.drawingState.dragIndex = index;
                window.drawingState.dragTarget = 'circle';
                return;
            }
        });
        
        // If no circle was hit, check for arrow hit
        if (!window.drawingState.isDragging && window.currentPath.length > 1) {
            const lastPoint = window.currentPath[window.currentPath.length - 1];
            if (isPointInCircle(x, y, lastPoint.x, lastPoint.y)) {
                window.drawingState.isDragging = true;
                window.drawingState.dragIndex = window.currentPath.length - 1;
                window.drawingState.dragTarget = 'arrow';
            }
        }
    } else if (window.drawingState.isDrawing) {
        // Original point-adding behavior for draw mode
        const dx = point.x - x;
        const dy = point.y - y;
        if (Math.sqrt(dx * dx + dy * dy) < circleRadius / window.drawingState.scale) {
            window.drawingState.isDragging = true;
            window.drawingState.dragIndex = index;
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (!window.drawingState.isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / window.drawingState.scale;
    const y = (event.clientY - rect.top) / window.drawingState.scale;
    
    if (window.drawingState.dragTarget === 'circle' || window.drawingState.dragTarget === 'arrow') {
        window.currentPath[window.drawingState.dragIndex] = { x, y };
        drawPaths();
    }
});

canvas.addEventListener('mouseup', () => {
    window.drawingState.isDragging = false;
    window.drawingState.dragIndex = -1;
    window.drawingState.dragTarget = null;
});

// Add cursor style changes
canvas.addEventListener('mousemove', (event) => {
    if (window.isEditMode) {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / window.drawingState.scale;
        const y = (event.clientY - rect.top) / window.drawingState.scale;
        
        let canDrag = false;
        
        // Check circles and arrow
        window.currentPath.forEach(point => {
            if (isPointInCircle(x, y, point.x, point.y)) {
                canDrag = true;
            }
        });
        
        canvas.style.cursor = canDrag ? 'move' : 'default';
    } else {
        canvas.style.cursor = 'default';
    }
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
