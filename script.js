// Canvas presets configuration
const canvasPresets = {
    // Ratio presets
    'ratio-1-1': { width: 1080, height: 1080, name: '1:1 Square' },
    'ratio-16-9': { width: 1920, height: 1080, name: '16:9 Landscape' },
    'ratio-4-3': { width: 1440, height: 1080, name: '4:3 Standard' },
    'ratio-9-16': { width: 1080, height: 1920, name: '9:16 Portrait' },
    // Video Platforms
    'youtube-thumbnail': { width: 1280, height: 720, name: 'YouTube Thumbnail' },
    'youtube-banner': { width: 2560, height: 1440, name: 'YouTube Banner' },
    'youtube-shorts': { width: 1080, height: 1920, name: 'YouTube Shorts' },
    'tiktok-video': { width: 1080, height: 1920, name: 'TikTok Video' },
    'tiktok-profile': { width: 200, height: 200, name: 'TikTok Profile' },
    // Instagram
    'instagram-post': { width: 1080, height: 1080, name: 'Instagram Post' },
    'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story' },
    'instagram-reel': { width: 1080, height: 1920, name: 'Instagram Reel' },
    'instagram-profile': { width: 320, height: 320, name: 'Instagram Profile' },
    'instagram-highlight': { width: 1080, height: 1920, name: 'Instagram Highlight' },
    // Facebook
    'facebook-post': { width: 1200, height: 630, name: 'Facebook Post' },
    'facebook-cover': { width: 1640, height: 859, name: 'Facebook Cover' },
    'facebook-profile': { width: 170, height: 170, name: 'Facebook Profile' },
    'facebook-event': { width: 1920, height: 1080, name: 'Facebook Event' },
    'facebook-ad': { width: 1200, height: 628, name: 'Facebook Ad' },
    // Twitter/X
    'twitter-post': { width: 1200, height: 675, name: 'Twitter Post' },
    'twitter-header': { width: 1500, height: 500, name: 'Twitter Header' },
    'twitter-profile': { width: 400, height: 400, name: 'Twitter Profile' },
    'twitter-card': { width: 1200, height: 628, name: 'Twitter Card' },
    // LinkedIn
    'linkedin-post': { width: 1200, height: 627, name: 'LinkedIn Post' },
    'linkedin-cover': { width: 1584, height: 396, name: 'LinkedIn Cover' },
    'linkedin-profile': { width: 400, height: 400, name: 'LinkedIn Profile' },
    'linkedin-company': { width: 1536, height: 768, name: 'LinkedIn Company' },
    // Pinterest
    'pinterest-pin': { width: 1000, height: 1500, name: 'Pinterest Pin' },
    'pinterest-board': { width: 222, height: 150, name: 'Pinterest Board' },
    'pinterest-profile': { width: 165, height: 165, name: 'Pinterest Profile' },
    // Snapchat
    'snapchat-ad': { width: 1080, height: 1920, name: 'Snapchat Ad' },
    'snapchat-geofilter': { width: 1080, height: 1920, name: 'Snapchat Geofilter' },
    // Music Platforms
    'spotify-cover': { width: 640, height: 640, name: 'Spotify Cover' },
    'soundcloud-cover': { width: 800, height: 800, name: 'SoundCloud Cover' },
    'apple-music': { width: 1400, height: 1400, name: 'Apple Music Cover' },
    // Desktop & Web
    'desktop-wallpaper': { width: 1920, height: 1080, name: 'Desktop Wallpaper' },
    'desktop-4k': { width: 3840, height: 2160, name: 'Desktop 4K' },
    'web-banner': { width: 728, height: 90, name: 'Web Banner' },
    'web-header': { width: 1920, height: 400, name: 'Web Header' },
    // Mobile
    'mobile-wallpaper': { width: 1080, height: 1920, name: 'Mobile Wallpaper' },
    'iphone-wallpaper': { width: 1170, height: 2532, name: 'iPhone Wallpaper' },
    'android-wallpaper': { width: 1080, height: 1920, name: 'Android Wallpaper' },
    // Print & Documents
    'a4-portrait': { width: 2480, height: 3508, name: 'A4 Portrait' },
    'a4-landscape': { width: 3508, height: 2480, name: 'A4 Landscape' },
    'business-card': { width: 1050, height: 600, name: 'Business Card' },
    'poster-small': { width: 2480, height: 3508, name: 'Small Poster' },
    'poster-large': { width: 4961, height: 7016, name: 'Large Poster' }
};

