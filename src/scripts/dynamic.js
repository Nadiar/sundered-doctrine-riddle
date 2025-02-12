class UIManager {
    constructor() {
        this.inputs = ['input1', 'input2', 'input3'].map(id => document.getElementById(id));
        this.selectionBoxes = this.inputs.slice(1).map(input => input.closest('.selection-box'));
        this.yamlInput = document.getElementById('yamlInput');
        this.drawingReady = false;
        this.bindEvents();
    }

    initializeUI() {
        // Ensure inputs are cleared and boxes are disabled
        this.selectionBoxes.forEach(box => box.classList.add('disabled'));
        this.clearAllSelections();
        
        // Only try to draw if the drawing system is ready
        if (this.drawingReady) {
            window.drawingState.paths = [];
            drawPaths();
        }
    }

    clearAllSelections() {
        this.inputs.forEach(input => {
            input.value = '';
            const box = input.closest('.selection-box');
            box.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
            box.querySelector('.option[data-value=""]')?.classList.add('selected');
        });
    }

    handleOptionClick(event) {
        console.log('Option clicked:', event.target.dataset.value);
        const button = event.target;
        const value = button.getAttribute('data-value');
        const selectionBox = button.closest('.selection-box');
        const input = selectionBox.querySelector('input[type="hidden"]');
        
        console.log('Before update:', {
            value,
            currentInputs: {
                input1: this.inputs[0].value,
                input2: this.inputs[1].value,
                input3: this.inputs[2].value
            }
        });

        // Handle button selection
        selectionBox.querySelectorAll('.option').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        input.value = value;

        // Handle dependencies
        if (input === this.inputs[0]) {
            if (value) {
                this.selectionBoxes[0].classList.remove('disabled');
            } else {
                this.selectionBoxes[0].classList.add('disabled');
                this.selectionBoxes[1].classList.add('disabled');
                this.inputs[1].value = '';
                this.inputs[2].value = '';
                this.resetSelectionBox(this.selectionBoxes[0]);
                this.resetSelectionBox(this.selectionBoxes[1]);
            }
        } else if (input === this.inputs[1]) {
            if (value && this.inputs[0].value) {
                this.selectionBoxes[1].classList.remove('disabled');
            } else {
                this.selectionBoxes[1].classList.add('disabled');
                this.inputs[2].value = '';
                this.resetSelectionBox(this.selectionBoxes[1]);
            }
        }

        console.log('After update:', {
            value,
            currentInputs: {
                input1: this.inputs[0].value,
                input2: this.inputs[1].value,
                input3: this.inputs[2].value
            }
        });

        // Update display if we have data
        if (window.yamlData) {
            console.log('Updating display with YAML data:', window.yamlData);
            this.updateDisplay();
        } else {
            console.log('No YAML data available');
        }
    }

    resetSelectionBox(box) {
        box.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
        box.querySelector('.option[data-value=""]').classList.add('selected');
    }

    updateDisplay() {
        if (!window.yamlData || !this.drawingReady) {
            console.log('Not ready:', { yamlData: !!window.yamlData, drawingReady: this.drawingReady });
            return;
        }

        const inputs = this.inputs.map(input => input.value.toLowerCase());

        console.log('Processing inputs:', inputs);
        window.drawingState.paths = [];

        if (!inputs[0]) {
            console.log('No inputs, clearing paths');
            drawPaths();
            return;
        }

        try {
            let matchingPaths = window.pathUtils.filterPathSets(window.yamlData, inputs.filter(Boolean));
            console.log('Found matching paths:', matchingPaths);

            if (matchingPaths && matchingPaths.length > 0) {
                const pathSet = matchingPaths[0];
                const setName = Object.keys(pathSet)[0];
                const pathsData = pathSet[setName];

                console.log('Processing pathSet:', { setName, pathsData });

                // Add paths in order
                const newPaths = [];

                inputs.forEach((input, index) => {
                    if (!input) return;
                    const pathKey = input.toUpperCase();
                    if (pathsData[pathKey]) {
                        console.log(`Processing ${pathKey}:`, pathsData[pathKey]);
                        const path = pathsData[pathKey].Coords.map(coord => {
                            const [x, y] = coord.map(Number);
                            console.log('Coordinate:', { x, y });
                            return { x, y };
                        });

                        newPaths.push({
                            path,
                            color: window.drawingSystem.colors[index % window.drawingSystem.colors.length],
                            label: pathKey
                        });
                    }
                });

                console.log('Created paths:', newPaths);
                window.drawingState.paths = newPaths;
                drawPaths(); // Ensure drawPaths is called after paths are set
            } else {
                console.log('No matching paths found');
                drawPaths();
            }
        } catch (error) {
            console.error('Error in updateDisplay:', error);
            drawPaths();
        }
    }

    bindEvents() {
        document.querySelectorAll('.option').forEach(button => {
            button.addEventListener('click', this.handleOptionClick.bind(this));
        });

        window.addEventListener('yamlDataUpdated', () => this.updateDisplay());
        window.addEventListener('drawingSystemReady', () => {
            this.drawingReady = true;
            this.initializeUI();
        });

        this.yamlInput?.addEventListener('change', async (event) => {
            try {
                await window.yamlProcessor.handleFileUpload(event.target.files[0]);
            } catch (error) {
                console.error('Failed to load YAML file:', error);
            }
        });
    }
}

// Initialize UI when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
});
