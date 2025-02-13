let pathSets = [[]];
let currentSetIndex = 0;
window.currentPath = []; // Add this line at the top

// Add new mode tracking
let isEditMode = false;
window.isEditMode = false; // Add this at the top level

document.addEventListener('DOMContentLoaded', () => {
    // Add default YAML loading and debug logging
    window.addEventListener('yamlDataUpdated', (event) => {
        console.log('YAML data updated:', event.detail);
        if (event.detail) {
            try {
                pathSets = event.detail.map(set => {
                    const setName = Object.keys(set)[0];
                    console.log('Processing set:', setName);
                    const pathData = set[setName];
                    
                    return Object.entries(pathData).map(([label, data], index) => {
                        console.log(`Processing path ${label}:`, data);
                        return {
                            label,
                            path: data.Coords.map(coord => ({ x: coord[0], y: coord[1] })),
                            color: window.drawingSystem.colors[index % window.drawingSystem.colors.length]
                        };
                    });
                });
                
                console.log('Processed path sets:', pathSets);
                currentSetIndex = 0;
                window.paths = pathSets[currentSetIndex];
                window.currentPath = []; // Reset current path when loading new data
                updateLegend();
                drawPaths();
            } catch (error) {
                console.error('Error processing YAML data:', error);
            }
        }
    });

    // Add file drag and drop handlers
    document.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    document.addEventListener('drop', (event) => {
        event.preventDefault();
        console.log('File dropped:', event.dataTransfer.files[0]);
        const file = event.dataTransfer.files[0];
        if (file && (file.name.endsWith('.yaml') || file.name.endsWith('.yml'))) {
            window.yamlProcessor.handleFileUpload(file).catch((error) => {
                console.error('Error processing dropped YAML file:', error);
                alert('Failed to process dropped YAML file.');
            });
        } else {
            alert('Invalid file type. Please drop a YAML file.');
        }
    });

    // Load default YAML on startup
    window.yamlProcessor.loadDefaultYaml();

    // Add function to reset filters
    function resetFilters() {
        document.querySelectorAll('.selection-box').forEach(box => {
            const input = box.querySelector('input[type="hidden"]');
            input.value = '';
            box.querySelectorAll('.option').forEach(btn => {
                btn.classList.remove('selected');
                btn.classList.remove('disabled');
                btn.disabled = false;
            });
        });
        updateLegend();
    }

    // Add path editing state
    let editingPath = null;
    let editingPathIndex = -1;

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
            window.drawingAPI.setDrawingEnabled(false);  // Changed this line
        });

        newPathButton.addEventListener('click', () => {
            window.currentPath = [];
            editingPath = null;
            editingPathIndex = -1;
            isEditMode = false;
            drawPaths();
            window.drawingAPI.setDrawingEnabled(true);
            window.drawingState.isDrawing = true;  // Enable point adding
            document.getElementById('mapStatus').textContent = `Creating path ${pathSets[currentSetIndex].length + 1} in the current set`;
        });

        commitPathButton.addEventListener('click', () => {
            if (window.currentPath.length > 0) {
                const color = window.drawingSystem.colors[pathSets[currentSetIndex].length % window.drawingSystem.colors.length];
                const lastPoint = window.currentPath[window.currentPath.length - 1];
                const label = window.drawingAPI.determineLabel(lastPoint.x * window.drawingState.scale, lastPoint.y * window.drawingState.scale);
                
                if (editingPath !== null && editingPathIndex !== -1) {
                    // Update existing path
                    const updatedPath = {
                        path: [...window.currentPath],
                        color: editingPath.color,
                        label: editingPath.label
                    };
                    pathSets[currentSetIndex].splice(editingPathIndex, 0, updatedPath);
                    editingPath = null;
                    editingPathIndex = -1;
                } else {
                    // Create new path
                    pathSets[currentSetIndex].push({
                        path: [...window.currentPath],
                        color,
                        label
                    });
                }
                
                window.currentPath = [];
                window.paths = pathSets[currentSetIndex];
                drawPaths();
                window.drawingAPI.setDrawingEnabled(false);
                document.getElementById('mapStatus').textContent = 'No path is being created';
                updateLegend();
            }
        });

        resetPathButton.addEventListener('click', resetPath);

        showYamlButton.addEventListener('click', showYamlPopup);
    }

    function updateLegend() {
        const legendList = document.getElementById('legendList');
        legendList.innerHTML = '';

        const input1 = document.getElementById('input1')?.value.toLowerCase() || '';
        const input2 = document.getElementById('input2')?.value.toLowerCase() || '';
        const input3 = document.getElementById('input3')?.value.toLowerCase() || '';
        const filters = [input1, input2, input3];
        
        // Get all matching path sets
        const matchingPathSets = filters.every(f => !f) ? pathSets : pathSets.filter(pathSet => {
            const pathSetName = pathSet.map(pathObj => pathObj.label).join('');
            return window.pathUtils.matchesPathPattern(pathSetName, filters);
        });
        
        document.getElementById('pathSetCount').textContent = 
            `(${matchingPathSets.length} set${matchingPathSets.length !== 1 ? 's' : ''})`;

        matchingPathSets.forEach((pathSet, setIndex) => {
            // Skip truly empty sets
            if (!pathSet || !Array.isArray(pathSet)) return;

            const setItem = document.createElement('li');
            const setContainer = document.createElement('div');
            setContainer.className = 'legend-item';
            
            const setLabel = document.createElement('span');
            const topLevelKey = pathSet.map(pathObj => pathObj.label).join('');
            setLabel.textContent = topLevelKey || `Set ${setIndex + 1}`;
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            const duplicateButton = document.createElement('button');
            duplicateButton.textContent = 'Duplicate Set';
            duplicateButton.addEventListener('click', () => {
                const newSet = pathSet?.map(pathObj => ({ ...pathObj, path: [...pathObj.path] })) || [];
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

            // Add to legend even if empty
            legendList.appendChild(setItem);

            // Only create sublist if there are paths
            if (pathSet && pathSet.length > 0) {
                const subList = document.createElement('ul');
                pathSet.forEach((pathObj, pathIndex) => {
                    const pathItem = document.createElement('li');
                    const pathContainer = document.createElement('div');
                    pathContainer.className = 'legend-item';
                    
                    const pathLabel = document.createElement('span');
                    pathLabel.textContent = `${pathObj.label} Path ${pathIndex + 1}`;
                    
                    // Check if this specific path is being edited
                    const isEditing = editingPath && 
                        currentSetIndex === setIndex && 
                        editingPathIndex === pathIndex;
                        
                    if (isEditing) {
                        pathLabel.style.backgroundColor = '#444';
                        pathLabel.style.padding = '2px 5px';
                        pathLabel.textContent += ' (editing)';
                    }
                    
                    const pathButtons = document.createElement('div');
                    pathButtons.className = 'button-container';

                    if (isEditing) {
                        const cancelButton = document.createElement('button');
                        cancelButton.textContent = 'Cancel Edit';
                        cancelButton.addEventListener('click', cancelEdit);
                        pathButtons.appendChild(cancelButton);
                    } else {
                        const editButton = document.createElement('button');
                        editButton.textContent = 'Edit';
                        editButton.addEventListener('click', () => editPath(pathObj, pathIndex, setIndex));
                        pathButtons.appendChild(editButton);
                    }
                    
                    pathContainer.appendChild(pathLabel);
                    pathContainer.appendChild(pathButtons);
                    pathItem.appendChild(pathContainer);
                    subList.appendChild(pathItem);
                });
                setItem.appendChild(subList);
            }
        });

        // Modify canvas click handler at the document level
        canvas.removeEventListener('click', handleCanvasClick);
        canvas.addEventListener('click', handleCanvasClick);
    }

    function showYamlPopup() {
        const yamlString = window.yamlProcessor.generateYaml(pathSets);
        
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

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.style.cssText = `
            position: sticky;
            top: 0;
            float: left;
            margin-bottom: 10px;
        `;
        copyButton.onclick = () => {
            navigator.clipboard.writeText(yamlString)
                .then(() => alert('YAML copied to clipboard!'))
                .catch(err => console.error('Failed to copy YAML: ', err));
        };

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.style.cssText = `
            position: sticky;
            top: 0;
            float: left;
            margin-left: 10px;
            margin-bottom: 10px;
        `;
        downloadButton.onclick = () => {
            const blob = new Blob([yamlString], { type: 'text/yaml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'puzzle-paths.yaml';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
        
        popup.appendChild(copyButton);
        popup.appendChild(downloadButton);
        popup.appendChild(closeButton);
        popup.appendChild(document.createTextNode(yamlString));
        document.body.appendChild(popup);
    }

    // Add new canvas click handler
    function handleCanvasClick(event) {
        // Only allow adding points if we're in draw mode, not edit mode
        if (isEditMode || !window.drawingState.isDrawing) return;
        
        if (window.drawingState.paths.some(p => JSON.stringify(p.path) === JSON.stringify(window.currentPath))) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / window.drawingState.scale;
        const y = (event.clientY - rect.top) / window.drawingState.scale;
        window.currentPath.push({ x, y });
        drawPaths();
    }

    // Initialize controls when document is ready
    initializeControls();
    window.paths = pathSets[currentSetIndex];
    resetFilters();
    updateLegend(); // Initial legend update

    // Replace the option click handler with this updated version
    document.querySelectorAll('.option').forEach(button => {
        button.addEventListener('click', (event) => {
            const button = event.target;
            const selectionBox = button.closest('.selection-box');
            const input = selectionBox.querySelector('input[type="hidden"]');
            const currentValue = input.value;
            const newValue = button.dataset.value;
            const selectionBoxes = Array.from(document.querySelectorAll('.selection-box'));
            const currentBoxIndex = selectionBoxes.indexOf(selectionBox);

            // If clicking the same button, deselect it
            if (currentValue === newValue) {
                input.value = '';
                selectionBox.querySelectorAll('.option').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Re-enable all options in subsequent boxes
                for (let i = currentBoxIndex + 1; i < selectionBoxes.length; i++) {
                    selectionBoxes[i].querySelectorAll('.option').forEach(btn => {
                        btn.classList.remove('disabled');
                        btn.disabled = false;
                    });
                }
            } else {
                // Select the new button
                input.value = newValue;
                selectionBox.querySelectorAll('.option').forEach(btn => {
                    btn.classList.remove('selected');
                });
                button.classList.add('selected');

                // Disable the selected value in subsequent boxes
                for (let i = currentBoxIndex + 1; i < selectionBoxes.length; i++) {
                    selectionBoxes[i].querySelectorAll('.option').forEach(btn => {
                        if (btn.dataset.value === newValue) {
                            btn.classList.add('disabled');
                            btn.disabled = true;
                        }
                    });
                }
            }

            // Update the legend with new filter values
            updateLegend();
        });
    });
});

function editPath(pathObj, pathIndex, setIndex) {
    // Store original path and start editing
    editingPath = { ...pathObj };
    editingPathIndex = pathIndex;
    window.currentPath = [...pathObj.path];
    currentSetIndex = setIndex;
    window.isEditMode = true;
    
    // Show only the editing path for visual clarity, but don't remove from set
    window.paths = [{
        path: window.currentPath,
        color: pathObj.color,
        label: pathObj.label
    }];
    window.drawingState.paths = window.paths;
    window.drawingState.isDrawing = false;
    
    drawPaths();
    updateLegend();
    
    const setName = pathSets[setIndex].map(p => p.label).join('');
    document.getElementById('mapStatus').textContent = 
        `Editing Path Set ${setName} Path ${pathIndex + 1} (${pathObj.label})`;
}

function resetPath() {
    if (editingPath) {
        // Restore original path and re-enter edit mode
        window.currentPath = [...editingPath.path];
        window.paths = [{
            path: window.currentPath,
            color: editingPath.color,
            label: editingPath.label
        }];
        window.drawingState.paths = window.paths;
        window.drawingState.isDrawing = false;
        window.isEditMode = true;
        
        drawPaths();
        const setName = pathSets[currentSetIndex].map(p => p.label).join('');
        document.getElementById('mapStatus').textContent = 
            `Editing Path Set ${setName} Path ${editingPathIndex + 1} (${editingPath.label})`;
    } else {
        // Clear path if not editing
        window.currentPath = [];
        drawPaths();
        document.getElementById('mapStatus').textContent = 'No path is being created';
    }
}

function cancelEdit() {
    // Restore the path to its original state
    window.currentPath = [];
    if (editingPath) {
        window.paths = pathSets[currentSetIndex];
        window.drawingState.paths = window.paths;
    }
    editingPath = null;
    editingPathIndex = -1;
    window.isEditMode = false;
    drawPaths();
    updateLegend();
    window.drawingAPI.setDrawingEnabled(false);
    document.getElementById('mapStatus').textContent = 'No path is being created';
}