// Global variables
let scene, camera, renderer, selected = null;
const objects = [];
const textObjects = [];
let isDragging = false;
let dragPlane = new THREE.Plane();
let dragIntersection = new THREE.Vector3();
let dragOffset = new THREE.Vector3();
let dragStartMouse = new THREE.Vector2();
let dragStartPosition = new THREE.Vector3();
let isEditingText = false;
let currentTextMesh = null;

// App state
const appState = {
    theme: 'dark',
    version: '0.1',
    selectedFormat: 'png',
    selectedQuality: 1,
    canvasWidth: 1080,
    canvasHeight: 1080,
    canvasAspectRatio: 1,
    profile: {
        username: localStorage.getItem('username') || 'User',
        email: localStorage.getItem('email') || 'user@example.com',
        phone: localStorage.getItem('phone') || '+1234567890'
    }
};

// Initialize the application
function init() {
    setupThree();
    setupEventListeners();
    loadProfile();
    loadSavedTheme();
    animate();
}

// Three.js setup
function setupThree() {
    const canvas = document.getElementById('canvas');
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        preserveDrawingBuffer: true, 
        antialias: true 
    });
    
    updateRendererTheme();
    resizeRenderer();

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Event listeners for canvas
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.addEventListener('dblclick', onDoubleClick);
    window.addEventListener('resize', onWindowResize);
}

// Update renderer theme
function updateRendererTheme() {
    if (renderer) {
        const isDark = appState.theme === 'dark';
        renderer.setClearColor(isDark ? 0x000000 : 0xffffff);
    }
}

// Resize renderer
function resizeRenderer() {
    if (renderer && camera) {
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight - 180; // Account for nav, presets, and toolbar
        
        // Calculate canvas size based on aspect ratio
        let canvasWidth, canvasHeight;
        const containerAspect = containerWidth / containerHeight;
        
        if (appState.canvasAspectRatio > containerAspect) {
            // Canvas is wider than container
            canvasWidth = Math.min(containerWidth * 0.8, containerHeight * 0.8 * appState.canvasAspectRatio);
            canvasHeight = canvasWidth / appState.canvasAspectRatio;
        } else {
            // Canvas is taller than container
            canvasHeight = Math.min(containerHeight * 0.8, containerWidth * 0.8 / appState.canvasAspectRatio);
            canvasWidth = canvasHeight * appState.canvasAspectRatio;
        }
        
        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasWidth, canvasHeight);
        
        // Center the canvas
        const canvas = renderer.domElement;
        canvas.style.position = 'absolute';
        canvas.style.left = '50%';
        canvas.style.top = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
        canvas.style.border = '2px solid rgba(0, 255, 255, 0.3)';
        canvas.style.borderRadius = '8px';
        canvas.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.2)';
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Mouse event handlers
function onMouseDown(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector2(x, y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        selectObject(intersects[0].object);
        isDragging = true;
        
        // Set up drag plane
        dragPlane.setFromNormalAndCoplanarPoint(
            camera.getWorldDirection(dragPlane.normal),
            selected.position
        );
        
        // Calculate drag offset
        raycaster.ray.intersectPlane(dragPlane, dragIntersection);
        dragOffset.subVectors(selected.position, dragIntersection);
    } else {
        selectObject(null);
    }
}

function onMouseMove(event) {
    if (!isDragging || !selected) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector2(x, y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Intersect with drag plane
    if (raycaster.ray.intersectPlane(dragPlane, dragIntersection)) {
        selected.position.copy(dragIntersection.add(dragOffset));
    }

    updatePropertyInputs();
}

function onMouseUp() {
    isDragging = false;
}

function onDoubleClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector2(x, y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData && object.userData.isText) {
            showTextEditor(object);
        }
    }
}

function onWindowResize() {
    resizeRenderer();
}

// Object selection
function selectObject(obj) {
    selected = obj;
    const panel = document.getElementById('propertiesPanel');
    
    if (selected) {
        panel.style.display = 'block';
        panel.classList.add('fade-in');
        updatePropertyInputs();
    } else {
        panel.style.display = 'none';
        panel.classList.remove('fade-in');
    }
}

