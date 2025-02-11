let pathSets = [[]];
let currentSetIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Function to load YAML from a file
    function loadYamlFromFile(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => jsyaml.load(text))
            .catch(error => {
                console.error('Error loading YAML from file:', error);
                return null;
            });
    }

    // Function to initialize path sets from YAML data
    function initializePathSets(yamlData) {
        // Clear existing pathSets
        pathSets = [];
        
        yamlData.forEach(set => {
            const setName = Object.keys(set)[0];
            const pathsData = set[setName];
            const newSet = [];
            
            Object.keys(pathsData).forEach((key, index) => {
                const coords = pathsData[key].Coords;
                const path = coords.map(coord => ({ x: coord[0], y: coord[1] }));
                const color = colors[index % colors.length];
                newSet.push({ path, color, label: key });
            });
            
            pathSets.push(newSet);
        });

        // Sort pathSets by top-level key
        pathSets.sort((a, b) => {
            const aKey = Object.keys(a[0])[0];
            const bKey = Object.keys(b[0])[0];
            return aKey.localeCompare(bKey);
        });

        currentSetIndex = 0;
        window.paths = pathSets[currentSetIndex];
        drawPaths();
        updateLegend();
    }

    // Load YAML data
    loadYamlFromFile('src/scripts/puzzle-paths.yaml')
        .then(yamlData => {
            if (yamlData) {
                initializePathSets(yamlData);
            } else {
                // Fallback to default YAML data
                const defaultYamlData = jsyaml.load(window.defaultYaml);
                initializePathSets(defaultYamlData);
            }
        });

    // Initialize controls
    function initializeControls() {
        const newPathButton = document.getElementById('newPath');
        const commitPathButton = document.getElementById('commitPath');
        const resetPathButton = document.getElementById('resetPath');
        const showYamlButton = document.getElementById('showYaml');
        const newPathSetButton = document.getElementById('newPathSet');
        const cleanUpButton = document.createElement('button');
        cleanUpButton.id = 'cleanUp';
        cleanUpButton.textContent = 'Clean Up Points';
        document.getElementById('mapControls').appendChild(cleanUpButton);

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
            window.drawingState.currentPath = [];
            window.paths = pathSets[currentSetIndex]; // Ensure paths is updated
            drawPaths();
            setDrawingEnabled(true);
            document.getElementById('mapStatus').textContent = `Creating path ${pathSets[currentSetIndex].length + 1} in the current set`;
        });

        commitPathButton.addEventListener('click', () => {
            console.log('Commit Path button clicked');
            if (window.drawingState.currentPath.length > 0) {
                console.log('Current path length:', window.drawingState.currentPath.length);
                const color = colors[pathSets[currentSetIndex].length % colors.length];
                const lastPoint = window.drawingState.currentPath[window.drawingState.currentPath.length - 1];
                const label = determineLabel(lastPoint.x * window.drawingState.scale, lastPoint.y * window.drawingState.scale);
                pathSets[currentSetIndex].push({ 
                    path: [...window.drawingState.currentPath], 
                    color, 
                    label 
                });
                console.log('Path added to pathSets:', pathSets[currentSetIndex]);
                window.paths = pathSets[currentSetIndex]; // Update window.paths
                window.drawingState.currentPath = []; // Clear currentPath
                drawPaths();
                setDrawingEnabled(false); // Disable drawing
                document.getElementById('mapStatus').textContent = 'No path is being created';
                updateLegend();
            } else {
                console.log('No path to commit');
            }
        });

        resetPathButton.addEventListener('click', () => {
            window.drawingState.currentPath = [];
            drawPaths();
            setDrawingEnabled(false);
            document.getElementById('mapStatus').textContent = 'No path is being created';
        });

        cleanUpButton.addEventListener('click', cleanUpPoints);

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
                setLabel.style.cursor = 'pointer';
                if (setIndex === currentSetIndex) {
                    setLabel.textContent += ' (Current)';
                    setLabel.style.fontWeight = 'bold';
                }
                setLabel.addEventListener('click', () => {
                    currentSetIndex = setIndex;
                    window.paths = pathSets[currentSetIndex];
                    drawPaths();
                    updateLegend();
                });
                
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

                const addButton = document.createElement('button');
                addButton.textContent = 'Add Path';
                addButton.disabled = pathSet.length >= 3;
                addButton.addEventListener('click', () => {
                    currentSetIndex = setIndex;
                    window.drawingState.currentPath = [];
                    window.paths = pathSets[currentSetIndex];
                    drawPaths();
                    setDrawingEnabled(true);
                    document.getElementById('mapStatus').textContent = `Creating path ${pathSets[currentSetIndex].length + 1} in the current set`;
                    updateLegend();
                });

                buttonContainer.appendChild(duplicateButton);
                buttonContainer.appendChild(deleteButton);
                buttonContainer.appendChild(addButton);
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
                    
                    if (window.drawingState.currentPath.length > 0 && 
                        JSON.stringify(pathObj.path) === JSON.stringify(window.drawingState.currentPath) &&
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
                        window.drawingState.currentPath = [...pathObj.path];
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

    function cleanUpPoints() {
        pathSets.forEach(pathSet => {
            pathSet.forEach(pathObj => {
                const newPath = [];
                const visited = new Set();

                pathObj.path.forEach((point, index) => {
                    if (!visited.has(index)) {
                        const closePoints = [point];
                        visited.add(index);

                        for (let i = index + 1; i < pathObj.path.length; i++) {
                            if (!visited.has(i)) {
                                const otherPoint = pathObj.path[i];
                                const distance = Math.sqrt(
                                    Math.pow(point.x - otherPoint.x, 2) +
                                    Math.pow(point.y - otherPoint.y, 2)
                                );
                                if (distance <= circleRadius) {
                                    closePoints.push(otherPoint);
                                    visited.add(i);
                                }
                            }
                        }

                        const avgX = closePoints.reduce((sum, p) => sum + p.x, 0) / closePoints.length;
                        const avgY = closePoints.reduce((sum, p) => sum + p.y, 0) / closePoints.length;
                        newPath.push({ x: avgX, y: avgY });
                    }
                });

                pathObj.path = newPath;
            });
        });

        drawPaths();
        updateLegend();
    }

    function filterLegend() {
        const input1 = document.getElementById('input1')?.value || '';
        const input2 = document.getElementById('input2')?.value || '';
        const input3 = document.getElementById('input3')?.value || '';
        const filters = [input1, input2, input3];

        let matchCount = 0;
        pathSets.forEach((pathSet, setIndex) => {
            const setItem = document.querySelector(`#legendList li:nth-child(${setIndex + 1})`);
            if (!setItem || pathSet.length === 0) return;

            const matches = window.pathUtils.matchesPathPattern(
                window.pathUtils.getPathSetName(pathSet),
                filters
            );

            if (matches) matchCount++;
            setItem.style.display = matches ? '' : 'none';
        });

        // Update the count display
        document.getElementById('pathSetCount').textContent = 
            `(${matchCount} match${matchCount !== 1 ? 'es' : ''})`;
    }

    document.querySelectorAll('.option').forEach(button => {
        button.addEventListener('click', (event) => {
            const button = event.target;
            const value = button.getAttribute('data-value');
            const input = button.closest('.selection-box').querySelector('input[type="hidden"]');
            
            // Toggle selection
            if (button.classList.contains('selected')) {
                button.classList.remove('selected');
                input.value = '';
            } else {
                // Remove 'selected' class from all buttons in the same selection box
                button.closest('.options').querySelectorAll('.option').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Add 'selected' class to the clicked button
                button.classList.add('selected');
                input.value = value;
            }

            filterLegend();
        });
    });

    // Initialize controls when document is ready
    initializeControls();
    window.paths = pathSets[currentSetIndex];
});
