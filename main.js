// Visgen - AI Visual Creator Main JavaScript
class VisgenEditor {
    constructor() {
        this.canvas = document.getElementById('glcanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentElement = null;
        this.elements = [];
        this.selectedElement = null;
        this.isAdvancedMode = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.stats = {
            creations: 0,
            exports: 0
        };
        this.canvasBackground = '#ffffff';
        this.backgroundType = 'solid';
        
        this.init();
        this.setupEventListeners();
        this.setupThreeJS();
        this.loadStats();
    }

    init() {
        // Initialize canvas
        this.updateCanvasSize();
        this.redrawCanvas();
        
        // Set initial theme
        const savedTheme = localStorage.getItem('visgen-theme') || 'dark';
        this.setTheme(savedTheme);
        
        // Update UI elements
        this.updateCanvasInfo();
    }

    setupEventListeners() {
        // Theme switcher
        const themeBtn = document.getElementById('themeBtn');
        const themeDropdown = document.getElementById('themeDropdown');
        
        themeBtn.addEventListener('click', () => {
            themeDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!themeBtn.contains(e.target) && !themeDropdown.contains(e.target)) {
                themeDropdown.classList.remove('show');
            }
        });

        // Theme options
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.setTheme(theme);
                themeBtn.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
                themeDropdown.classList.remove('show');
            });
        });

        // Edit mode toggle
        document.getElementById('basicModeBtn').addEventListener('click', () => {
            this.setEditMode('basic');
        });

        document.getElementById('advancedModeBtn').addEventListener('click', () => {
            this.setEditMode('advanced');
        });

        // Media controls
        document.getElementById('addImageBtn').addEventListener('click', () => {
            this.addImage();
        });

        document.getElementById('addTextBtn').addEventListener('click', () => {
            this.addText();
        });

        document.getElementById('addVideoBtn').addEventListener('click', () => {
            alert('Video support coming soon in Beta!');
        });

        // Canvas ratio selector
        document.getElementById('canvasRatio').addEventListener('change', (e) => {
            this.updateCanvasRatio(e.target.value);
        });

        // Canvas mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

        // Basic editing controls
        this.setupBasicControls();
        
        // Advanced editing controls
        this.setupAdvancedControls();

        // Modal controls
        this.setupModalControls();

        // Export functionality
        this.setupExportControls();

        // Live CSS
        this.setupLiveCSSControls();
    }

    setupBasicControls() {
        // Position controls
        document.getElementById('posX').addEventListener('input', (e) => {
            this.updateElementProperty('x', parseFloat(e.target.value) || 0);
        });

        document.getElementById('posY').addEventListener('input', (e) => {
            this.updateElementProperty('y', parseFloat(e.target.value) || 0);
        });

        // Size controls
        document.getElementById('width').addEventListener('input', (e) => {
            this.updateElementProperty('width', parseFloat(e.target.value) || 100);
        });

        document.getElementById('height').addEventListener('input', (e) => {
            this.updateElementProperty('height', parseFloat(e.target.value) || 100);
        });

        // Rotation control
        document.getElementById('rotation').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 0;
            document.getElementById('rotationValue').textContent = value + '°';
            this.updateElementProperty('rotation', value);
        });

        // Opacity control
        document.getElementById('opacity').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 1;
            document.getElementById('opacityValue').textContent = Math.round(value * 100) + '%';
            this.updateElementProperty('opacity', value);
        });

        // Background controls
        document.getElementById('bgColor').addEventListener('input', (e) => {
            this.updateCanvasBackground(e.target.value);
        });

        document.getElementById('bgType').addEventListener('change', (e) => {
            this.updateBackgroundType(e.target.value);
        });

        // Border controls
        document.getElementById('borderWidth').addEventListener('input', (e) => {
            this.updateElementProperty('borderWidth', parseFloat(e.target.value) || 0);
        });

        document.getElementById('borderColor').addEventListener('input', (e) => {
            this.updateElementProperty('borderColor', e.target.value);
        });

        // Shadow controls
        document.getElementById('shadowX').addEventListener('input', (e) => {
            this.updateElementProperty('shadowX', parseFloat(e.target.value) || 0);
        });

        document.getElementById('shadowY').addEventListener('input', (e) => {
            this.updateElementProperty('shadowY', parseFloat(e.target.value) || 0);
        });

        document.getElementById('shadowBlur').addEventListener('input', (e) => {
            this.updateElementProperty('shadowBlur', parseFloat(e.target.value) || 0);
        });

        // Text styling controls
        document.getElementById('fontFamily').addEventListener('change', (e) => {
            this.updateElementProperty('fontFamily', e.target.value);
        });

        document.getElementById('fontSize').addEventListener('input', (e) => {
            this.updateElementProperty('fontSize', parseFloat(e.target.value) || 16);
        });

        document.getElementById('textColor').addEventListener('input', (e) => {
            this.updateElementProperty('color', e.target.value);
        });

        document.getElementById('textAlign').addEventListener('change', (e) => {
            this.updateElementProperty('textAlign', e.target.value);
        });

        // Font style buttons
        document.getElementById('boldBtn').addEventListener('click', (e) => {
            e.target.classList.toggle('active');
            this.updateElementProperty('fontWeight', e.target.classList.contains('active') ? 'bold' : 'normal');
        });

        document.getElementById('italicBtn').addEventListener('click', (e) => {
            e.target.classList.toggle('active');
            this.updateElementProperty('fontStyle', e.target.classList.contains('active') ? 'italic' : 'normal');
        });

        document.getElementById('underlineBtn').addEventListener('click', (e) => {
            e.target.classList.toggle('active');
            this.updateElementProperty('textDecoration', e.target.classList.contains('active') ? 'underline' : 'none');
        });
    }

    setupAdvancedControls() {
        // 3D Position controls
        document.getElementById('pos3DX').addEventListener('input', (e) => {
            this.updateElementProperty('pos3DX', parseFloat(e.target.value) || 0);
        });

        document.getElementById('pos3DY').addEventListener('input', (e) => {
            this.updateElementProperty('pos3DY', parseFloat(e.target.value) || 0);
        });

        document.getElementById('pos3DZ').addEventListener('input', (e) => {
            this.updateElementProperty('pos3DZ', parseFloat(e.target.value) || 0);
        });

        // 3D Rotation controls
        document.getElementById('rotateX').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 0;
            document.getElementById('rotateXValue').textContent = value + '°';
            this.updateElementProperty('rotateX', value);
        });

        document.getElementById('rotateY').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 0;
            document.getElementById('rotateYValue').textContent = value + '°';
            this.updateElementProperty('rotateY', value);
        });

        document.getElementById('rotateZ').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 0;
            document.getElementById('rotateZValue').textContent = value + '°';
            this.updateElementProperty('rotateZ', value);
        });

        // 3D Scale controls
        document.getElementById('scaleX').addEventListener('input', (e) => {
            this.updateElementProperty('scaleX', parseFloat(e.target.value) || 1);
        });

        document.getElementById('scaleY').addEventListener('input', (e) => {
            this.updateElementProperty('scaleY', parseFloat(e.target.value) || 1);
        });

        document.getElementById('scaleZ').addEventListener('input', (e) => {
            this.updateElementProperty('scaleZ', parseFloat(e.target.value) || 1);
        });

        // Camera controls
        document.getElementById('cameraX').addEventListener('input', (e) => {
            if (this.camera) {
                this.camera.position.x = parseFloat(e.target.value) || 0;
                this.render3D();
            }
        });

        document.getElementById('cameraY').addEventListener('input', (e) => {
            if (this.camera) {
                this.camera.position.y = parseFloat(e.target.value) || 0;
                this.render3D();
            }
        });

        document.getElementById('cameraZ').addEventListener('input', (e) => {
            if (this.camera) {
                this.camera.position.z = parseFloat(e.target.value) || 5;
                this.render3D();
            }
        });

        // Field of view
        document.getElementById('fov').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 75;
            document.getElementById('fovValue').textContent = value + '°';
            if (this.camera) {
                this.camera.fov = value;
                this.camera.updateProjectionMatrix();
                this.render3D();
            }
        });

        // Lighting controls
        document.getElementById('lightColor').addEventListener('input', (e) => {
            this.updateLighting('color', e.target.value);
        });

        document.getElementById('lightIntensity').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 1;
            document.getElementById('lightIntensityValue').textContent = value.toFixed(1);
            this.updateLighting('intensity', value);
        });

        document.getElementById('lightX').addEventListener('input', (e) => {
            this.updateLighting('position', 'x', parseFloat(e.target.value) || 10);
        });

        document.getElementById('lightY').addEventListener('input', (e) => {
            this.updateLighting('position', 'y', parseFloat(e.target.value) || 10);
        });

        document.getElementById('lightZ').addEventListener('input', (e) => {
            this.updateLighting('position', 'z', parseFloat(e.target.value) || 10);
        });

        // Material controls
        document.getElementById('materialType').addEventListener('change', (e) => {
            this.updateElementProperty('materialType', e.target.value);
        });

        document.getElementById('metalness').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 0;
            document.getElementById('metalnessValue').textContent = value.toFixed(1);
            this.updateElementProperty('metalness', value);
        });

        document.getElementById('roughness').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 0.5;
            document.getElementById('roughnessValue').textContent = value.toFixed(1);
            this.updateElementProperty('roughness', value);
        });

        // Effects controls
        document.getElementById('wireframe').addEventListener('change', (e) => {
            this.updateElementProperty('wireframe', e.target.checked);
        });

        document.getElementById('castShadow').addEventListener('change', (e) => {
            this.updateElementProperty('castShadow', e.target.checked);
        });

        document.getElementById('receiveShadow').addEventListener('change', (e) => {
            this.updateElementProperty('receiveShadow', e.target.checked);
        });
    }

    setupModalControls() {
        // Preset modal
        document.getElementById('presetBtn').addEventListener('click', () => {
            document.getElementById('presetModal').classList.add('show');
        });

        document.getElementById('closePresetModal').addEventListener('click', () => {
            document.getElementById('presetModal').classList.remove('show');
        });

        // Preset items
        document.querySelectorAll('.preset-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const preset = e.currentTarget.dataset.preset;
                this.applyPreset(preset);
                document.getElementById('presetModal').classList.remove('show');
            });
        });

        // Profile modal
        document.getElementById('profileBtn').addEventListener('click', () => {
            this.updateProfileStats();
            document.getElementById('profileModal').classList.add('show');
        });

        document.getElementById('closeProfileModal').addEventListener('click', () => {
            document.getElementById('profileModal').classList.remove('show');
        });

        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    setupExportControls() {
        // Export modal
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.openExportModal();
        });

        document.getElementById('closeExportModal').addEventListener('click', () => {
            document.getElementById('exportModal').classList.remove('show');
        });

        // Format selection
        document.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!e.target.classList.contains('disabled')) {
                    document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                }
            });
        });

        // Quality control
        document.getElementById('qualitySlider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('qualityValue').textContent = Math.round(value * 100) + '%';
        });

        document.getElementById('maxQuality').addEventListener('change', (e) => {
            const slider = document.getElementById('qualitySlider');
            if (e.target.checked) {
                slider.value = 1.0;
                document.getElementById('qualityValue').textContent = '100%';
            }
        });

        // Preset recommendations
        document.querySelectorAll('.preset-rec').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                const quality = parseFloat(e.target.dataset.quality);
                
                document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
                document.querySelector(`[data-format="${format}"]`).classList.add('active');
                
                document.getElementById('qualitySlider').value = quality;
                document.getElementById('qualityValue').textContent = Math.round(quality * 100) + '%';
            });
        });

        // Export confirmation
        document.getElementById('confirmExport').addEventListener('click', () => {
            this.startExport();
        });
    }

    setupLiveCSSControls() {
        // Live CSS modal
        document.getElementById('liveCssBtn').addEventListener('click', () => {
            document.getElementById('cssModal').classList.add('show');
        });

        document.getElementById('closeCssModal').addEventListener('click', () => {
            document.getElementById('cssModal').classList.remove('show');
        });

        // CSS actions
        document.getElementById('applyCss').addEventListener('click', () => {
            this.applyLiveCSS();
        });

        document.getElementById('resetCss').addEventListener('click', () => {
            this.resetLiveCSS();
        });
    }

    setupThreeJS() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, preserveDrawingBuffer: true });
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Store light reference
        this.directionalLight = directionalLight;

        this.render3D();
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find clicked element
        const clickedElement = this.getElementAtPosition(x, y);
        if (clickedElement) {
            this.selectedElement = clickedElement;
            this.isDragging = true;
            this.dragOffset = {
                x: x - clickedElement.x,
                y: y - clickedElement.y
            };
            this.updateControlsForElement(clickedElement);
        }
    }

    handleMouseMove(e) {
        if (this.isDragging && this.selectedElement) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.selectedElement.x = x - this.dragOffset.x;
            this.selectedElement.y = y - this.dragOffset.y;
            
            // Update position controls
            document.getElementById('posX').value = this.selectedElement.x;
            document.getElementById('posY').value = this.selectedElement.y;
            
            this.redrawCanvas();
        }
    }

    handleMouseUp(e) {
        this.isDragging = false;
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const clickedElement = this.getElementAtPosition(x, y);
        if (clickedElement) {
            this.selectedElement = clickedElement;
            this.updateControlsForElement(clickedElement);
        } else {
            this.selectedElement = null;
            this.clearControls();
        }
        this.redrawCanvas();
    }

    getElementAtPosition(x, y) {
        // Check elements in reverse order (top to bottom)
        for (let i = this.elements.length - 1; i >= 0; i--) {
            const element = this.elements[i];
            if (x >= element.x && x <= element.x + element.width &&
                y >= element.y && y <= element.y + element.height) {
                return element;
            }
        }
        return null;
    }

    updateControlsForElement(element) {
        // Update basic controls
        document.getElementById('posX').value = element.x || 0;
        document.getElementById('posY').value = element.y || 0;
        document.getElementById('width').value = element.width || 100;
        document.getElementById('height').value = element.height || 100;
        document.getElementById('rotation').value = element.rotation || 0;
        document.getElementById('rotationValue').textContent = (element.rotation || 0) + '°';
        document.getElementById('opacity').value = element.opacity || 1;
        document.getElementById('opacityValue').textContent = Math.round((element.opacity || 1) * 100) + '%';
        
        // Update border controls
        document.getElementById('borderWidth').value = element.borderWidth || 0;
        document.getElementById('borderColor').value = element.borderColor || '#000000';
        
        // Update shadow controls
        document.getElementById('shadowX').value = element.shadowX || 0;
        document.getElementById('shadowY').value = element.shadowY || 0;
        document.getElementById('shadowBlur').value = element.shadowBlur || 0;

        // Update text controls if it's a text element
        if (element.type === 'text') {
            document.getElementById('fontFamily').value = element.fontFamily || 'Arial';
            document.getElementById('fontSize').value = element.fontSize || 16;
            document.getElementById('textColor').value = element.color || '#000000';
            document.getElementById('textAlign').value = element.textAlign || 'left';
            
            // Update font style buttons
            document.getElementById('boldBtn').classList.toggle('active', element.fontWeight === 'bold');
            document.getElementById('italicBtn').classList.toggle('active', element.fontStyle === 'italic');
            document.getElementById('underlineBtn').classList.toggle('active', element.textDecoration === 'underline');
        }
        
        // Update advanced 3D controls
        if (this.isAdvancedMode) {
            document.getElementById('pos3DX').value = element.pos3DX || 0;
            document.getElementById('pos3DY').value = element.pos3DY || 0;
            document.getElementById('pos3DZ').value = element.pos3DZ || 0;
            
            document.getElementById('rotateX').value = element.rotateX || 0;
            document.getElementById('rotateXValue').textContent = (element.rotateX || 0) + '°';
            document.getElementById('rotateY').value = element.rotateY || 0;
            document.getElementById('rotateYValue').textContent = (element.rotateY || 0) + '°';
            document.getElementById('rotateZ').value = element.rotateZ || 0;
            document.getElementById('rotateZValue').textContent = (element.rotateZ || 0) + '°';
            
            document.getElementById('scaleX').value = element.scaleX || 1;
            document.getElementById('scaleY').value = element.scaleY || 1;
            document.getElementById('scaleZ').value = element.scaleZ || 1;
            
            document.getElementById('materialType').value = element.materialType || 'basic';
            document.getElementById('metalness').value = element.metalness || 0;
            document.getElementById('metalnessValue').textContent = (element.metalness || 0).toFixed(1);
            document.getElementById('roughness').value = element.roughness || 0.5;
            document.getElementById('roughnessValue').textContent = (element.roughness || 0.5).toFixed(1);
            
            document.getElementById('wireframe').checked = element.wireframe || false;
            document.getElementById('castShadow').checked = element.castShadow || false;
            document.getElementById('receiveShadow').checked = element.receiveShadow || false;
        }
    }

    clearControls() {
        // Reset all controls to default values
        document.getElementById('posX').value = 0;
        document.getElementById('posY').value = 0;
        document.getElementById('width').value = 100;
        document.getElementById('height').value = 100;
        document.getElementById('rotation').value = 0;
        document.getElementById('rotationValue').textContent = '0°';
        document.getElementById('opacity').value = 1;
        document.getElementById('opacityValue').textContent = '100%';
        document.getElementById('borderWidth').value = 0;
        document.getElementById('borderColor').value = '#000000';
        document.getElementById('shadowX').value = 0;
        document.getElementById('shadowY').value = 0;
        document.getElementById('shadowBlur').value = 0;
        
        // Clear font style buttons
        document.getElementById('boldBtn').classList.remove('active');
        document.getElementById('italicBtn').classList.remove('active');
        document.getElementById('underlineBtn').classList.remove('active');
        
        // Clear advanced controls
        if (this.isAdvancedMode) {
            document.getElementById('pos3DX').value = 0;
            document.getElementById('pos3DY').value = 0;
            document.getElementById('pos3DZ').value = 0;
            document.getElementById('rotateX').value = 0;
            document.getElementById('rotateXValue').textContent = '0°';
            document.getElementById('rotateY').value = 0;
            document.getElementById('rotateYValue').textContent = '0°';
            document.getElementById('rotateZ').value = 0;
            document.getElementById('rotateZValue').textContent = '0°';
            document.getElementById('scaleX').value = 1;
            document.getElementById('scaleY').value = 1;
            document.getElementById('scaleZ').value = 1;
            document.getElementById('wireframe').checked = false;
            document.getElementById('castShadow').checked = false;
            document.getElementById('receiveShadow').checked = false;
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('visgen-theme', theme);
        
        // Update theme button text
        const themeBtn = document.getElementById('themeBtn');
        themeBtn.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
    }

    setEditMode(mode) {
        this.isAdvancedMode = mode === 'advanced';
        
        // Update button states
        document.getElementById('basicModeBtn').classList.toggle('active', mode === 'basic');
        document.getElementById('advancedModeBtn').classList.toggle('active', mode === 'advanced');
        
        // Show/hide sections
        const basicSection = document.getElementById('basicEditSection');
        const textSection = document.getElementById('textEditSection');
        const advancedSection = document.getElementById('advancedEditSection');
        
        if (mode === 'basic') {
            basicSection.style.display = 'block';
            textSection.style.display = 'block';
            advancedSection.style.display = 'none';
        } else {
            basicSection.style.display = 'block';
            textSection.style.display = 'block';
            advancedSection.style.display = 'block';
        }
        
        // Update controls for selected element if any
        if (this.selectedElement) {
            this.updateControlsForElement(this.selectedElement);
        }
    }

    updateCanvasRatio(ratio) {
        const ratios = {
            '1:1': [800, 800],
            '4:5': [640, 800],
            '16:9': [800, 450],
            '9:16': [450, 800],
            '1.91:1': [800, 419],
            '16:10': [800, 500],
            '3:2': [800, 533],
            '4:3': [800, 600],
            '21:9': [800, 343],
            '1:2': [400, 800],
            '1200:630': [800, 420],
            '1024:512': [800, 400],
            '1080:1920': [450, 800],
            '1280:720': [800, 450],
            '1920:1080': [800, 450]
        };

        if (ratios[ratio]) {
            const [width, height] = ratios[ratio];
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
            
            if (this.renderer) {
                this.renderer.setSize(width, height);
                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();
                this.render3D();
            }
            
            this.updateCanvasInfo();
            this.redrawCanvas();
        }
    }

    updateCanvasSize() {
        // Set default canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.width = '800px';
        this.canvas.style.height = '600px';
    }

    updateCanvasInfo() {
        document.getElementById('canvasSize').textContent = `${this.canvas.width} x ${this.canvas.height}`;
        const ratio = this.calculateRatio(this.canvas.width, this.canvas.height);
        document.getElementById('canvasRatioDisplay').textContent = ratio;
    }

    calculateRatio(width, height) {
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(width, height);
        return `${width / divisor}:${height / divisor}`;
    }

    redrawCanvas() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw grid
        this.drawGrid();
        
        // Draw all elements
        this.elements.forEach(element => {
            this.drawElement(element);
        });
        
        // Draw selection outline
        if (this.selectedElement) {
            this.drawSelectionOutline(this.selectedElement);
        }
    }

    drawBackground() {
        if (this.backgroundType === 'gradient') {
            const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
            gradient.addColorStop(0, this.canvasBackground);
            gradient.addColorStop(1, '#ffffff');
            this.ctx.fillStyle = gradient;
        } else {
            this.ctx.fillStyle = this.canvasBackground;
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.3;

        const gridSize = 20;
        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }

    drawElement(element) {
        this.ctx.save();
        
        // Apply transformations
        this.ctx.globalAlpha = element.opacity || 1;
        
        // Apply 3D transformations if in advanced mode
        let transformX = element.x + (element.pos3DX || 0);
        let transformY = element.y + (element.pos3DY || 0);
        
        // Apply 3D scaling
        const scaleX = element.scaleX || 1;
        const scaleY = element.scaleY || 1;
        
        // Calculate total rotation (2D + 3D)
        const totalRotation = (element.rotation || 0) + (element.rotateZ || 0);
        
        if (totalRotation !== 0 || scaleX !== 1 || scaleY !== 1) {
            this.ctx.translate(transformX + element.width/2, transformY + element.height/2);
            this.ctx.rotate(totalRotation * Math.PI / 180);
            this.ctx.scale(scaleX, scaleY);
            this.ctx.translate(-element.width/2, -element.height/2);
        } else {
            this.ctx.translate(transformX, transformY);
        }
        
        // Apply shadow if specified
        if ((element.shadowX || 0) !== 0 || (element.shadowY || 0) !== 0 || (element.shadowBlur || 0) !== 0) {
            this.ctx.shadowOffsetX = element.shadowX || 0;
            this.ctx.shadowOffsetY = element.shadowY || 0;
            this.ctx.shadowBlur = element.shadowBlur || 0;
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        }
        
        // Draw based on element type
        if (element.type === 'image') {
            // Apply advanced effects for images
            if (element.wireframe) {
                this.ctx.strokeStyle = element.borderColor || '#000000';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(0, 0, element.width, element.height);
            } else {
                this.ctx.drawImage(element.image, 0, 0, element.width, element.height);
            }
        } else if (element.type === 'text') {
            // Set font properties
            this.ctx.font = `${element.fontWeight || 'normal'} ${element.fontStyle || 'normal'} ${element.fontSize || 16}px ${element.fontFamily || 'Arial'}`;
            this.ctx.fillStyle = element.color || '#000000';
            this.ctx.textAlign = element.textAlign || 'left';
            
            // Apply wireframe effect for text
            if (element.wireframe) {
                this.ctx.strokeStyle = element.color || '#000000';
                this.ctx.lineWidth = 1;
                this.ctx.strokeText(element.text, 0, element.fontSize || 16);
            } else {
                this.ctx.fillText(element.text, 0, element.fontSize || 16);
            }
            
            // Apply text decoration
            if (element.textDecoration === 'underline') {
                const textWidth = this.ctx.measureText(element.text).width;
                this.ctx.strokeStyle = element.color || '#000000';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(0, (element.fontSize || 16) + 2);
                this.ctx.lineTo(textWidth, (element.fontSize || 16) + 2);
                this.ctx.stroke();
            }
        }
        
        // Draw border if specified
        if ((element.borderWidth || 0) > 0) {
            this.ctx.strokeStyle = element.borderColor || '#000000';
            this.ctx.lineWidth = element.borderWidth;
            this.ctx.strokeRect(0, 0, element.width, element.height);
        }
        
        this.ctx.restore();
    }

    drawSelectionOutline(element) {
        this.ctx.save();
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        const x = element.x + (element.pos3DX || 0);
        const y = element.y + (element.pos3DY || 0);
        
        this.ctx.strokeRect(x - 2, y - 2, element.width + 4, element.height + 4);
        this.ctx.restore();
    }

    addImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const element = {
                            type: 'image',
                            image: img,
                            x: 50,
                            y: 50,
                            width: Math.min(200, img.width),
                            height: Math.min(150, img.height * (200 / img.width)),
                            rotation: 0,
                            opacity: 1,
                            borderWidth: 0,
                            borderColor: '#000000',
                            shadowX: 0,
                            shadowY: 0,
                            shadowBlur: 0,
                            // Advanced 3D properties
                            pos3DX: 0,
                            pos3DY: 0,
                            pos3DZ: 0,
                            rotateX: 0,
                            rotateY: 0,
                            rotateZ: 0,
                            scaleX: 1,
                            scaleY: 1,
                            scaleZ: 1,
                            materialType: 'basic',
                            metalness: 0,
                            roughness: 0.5,
                            wireframe: false,
                            castShadow: false,
                            receiveShadow: false
                        };
                        this.elements.push(element);
                        this.selectedElement = element;
                        this.updateControlsForElement(element);
                        this.redrawCanvas();
                        this.stats.creations++;
                        this.saveStats();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    addText() {
        const text = prompt('Enter text:');
        if (text) {
            const element = {
                type: 'text',
                text: text,
                x: 50,
                y: 100,
                width: 200,
                height: 30,
                fontSize: 24,
                fontFamily: 'Arial',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#000000',
                textAlign: 'left',
                textDecoration: 'none',
                rotation: 0,
                opacity: 1,
                borderWidth: 0,
                borderColor: '#000000',
                shadowX: 0,
                shadowY: 0,
                shadowBlur: 0,
                // Advanced 3D properties
                pos3DX: 0,
                pos3DY: 0,
                pos3DZ: 0,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1,
                materialType: 'basic',
                metalness: 0,
                roughness: 0.5,
                wireframe: false,
                castShadow: false,
                receiveShadow: false
            };
            this.elements.push(element);
            this.selectedElement = element;
            this.updateControlsForElement(element);
            this.redrawCanvas();
            this.stats.creations++;
            this.saveStats();
        }
    }

    updateElementProperty(property, value) {
        if (this.selectedElement) {
            this.selectedElement[property] = value;
            
            // Special handling for text width calculation
            if (this.selectedElement.type === 'text' && (property === 'fontSize' || property === 'fontFamily' || property === 'text')) {
                this.ctx.font = `${this.selectedElement.fontWeight || 'normal'} ${this.selectedElement.fontStyle || 'normal'} ${this.selectedElement.fontSize || 16}px ${this.selectedElement.fontFamily || 'Arial'}`;
                const textWidth = this.ctx.measureText(this.selectedElement.text).width;
                this.selectedElement.width = textWidth;
                document.getElementById('width').value = textWidth;
            }
            
            this.redrawCanvas();
        }
    }

    updateLighting(property, axis, value) {
        if (this.directionalLight) {
            if (property === 'color') {
                this.directionalLight.color.setHex(parseInt(axis.replace('#', '0x')));
            } else if (property === 'intensity') {
                this.directionalLight.intensity = axis;
            } else if (property === 'position') {
                this.directionalLight.position[axis] = value;
            }
            this.render3D();
        }
    }

    render3D() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    applyPreset(preset) {
        if (!this.selectedElement) {
            alert('Please select an element first to apply a preset.');
            return;
        }

        const presets = {
            modern: {
                borderWidth: 2,
                borderColor: '#667eea',
                shadowX: 5,
                shadowY: 5,
                shadowBlur: 15,
                opacity: 0.9
            },
            vintage: {
                borderWidth: 3,
                borderColor: '#8B4513',
                shadowX: 3,
                shadowY: 3,
                shadowBlur: 8,
                opacity: 0.8,
                scaleX: 0.95,
                scaleY: 0.95
            },
            neon: {
                borderWidth: 3,
                borderColor: '#00f2fe',
                shadowX: 0,
                shadowY: 0,
                shadowBlur: 20,
                opacity: 1,
                scaleX: 1.05,
                scaleY: 1.05
            },
            minimal: {
                borderWidth: 1,
                borderColor: '#e0e0e0',
                shadowX: 0,
                shadowY: 2,
                shadowBlur: 4,
                opacity: 1
            },
            gradient: {
                borderWidth: 0,
                shadowX: 8,
                shadowY: 8,
                shadowBlur: 25,
                opacity: 0.95,
                rotateZ: 2
            },
            shadow: {
                borderWidth: 0,
                shadowX: 10,
                shadowY: 15,
                shadowBlur: 30,
                opacity: 1,
                scaleX: 1.02,
                scaleY: 1.02
            }
        };

        const style = presets[preset];
        if (style) {
            Object.keys(style).forEach(key => {
                this.selectedElement[key] = style[key];
            });
            this.updateControlsForElement(this.selectedElement);
            this.redrawCanvas();
        }
    }

    openExportModal() {
        document.getElementById('exportModal').classList.add('show');
        
        // Update export preview
        const previewCanvas = document.getElementById('exportPreview');
        const previewCtx = previewCanvas.getContext('2d');
        
        // Scale down the main canvas to fit preview
        const scale = Math.min(previewCanvas.width / this.canvas.width, previewCanvas.height / this.canvas.height);
        const scaledWidth = this.canvas.width * scale;
        const scaledHeight = this.canvas.height * scale;
        const offsetX = (previewCanvas.width - scaledWidth) / 2;
        const offsetY = (previewCanvas.height - scaledHeight) / 2;
        
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCtx.drawImage(this.canvas, offsetX, offsetY, scaledWidth, scaledHeight);
    }

    startExport() {
        document.getElementById('exportModal').classList.remove('show');
        document.getElementById('progressModal').classList.add('show');
        
        const messages = [
            'Infusing pixels with energy...',
            'Crafting visual magic...',
            'Optimizing for perfection...',
            'Adding final touches...',
            'Almost ready to shine!'
        ];
        
        let progress = 0;
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');
        const progressMessage = document.getElementById('progressMessage');
        
        const interval = setInterval(() => {
            progress += 20;
            progressFill.style.width = progress + '%';
            progressPercent.textContent = progress + '%';
            
            if (progress < 100) {
                progressMessage.textContent = messages[Math.floor(progress / 20)];
            } else {
                progressMessage.textContent = 'Export complete!';
                clearInterval(interval);
                
                setTimeout(() => {
                    document.getElementById('progressModal').classList.remove('show');
                    this.downloadCanvas();
                    this.stats.exports++;
                    this.saveStats();
                }, 1000);
            }
        }, 1000);
    }

    downloadCanvas() {
        const format = document.querySelector('.format-btn.active').dataset.format;
        const quality = parseFloat(document.getElementById('qualitySlider').value);
        
        let mimeType = 'image/png';
        if (format === 'jpg' || format === 'jpeg') {
            mimeType = 'image/jpeg';
        } else if (format === 'webp') {
            mimeType = 'image/webp';
        }
        
        const link = document.createElement('a');
        link.download = `visgen-creation.${format}`;
        link.href = this.canvas.toDataURL(mimeType, quality);
        link.click();
    }

    applyLiveCSS() {
        const css = document.getElementById('cssTextarea').value;
        const styleElement = document.getElementById('live-css-styles') || document.createElement('style');
        styleElement.id = 'live-css-styles';
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
        
        document.getElementById('cssModal').classList.remove('show');
    }

    resetLiveCSS() {
        const styleElement = document.getElementById('live-css-styles');
        if (styleElement) {
            styleElement.remove();
        }
        document.getElementById('cssTextarea').value = '';
    }

    updateCanvasBackground(color) {
        this.canvasBackground = color;
        this.redrawCanvas();
    }

    updateBackgroundType(type) {
        this.backgroundType = type;
        this.redrawCanvas();
    }

    loadStats() {
        const saved = localStorage.getItem('visgen-stats');
        if (saved) {
            this.stats = JSON.parse(saved);
        }
    }

    saveStats() {
        localStorage.setItem('visgen-stats', JSON.stringify(this.stats));
    }

    updateProfileStats() {
        document.getElementById('creationCount').textContent = this.stats.creations;
        document.getElementById('exportCount').textContent = this.stats.exports;
    }
}

// Initialize Visgen when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VisgenEditor();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