// Update property inputs
function updatePropertyInputs() {
    if (!selected) return;

    const posX = document.getElementById('posX');
    const posY = document.getElementById('posY');
    const posZ = document.getElementById('posZ');
    const scaleX = document.getElementById('scaleX');
    const scaleY = document.getElementById('scaleY');
    const scaleZ = document.getElementById('scaleZ');
    const uniformScale = document.getElementById('uniformScale');
    const rotX = document.getElementById('rotX');
    const rotY = document.getElementById('rotY');
    const rotZ = document.getElementById('rotZ');
    const opacity = document.getElementById('opacity');
    const objectColor = document.getElementById('objectColor');

    if (posX) posX.value = selected.position.x;
    if (posY) posY.value = selected.position.y;
    if (posZ) posZ.value = selected.position.z;
    if (scaleX) scaleX.value = selected.scale.x;
    if (scaleY) scaleY.value = selected.scale.y;
    if (scaleZ) scaleZ.value = selected.scale.z;
    if (uniformScale) uniformScale.value = selected.scale.x;
    if (rotX) rotX.value = THREE.MathUtils.radToDeg(selected.rotation.x);
    if (rotY) rotY.value = THREE.MathUtils.radToDeg(selected.rotation.y);
    if (rotZ) rotZ.value = THREE.MathUtils.radToDeg(selected.rotation.z);
    if (opacity) opacity.value = selected.material.opacity;
    if (objectColor && selected.material.color) {
        objectColor.value = '#' + selected.material.color.getHexString();
    }

    // Update value displays
    document.getElementById('posXValue').textContent = selected.position.x.toFixed(1);
    document.getElementById('posYValue').textContent = selected.position.y.toFixed(1);
    document.getElementById('posZValue').textContent = selected.position.z.toFixed(1);
    document.getElementById('scaleXValue').textContent = Math.round(selected.scale.x * 100) + '%';
    document.getElementById('scaleYValue').textContent = Math.round(selected.scale.y * 100) + '%';
    document.getElementById('scaleZValue').textContent = Math.round(selected.scale.z * 100) + '%';
    document.getElementById('uniformScaleValue').textContent = Math.round(selected.scale.x * 100) + '%';
    document.getElementById('rotXValue').textContent = Math.round(THREE.MathUtils.radToDeg(selected.rotation.x)) + '°';
    document.getElementById('rotYValue').textContent = Math.round(THREE.MathUtils.radToDeg(selected.rotation.y)) + '°';
    document.getElementById('rotZValue').textContent = Math.round(THREE.MathUtils.radToDeg(selected.rotation.z)) + '°';
    document.getElementById('opacityValue').textContent = Math.round(selected.material.opacity * 100) + '%';
}

// Update selected object from inputs
function updateSelectedObject() {
    if (!selected) return;

    const posX = document.getElementById('posX');
    const posY = document.getElementById('posY');
    const posZ = document.getElementById('posZ');
    const scaleX = document.getElementById('scaleX');
    const scaleY = document.getElementById('scaleY');
    const scaleZ = document.getElementById('scaleZ');
    const uniformScale = document.getElementById('uniformScale');
    const rotX = document.getElementById('rotX');
    const rotY = document.getElementById('rotY');
    const rotZ = document.getElementById('rotZ');
    const opacity = document.getElementById('opacity');
    const objectColor = document.getElementById('objectColor');

    if (posX) selected.position.x = parseFloat(posX.value);
    if (posY) selected.position.y = parseFloat(posY.value);
    if (posZ) selected.position.z = parseFloat(posZ.value);

    if (uniformScale && event.target === uniformScale) {
        const scaleValue = parseFloat(uniformScale.value);
        selected.scale.set(scaleValue, scaleValue, scaleValue);
    } else {
        if (scaleX) selected.scale.x = parseFloat(scaleX.value);
        if (scaleY) selected.scale.y = parseFloat(scaleY.value);
        if (scaleZ) selected.scale.z = parseFloat(scaleZ.value);
    }

    if (rotX) selected.rotation.x = THREE.MathUtils.degToRad(parseFloat(rotX.value));
    if (rotY) selected.rotation.y = THREE.MathUtils.degToRad(parseFloat(rotY.value));
    if (rotZ) selected.rotation.z = THREE.MathUtils.degToRad(parseFloat(rotZ.value));
    
    if (opacity) selected.material.opacity = parseFloat(opacity.value);
    if (objectColor && selected.material.color) {
        selected.material.color.setHex(objectColor.value.replace('#', '0x'));
    }

    updatePropertyInputs();
}

