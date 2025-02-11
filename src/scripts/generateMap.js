let pathSets = [[]];
let currentSetIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize controls
    function initializeControls() {
        const newPathButton = document.getElementById('newPath');
        const commitPathButton = document.getElementById('commitPath');
        const resetPathButton = document.getElementById('resetPath');
        const showYamlButton = document.getElementById('showYaml');
        const newPathSetButton = document.getElementById('newPathSet');

        newPathSetButton.addEventListener('click', () => {
            pathSets.push([]);
            currentSetIndex = pathSets.length - 1;
            window.currentPath = [];
            window.paths = pathSets[currentSetIndex];
            drawPaths();
            updateLegend();
            document.getElementById('mapStatus').textContent = 'No path is being created';
            setDrawingEnabled(false);
        });

        newPathButton.addEventListener('click', () => {
            window.currentPath = [];
            window.paths = pathSets[currentSetIndex]; // Ensure paths is updated
            drawPaths();
            setDrawingEnabled(true);
            document.getElementById('mapStatus').textContent = `Creating path ${pathSets[currentSetIndex].length + 1} in the current set`;
        });

        commitPathButton.addEventListener('click', () => {
            if (window.currentPath.length > 0) {
                const color = colors[pathSets[currentSetIndex].length % colors.length];
                const lastPoint = window.currentPath[window.currentPath.length - 1];
                const label = determineLabel(lastPoint.x * scale, lastPoint.y * scale);
                pathSets[currentSetIndex].push({ 
                    path: [...window.currentPath], 
                    color, 
                    label 
                });
                window.currentPath = [];
                window.paths = pathSets[currentSetIndex];
                drawPaths();
                setDrawingEnabled(false);
                document.getElementById('mapStatus').textContent = 'No path is being created';
                updateLegend();
            }
        });

        resetPathButton.addEventListener('click', () => {
            window.currentPath = [];
            drawPaths();
            setDrawingEnabled(false);
            document.getElementById('mapStatus').textContent = 'No path is being created';
        });

        // Initialize YAML popup handler
        showYamlButton.addEventListener('click', showYamlPopup);
    }

    function updateLegend() {
        const legendList = document.getElementById('legendList');
        legendList.innerHTML = '';

        pathSets.forEach((pathSet, setIndex) => {
            if (pathSet.length > 0) {
                const setItem = document.createElement('li');
                const setContainer = document.createElement('div');
                setContainer.className = 'legend-item';
                
                const setLabel = document.createElement('span');
                const topLevelKey = pathSet.map(pathObj => pathObj.label).join('');
                setLabel.textContent = topLevelKey;
                
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';

                const duplicateButton = document.createElement('button');
                duplicateButton.textContent = 'Duplicate Set';
                duplicateButton.addEventListener('click', () => {
                    const newSet = pathSet.map(pathObj => ({ ...pathObj, path: [...pathObj.path] }));
                    pathSets.push(newSet);
                    drawPaths();
                    updateLegend();
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete Set';
                deleteButton.addEventListener('click', () => {
                    pathSets.splice(setIndex, 1);
                    if (pathSets.length === 0) pathSets.push([]);
                    currentSetIndex = Math.min(currentSetIndex, pathSets.length - 1);
                    drawPaths();
                    updateLegend();
                });

                buttonContainer.appendChild(duplicateButton);
                buttonContainer.appendChild(deleteButton);
                setContainer.appendChild(setLabel);
                setContainer.appendChild(buttonContainer);
                setItem.appendChild(setContainer);

                // Create nested list for individual paths
                const subList = document.createElement('ul');
                pathSet.forEach((pathObj, pathIndex) => {
                    const pathItem = document.createElement('li');
                    const pathContainer = document.createElement('div');
                    pathContainer.className = 'legend-item';
                    
                    const pathLabel = document.createElement('span');
                    pathLabel.textContent = `${pathObj.label} Path ${pathIndex + 1}`;
                    
                    if (currentPath.length > 0 && 
                        JSON.stringify(pathObj.path) === JSON.stringify(currentPath) &&
                        currentSetIndex === setIndex) {
                        pathLabel.style.backgroundColor = '#444';
                        pathLabel.style.padding = '2px 5px';
                        pathLabel.textContent += ' (editing)';
                    }
                    
                    const pathButtons = document.createElement('div');
                    pathButtons.className = 'button-container';

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.addEventListener('click', () => {
                        currentPath = [...pathObj.path];
                        currentSetIndex = setIndex;
                        pathSets[setIndex].splice(pathIndex, 1);
                        drawPaths();
                        updateLegend();
                        setDrawingEnabled(true);
                    });
                    
                    pathButtons.appendChild(editButton);
                    pathContainer.appendChild(pathLabel);
                    pathContainer.appendChild(pathButtons);
                    pathItem.appendChild(pathContainer);
                    subList.appendChild(pathItem);
                });

                setItem.appendChild(subList);
                legendList.appendChild(setItem);
            }
        });
    }

    function showYamlPopup() {
        const yamlContent = pathSets.map(pathSet => {
            const yaml = pathSet.reduce((acc, pathObj) => {
                acc[pathObj.label] = {
                    Coords: pathObj.path.map(coord => [Number(coord.x.toFixed(2)), Number(coord.y.toFixed(2))])
                };
                return acc;
            }, {});
            const topLevelKey = pathSet.map(pathObj => pathObj.label).join('');
            return { [topLevelKey]: yaml };
        });

        const yamlString = jsyaml.dump(yamlContent, { indent: 4 });
        
        // Create and show popup
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #14171a;
            padding: 20px;
            border: 2px solid #ebd43f;
            max-width: 80%;
            max-height: 80vh;
            overflow: auto;
            z-index: 1000;
            white-space: pre;
            font-family: monospace;
        `;
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            position: sticky;
            top: 0;
            float: right;
            margin-bottom: 10px;
        `;
        closeButton.onclick = () => popup.remove();
        
        popup.appendChild(closeButton);
        popup.appendChild(document.createTextNode(yamlString));
        document.body.appendChild(popup);
    }

    // Initialize controls when document is ready
    initializeControls();
    window.paths = pathSets[currentSetIndex];
});
