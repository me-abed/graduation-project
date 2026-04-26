const model = document.getElementById("model");
const lightRange = document.getElementById('lightRange');
const zoomControl = document.getElementById("zoomRange");
const rotateControl = document.getElementById("rotateRange");
const transformToggle = document.getElementById('transformToggle');
const loadBtn = document.getElementById('loadBtn');
const widthInput = document.getElementById('canvasWidth');
const heightInput = document.getElementById('canvasHeight');
const resizeBtn = document.getElementById('resizeBtn');
const resetBtn = document.getElementById('resetBtn');
const input = document.getElementById("modelPath");

// ! src input
model.addEventListener('load', () => {
    input.value = model.getAttribute('src');
});
const observer = new MutationObserver(() => {
    input.value = model.getAttribute('src');
});
observer.observe(model, {
    attributes: true,
    attributeFilter: ['src']
});

// !download model
loadBtn.addEventListener('click', () => {

    const modelSrc = model.src;


    const link = document.createElement('a');
    link.href = modelSrc;

    link.download = modelSrc.split('/').pop();

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
// !resize btn

const originalWidth = model.style.width;
const originalHeight = model.style.height;

resizeBtn.addEventListener('click', () => {
    const width = parseInt(widthInput.value) || 800;
    const height = parseInt(heightInput.value) || 600;

    model.style.width = width + 'px';
    model.style.height = height + 'px';


});

// !Zoom
zoomControl.addEventListener("input", () => {
    const scaleValue = zoomControl.value;
    model.setAttribute('scale', `${scaleValue} ${scaleValue} ${scaleValue}`);
});

// !reset btn
const originalExposure = model.exposure;
const originalScale = model.getAttribute('scale') || "1 1 1";

resetBtn.addEventListener('click', () => {
    // اعادة الأبعاد
    model.style.width = originalWidth;
    model.style.height = originalHeight;
    widthInput.value = parseInt(originalWidth);
    heightInput.value = parseInt(originalHeight);

    // اعادة الإضاءة
    model.exposure = originalExposure;
    lightRange.value = originalExposure;

    // اعاده الزوم
    model.setAttribute('scale', originalScale);
    const firstScale = parseFloat(originalScale.split(' ')[0]);
    zoomControl.value = firstScale;

});




// ! Transform Controls

transformToggle.addEventListener('change', (event) => {
    const isEnabled = event.target.value === 'true';




    model.autoRotate = isEnabled;


});



//  !Exposure
lightRange.addEventListener('input', (event) => {
    const exposure = parseFloat(event.target.value);
    model.exposure = exposure;
});