// Smart text wrapping function
function wrapText(context, text, maxWidth) {
    const lines = [];
    const paragraphs = text.split('\n');
    
    paragraphs.forEach(paragraph => {
        if (paragraph.trim() === '') {
            lines.push('');
            return;
        }
        
        const words = paragraph.split(' ');
        let currentLine = '';
        
        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
            const metrics = context.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
    });
    
    return lines;
}

// Add text to scene with auto-wrapping
function addText(text, options = {}) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 1024;
    canvas.height = 512;
    
    // Configure text style
    const fontSize = options.fontSize || 48;
    const fontFamily = options.fontFamily || 'Arial, sans-serif';
    const color = options.color || '#ffffff';
    const bold = options.bold ? 'bold ' : '';
    const italic = options.italic ? 'italic ' : '';
    const underline = options.underline || false;
    
    context.font = `${bold}${italic}${fontSize}px ${fontFamily}`;
    context.fillStyle = color;
    context.textAlign = 'left';
    context.textBaseline = 'top';
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Handle multi-line text with auto-wrapping
    const lines = wrapText(context, text, canvas.width - 40);
    const lineHeight = fontSize * 1.2;
    let maxWidth = 0;
    
    // Calculate text dimensions
    lines.forEach(line => {
        if (line.trim()) {
            const metrics = context.measureText(line);
            maxWidth = Math.max(maxWidth, metrics.width);
        }
    });
    
    // Draw text
    lines.forEach((line, index) => {
        const y = 20 + (index * lineHeight);
        context.fillText(line, 20, y);
        
        // Add underline if needed
        if (underline && line.trim()) {
            const metrics = context.measureText(line);
            context.beginPath();
            context.moveTo(20, y + fontSize + 2);
            context.lineTo(20 + metrics.width, y + fontSize + 2);
            context.strokeStyle = color;
            context.lineWidth = Math.max(1, fontSize / 20);
            context.stroke();
        }
    });
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create material and geometry
    const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        alphaTest: 0.1
    });
    
    const aspectRatio = Math.max(maxWidth + 40, 200) / Math.max(lines.length * lineHeight + 40, 100);
    const geometry = new THREE.PlaneGeometry(aspectRatio * 2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    
    // Store text data
    mesh.userData = {
        isText: true,
        text: text,
        fontSize: fontSize,
        fontFamily: fontFamily,
        color: color,
        bold: options.bold || false,
        italic: options.italic || false,
        underline: options.underline || false,
        canvas: canvas,
        context: context
    };
    
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
    objects.push(mesh);
    textObjects.push(mesh);
    selectObject(mesh);
    
    return mesh;
}

// Update text content with real-time rendering
function updateTextContent(mesh, newText, options = {}) {
    if (!mesh.userData.isText) return;
    
    const userData = mesh.userData;
    userData.text = newText;
    
    // Update options if provided
    if (options.fontSize !== undefined) userData.fontSize = options.fontSize;
    if (options.color !== undefined) userData.color = options.color;
    if (options.bold !== undefined) userData.bold = options.bold;
    if (options.italic !== undefined) userData.italic = options.italic;
    if (options.underline !== undefined) userData.underline = options.underline;
    
    const context = userData.context;
    const canvas = userData.canvas;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set font style
    const bold = userData.bold ? 'bold ' : '';
    const italic = userData.italic ? 'italic ' : '';
    context.font = `${bold}${italic}${userData.fontSize}px ${userData.fontFamily}`;
    context.fillStyle = userData.color;
    
    // Handle multi-line text with auto-wrapping
    const lines = wrapText(context, newText, canvas.width - 40);
    const lineHeight = userData.fontSize * 1.2;
    let maxWidth = 0;
    
    // Calculate text dimensions
    lines.forEach(line => {
        if (line.trim()) {
            const metrics = context.measureText(line);
            maxWidth = Math.max(maxWidth, metrics.width);
        }
    });
    
    // Draw text
    lines.forEach((line, index) => {
        const y = 20 + (index * lineHeight);
        context.fillText(line, 20, y);
        
        // Add underline if needed
        if (userData.underline && line.trim()) {
            const metrics = context.measureText(line);
            context.beginPath();
            context.moveTo(20, y + userData.fontSize + 2);
            context.lineTo(20 + metrics.width, y + userData.fontSize + 2);
            context.strokeStyle = userData.color;
            context.lineWidth = Math.max(1, userData.fontSize / 20);
            context.stroke();
        }
    });
    
    // Update geometry if needed
    const aspectRatio = Math.max(maxWidth + 40, 200) / Math.max(lines.length * lineHeight + 40, 100);
    const newGeometry = new THREE.PlaneGeometry(aspectRatio * 2, 2);
    mesh.geometry.dispose();
    mesh.geometry = newGeometry;
    
    // Update texture
    mesh.material.map.needsUpdate = true;
}

// Show text editor with auto-sizing
function showTextEditor(existingMesh = null) {
    const textEditor = document.getElementById('textEditor');
    const textInput = document.getElementById('textInput');
    
    isEditingText = true;
    currentTextMesh = existingMesh;
    
    if (existingMesh && existingMesh.userData.isText) {
        textInput.value = existingMesh.userData.text;
        document.getElementById('textColor').value = existingMesh.userData.color;
        document.getElementById('textSize').value = existingMesh.userData.fontSize;
        
        // Update formatting buttons
        document.getElementById('textBold').classList.toggle('active', existingMesh.userData.bold);
        document.getElementById('textItalic').classList.toggle('active', existingMesh.userData.italic);
        document.getElementById('textUnderline').classList.toggle('active', existingMesh.userData.underline);
    } else {
        textInput.value = '';
        document.getElementById('textColor').value = '#ffffff';
        document.getElementById('textSize').value = '48';
        
        // Reset formatting buttons
        document.getElementById('textBold').classList.remove('active');
        document.getElementById('textItalic').classList.remove('active');
        document.getElementById('textUnderline').classList.remove('active');
    }
    
    textEditor.style.display = 'block';
    textInput.focus();
    
    // Auto-size the textarea
    autoResizeTextarea(textInput);
}

// Hide text editor
function hideTextEditor() {
    const textEditor = document.getElementById('textEditor');
    textEditor.style.display = 'none';
    isEditingText = false;
    currentTextMesh = null;
}

// Auto-resize textarea function
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
}

// Real-time text preview
function updateTextPreview() {
    if (!currentTextMesh) return;
    
    const text = document.getElementById('textInput').value;
    const color = document.getElementById('textColor').value;
    const fontSize = parseInt(document.getElementById('textSize').value);
    const bold = document.getElementById('textBold').classList.contains('active');
    const italic = document.getElementById('textItalic').classList.contains('active');
    const underline = document.getElementById('textUnderline').classList.contains('active');
    
    updateTextContent(currentTextMesh, text, {
        color: color,
        fontSize: fontSize,
        bold: bold,
        italic: italic,
        underline: underline
    });
}

// Add image to scene
function addImage(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            texture.colorSpace = THREE.SRGBColorSpace;

            const aspectRatio = img.width / img.height;
            const geometry = new THREE.PlaneGeometry(aspectRatio * 2, 2);
            const material = new THREE.MeshBasicMaterial({ 
                map: texture, 
                transparent: true 
            });
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(0, 0, 0);
            scene.add(mesh);
            objects.push(mesh);
            selectObject(mesh);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Add basic shapes
function addShape(type) {
    let geometry, material, mesh;
    
    switch(type) {
        case 'cube':
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(0.5, 32, 32);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
            break;
        case 'cone':
            geometry = new THREE.ConeGeometry(0.5, 1, 32);
            break;
        default:
            geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    
    material = new THREE.MeshLambertMaterial({ 
        color: Math.random() * 0xffffff 
    });
    mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
    objects.push(mesh);
    selectObject(mesh);
}

// Delete selected object
function deleteSelected() {
    if (!selected) return;
    
    scene.remove(selected);
    const index = objects.indexOf(selected);
    if (index > -1) {
        objects.splice(index, 1);
    }
    
    // Remove from text objects if it's a text
    if (selected.userData && selected.userData.isText) {
        const textIndex = textObjects.indexOf(selected);
        if (textIndex > -1) {
            textObjects.splice(textIndex, 1);
        }
    }
    
    selectObject(null);
}

// Clear all objects
function clearScene() {
    objects.forEach(obj => scene.remove(obj));
    objects.length = 0;
    textObjects.length = 0;
    selectObject(null);
}

// Canvas preset functionality
function applyCanvasPreset(presetKey) {
    const preset = canvasPresets[presetKey];
    if (!preset) return;

    appState.canvasWidth = preset.width;
    appState.canvasHeight = preset.height;
    appState.canvasAspectRatio = preset.width / preset.height;
    
    // Update canvas info display
    updateCanvasInfo();
    
    // Resize renderer to match new aspect ratio
    resizeRenderer();

    // Update export modal inputs
    document.getElementById('export-width').value = preset.width;
    document.getElementById('export-height').value = preset.height;

    // Update active preset button
    document.querySelectorAll('.preset-btn, .preset-card').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-preset="${presetKey}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    showNotification(`Canvas set to ${preset.name} (${preset.width}×${preset.height})`, 'success');
}

// Update canvas info display
function updateCanvasInfo() {
    const canvasInfo = document.getElementById('canvasInfo');
    const canvasSize = canvasInfo.querySelector('.canvas-size');
    const canvasRatio = canvasInfo.querySelector('.canvas-ratio');
    
    canvasSize.textContent = `${appState.canvasWidth} × ${appState.canvasHeight}`;
    
    // Calculate and display ratio
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(appState.canvasWidth, appState.canvasHeight);
    const ratioW = appState.canvasWidth / divisor;
    const ratioH = appState.canvasHeight / divisor;
    canvasRatio.textContent = `${ratioW}:${ratioH}`;
}

// Duplicate selected object
function duplicateSelected() {
    if (!selected) return;
    
    let geometry, material, mesh;
    
    // Clone geometry and material
    geometry = selected.geometry.clone();
    material = selected.material.clone();
    mesh = new THREE.Mesh(geometry, material);
    
    // Copy user data for text objects
    if (selected.userData && selected.userData.isText) {
        mesh.userData = { ...selected.userData };
        textObjects.push(mesh);
    }
    
    // Position slightly offset
    mesh.position.copy(selected.position);
    mesh.position.x += 0.5;
    mesh.position.y += 0.5;
    mesh.rotation.copy(selected.rotation);
    mesh.scale.copy(selected.scale);
    
    scene.add(mesh);
    objects.push(mesh);
    selectObject(mesh);
    
    showNotification('Object duplicated successfully!', 'success');
}

// Export functionality
function exportScene() {
    const format = document.getElementById('export-format').value;
    const quality = parseInt(document.getElementById('export-quality').value);
    const width = parseInt(document.getElementById('export-width').value);
    const height = parseInt(document.getElementById('export-height').value);
    const filename = document.getElementById('export-filename').value || 'maxEdit-export';
    
    // Create a temporary canvas for export
    const exportCanvas = document.createElement('canvas');
    const exportRenderer = new THREE.WebGLRenderer({ 
        canvas: exportCanvas,
        preserveDrawingBuffer: true,
        antialias: true
    });
    
    const exportWidth = width * quality;
    const exportHeight = height * quality;
    
    exportRenderer.setSize(exportWidth, exportHeight);
    exportRenderer.setClearColor(appState.theme === 'dark' ? 0x000000 : 0xffffff);
    exportRenderer.render(scene, camera);
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    
    if (format === 'png' || format === 'jpg' || format === 'webp') {
        const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
        link.href = exportCanvas.toDataURL(mimeType, 0.9);
    } else {
        // For other formats, use PNG as fallback
        link.href = exportCanvas.toDataURL('image/png');
    }
    
    link.click();
    exportRenderer.dispose();
}

// Theme management
function toggleTheme() {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', appState.theme);
    
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = appState.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    
    updateRendererTheme();
    localStorage.setItem('theme', appState.theme);
}

// Load saved theme
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    appState.theme = savedTheme;
    document.body.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// Profile management
function loadProfile() {
    document.getElementById('username').value = appState.profile.username;
    document.getElementById('email').value = appState.profile.email;
    document.getElementById('phone').value = appState.profile.phone;
}

function saveProfile() {
    appState.profile.username = document.getElementById('username').value;
    appState.profile.email = document.getElementById('email').value;
    appState.profile.phone = document.getElementById('phone').value;
    
    localStorage.setItem('username', appState.profile.username);
    localStorage.setItem('email', appState.profile.email);
    localStorage.setItem('phone', appState.profile.phone);
    
    closeModal('profileModal');
    showNotification('Profile saved successfully!', 'success');
}

// Modal management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event listeners setup
function setupEventListeners() {
    // Version selector
    const versionBtn = document.getElementById('versionBtn');
    const versionDropdown = document.getElementById('versionDropdown');
    
    versionBtn.addEventListener('click', () => {
        versionBtn.classList.toggle('active');
        versionDropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!versionBtn.contains(e.target)) {
            versionBtn.classList.remove('active');
            versionDropdown.classList.remove('active');
        }
    });
    
    // Version options
    document.querySelectorAll('.version-option').forEach(option => {
        option.addEventListener('click', () => {
            const version = option.dataset.version;
            appState.version = version;
            document.getElementById('currentVersion').textContent = `v-${version}`;
            
            document.querySelectorAll('.version-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            versionBtn.classList.remove('active');
            versionDropdown.classList.remove('active');
        });
    });

    // Canvas presets
    document.querySelectorAll('.preset-btn, .preset-card').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            if (preset) {
                applyCanvasPreset(preset);
                // Close presets modal if open
                closeModal('presetsModal');
                closeModal('socialPresetsModal');
            }
        });
    });

    // More presets button
    document.getElementById('morePresetsBtn').addEventListener('click', () => {
        openModal('presetsModal');
    });
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', () => {
        openModal('export-modal');
    });
    
    // Profile button
    document.getElementById('profileBtn').addEventListener('click', () => {
        openModal('profileModal');
    });
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Toolbar items
    document.querySelectorAll('.toolbar-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type;
            const fileInput = item.querySelector('input[type="file"]');
            
            if (fileInput) {
                fileInput.click();
            } else if (type === 'shapes') {
                // Show shape selection (for now, just add a cube)
                addShape('cube');
            } else if (type === 'text') {
                showTextEditor();
            } else if (type === 'layers') {
                // Add layers functionality (placeholder)
                showNotification('Layers panel coming soon!', 'info');
            }
        });
    });
    
    // File inputs
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                Array.from(files).forEach(file => {
                    if (file.type.startsWith('image/')) {
                        addImage(file);
                    } else {
                        showNotification('Only image files are supported currently', 'warning');
                    }
                });
            }
        });
    });
    
    // Property controls
    ['posX', 'posY', 'posZ', 'scaleX', 'scaleY', 'scaleZ', 'uniformScale', 'rotX', 'rotY', 'rotZ', 'opacity', 'objectColor'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateSelectedObject);
        }
    });
    
    // Panel close button
    document.getElementById('panelClose').addEventListener('click', () => {
        selectObject(null);
    });
    
    // Duplicate button
    document.getElementById('duplicateSelected').addEventListener('click', duplicateSelected);
    
    // Delete button
    document.getElementById('deleteSelected').addEventListener('click', deleteSelected);
    
    // Social presets button
    document.getElementById('socialMoreBtn').addEventListener('click', () => {
        openModal('socialPresetsModal');
    });
    
    // Social search functionality
    const socialSearch = document.getElementById('socialSearch');
    if (socialSearch) {
        socialSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const presetCards = document.querySelectorAll('.social-presets-grid .preset-card');
            
            presetCards.forEach(card => {
                const spanText = card.querySelector('span').textContent.toLowerCase();
                const smallText = card.querySelector('small').textContent.toLowerCase();
                
                if (spanText.includes(searchTerm) || smallText.includes(searchTerm)) {
                    card.classList.remove('hidden');
                    card.style.display = 'flex';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Text editor controls with real-time updates
    const textInput = document.getElementById('textInput');
    if (textInput) {
        textInput.addEventListener('input', () => {
            // Auto-resize textarea
            autoResizeTextarea(textInput);
            
            // Real-time preview if editing existing text
            if (currentTextMesh) {
                updateTextPreview();
            }
        });
        
        // Handle Enter key for new lines
        textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                // Allow Enter for new lines
                e.stopPropagation();
            }
        });
    }

    // Text controls with real-time updates
    document.getElementById('addTextToCanvas').addEventListener('click', () => {
        const text = document.getElementById('textInput').value;
        const color = document.getElementById('textColor').value;
        const fontSize = parseInt(document.getElementById('textSize').value);
        const bold = document.getElementById('textBold').classList.contains('active');
        const italic = document.getElementById('textItalic').classList.contains('active');
        const underline = document.getElementById('textUnderline').classList.contains('active');
        
        if (text.trim()) {
            if (currentTextMesh) {
                // Update existing text
                updateTextContent(currentTextMesh, text, {
                    color: color,
                    fontSize: fontSize,
                    bold: bold,
                    italic: italic,
                    underline: underline
                });
            } else {
                // Create new text
                addText(text, {
                    color: color,
                    fontSize: fontSize,
                    bold: bold,
                    italic: italic,
                    underline: underline
                });
            }
            hideTextEditor();
        }
    });

    document.getElementById('cancelText').addEventListener('click', () => {
        hideTextEditor();
    });

    // Text formatting buttons with real-time updates
    document.getElementById('textBold').addEventListener('click', (e) => {
        e.target.classList.toggle('active');
        if (currentTextMesh) updateTextPreview();
    });

    document.getElementById('textItalic').addEventListener('click', (e) => {
        e.target.classList.toggle('active');
        if (currentTextMesh) updateTextPreview();
    });

    document.getElementById('textUnderline').addEventListener('click', (e) => {
        e.target.classList.toggle('active');
        if (currentTextMesh) updateTextPreview();
    });

    // Color and size controls with real-time updates
    document.getElementById('textColor').addEventListener('input', () => {
        if (currentTextMesh) updateTextPreview();
    });

    document.getElementById('textSize').addEventListener('input', () => {
        if (currentTextMesh) updateTextPreview();
    });
    
    // Export modal
    document.getElementById('close-modal').addEventListener('click', () => {
        closeModal('export-modal');
    });

    document.getElementById('cancel-export').addEventListener('click', () => {
        closeModal('export-modal');
    });

    document.getElementById('confirm-export').addEventListener('click', () => {
        exportScene();
        closeModal('export-modal');
        showNotification('Scene exported successfully!', 'success');
    });
    
    // Profile modal
    document.getElementById('closeProfileModal').addEventListener('click', () => {
        closeModal('profileModal');
    });
    
    document.getElementById('saveProfile').addEventListener('click', saveProfile);

    // Presets modal
    document.getElementById('closePresetsModal').addEventListener('click', () => {
        closeModal('presetsModal');
    });
    
    // Social presets modal
    document.getElementById('closeSocialPresetsModal').addEventListener('click', () => {
        closeModal('socialPresetsModal');
        // Reset search when closing
        const socialSearch = document.getElementById('socialSearch');
        if (socialSearch) {
            socialSearch.value = '';
            document.querySelectorAll('.social-presets-grid .preset-card').forEach(card => {
                card.classList.remove('hidden');
                card.style.display = 'flex';
            });
        }
    });
    
    // Social preset cards
    document.querySelectorAll('.social-presets-grid .preset-card').forEach(card => {
        card.addEventListener('click', () => {
            const preset = card.dataset.preset;
            if (preset) {
                applyCanvasPreset(preset);
                closeModal('socialPresetsModal');
                // Reset search
                const socialSearch = document.getElementById('socialSearch');
                if (socialSearch) {
                    socialSearch.value = '';
                    document.querySelectorAll('.social-presets-grid .preset-card').forEach(c => {
                        c.classList.remove('hidden');
                        c.style.display = 'flex';
                    });
                }
            }
        });
    });
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' && selected) {
            deleteSelected();
        } else if (e.key === 'Escape') {
            if (isEditingText) {
                hideTextEditor();
            } else {
                selectObject(null);
            }
        } else if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            openModal('export-modal');
        }
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    updateCanvasInfo();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations or reduce performance when tab is not visible
    } else {
        // Resume normal operation
    }
});

// Add some demo content
setTimeout(() => {
    // Add a welcome cube
    addShape('cube');
    if (selected) {
        selected.position.set(-2, 0, 0);
        selected.rotation.set(0.5, 0.5, 0);
    }
    
    // Add a sphere
    addShape('sphere');
    if (selected) {
        selected.position.set(2, 0, 0);
        selected.material.color.setHex(0x00ff88);
    }
    
    selectObject(null);
}, 1000);