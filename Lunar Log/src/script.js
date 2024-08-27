/////////////////////////////////////////////////////////////////////////
///// IMPORT
import './main.css'
import { Clock, Scene, LoadingManager, WebGLRenderer, sRGBEncoding, Group, PerspectiveCamera, DirectionalLight, PointLight, MeshPhongMaterial, TextureLoader } from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/////////////////////////////////////////////////////////////////////////
//// LOADING MANAGER
const ftsLoader = document.querySelector(".lds-roller")
const looadingCover = document.getElementById("loading-text-intro")
const loadingManager = new LoadingManager()

loadingManager.onLoad = function() {

    document.querySelector(".main-container").style.visibility = 'visible'
    document.querySelector("body").style.overflow = 'auto'

    const yPosition = {y: 0}
    
    new TWEEN.Tween(yPosition).to({y: 100}, 900).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onUpdate(function(){ looadingCover.style.setProperty('transform', `translate( 0, ${yPosition.y}%)`)})
    .onComplete(function () {looadingCover.parentNode.removeChild(document.getElementById("loading-text-intro")); TWEEN.remove(this)})

    introAnimation()
    //load_vid()
    ftsLoader.parentNode.removeChild(ftsLoader)

    window.scroll(0, 0)

}

/////////////////////////////////////////////////////////////////////////
//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
dracoLoader.setDecoderConfig({ type: 'js' })
const loader = new GLTFLoader(loadingManager)
loader.setDRACOLoader(dracoLoader)
const textureLoader = new TextureLoader()


/////////////////////////////////////////////////////////////////////////
///// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.getElementById('canvas-container')
const containerDetails = document.getElementById('canvas-container-details')

/////////////////////////////////////////////////////////////////////////
///// GENERAL VARIABLES
let oldMaterial
let secondContainer = false
let width = container.clientWidth
let height = container.clientHeight

/////////////////////////////////////////////////////////////////////////
///// SCENE CREATION
const scene = new Scene()

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG
const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance"})
renderer.autoClear = true
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
renderer.setSize( width, height)
renderer.outputEncoding = sRGBEncoding
container.appendChild(renderer.domElement)

const renderer2 = new WebGLRenderer({ antialias: false})
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1))
renderer2.setSize( width, height)
renderer2.outputEncoding = sRGBEncoding
containerDetails.appendChild(renderer2.domElement)

/////////////////////////////////////////////////////////////////////////
///// CAMERAS CONFIG
const cameraGroup = new Group()
scene.add(cameraGroup)

const camera = new PerspectiveCamera(35, width / height, 1, 100)
camera.position.set(200,1.54,-0.1)
cameraGroup.add(camera)

const camera2 = new PerspectiveCamera(35, containerDetails.clientWidth / containerDetails.clientHeight, 1, 100)
camera2.position.set(.25, 1.5, 1.3)
camera2.rotation.set(0,.7,0)
scene.add(camera2)

/////////////////////////////////////////////////////////////////////////
///// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    
    camera2.aspect = containerDetails.clientWidth / containerDetails.clientHeight
    camera2.updateProjectionMatrix()

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer2.setSize(containerDetails.clientWidth, containerDetails.clientHeight)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1))
})

/////////////////////////////////////////////////////////////////////////
///// SCENE LIGHTS
const sunLight = new DirectionalLight(0x435c72, 2)
sunLight.position.set(100,100,100)
scene.add(sunLight)

const fillLight = new PointLight(0x88b2d9, 5, 4, 3)
fillLight.position.set(50,50,6)
scene.add(fillLight)



/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
const moons = []
loader.load('models/gltf/Blended_moon.glb', function (gltf) {

    gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
            obj.position.x = 50
            obj.position.y = 50
            obj.position.z = 0
            oldMaterial = obj.material
            obj.material = new MeshPhongMaterial({
                shininess: 45,
                map: textureLoader.load("../textures/texture.jpg"),
                normalMap: textureLoader.load("../textures/texture.png")
            })
        }
    })
    scene.add(gltf.scene)
    clearScene()
})

loader.load('models/gltf/tuff.glb', function (gltf) {

    gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
            obj.position.x = 0
            obj.position.y = 0
            obj.position.z = 0
            oldMaterial = obj.material
            obj.material = new MeshPhongMaterial({
                shininess: 45,
            })
        }
    })
    scene.add(gltf.scene)
    clearScene()
})


//const material = new THREE.MeshBasicMaterial({ map: texture });
//const geometry = new THREE.PlaneGeometry(width, height);
//const plane_mesh = new THREE.Mesh(geometry, material);
//plane_mesh.position.set(50, 50,-10)
//scene.add(plane_mesh);
//clearScene()

//LOADING MOONS



function clearScene(){
    oldMaterial.dispose()
    renderer.renderLists.dispose()
}

/////////////////////////////////////////////////////////////////////////
//// INTRO CAMERA ANIMATION USING TWEEN

function animateMoon(position, rotation)
{
    const moon = scene.children[0]
    if (position != null)
    {
        new TWEEN.Tween(moon.position).to(position, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
        .onComplete(function () {
            TWEEN.remove(this)
        })
    }
    
    if (rotation != null)
    {
        new TWEEN.Tween(moon.rotation).to(rotation, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
        .onComplete(function () {
            TWEEN.remove(this)
        })
    }
}



function introAnimation() {
    //load_vid()
    new TWEEN.Tween(camera.position.set(40,45,15)).to({ x: 50.02, y: 51, z: 2}, 3500).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () {
        TWEEN.remove(this)
        document.querySelector('.header').classList.add('ended')
        document.querySelector('.first>p').classList.add('ended')
    })
    
}


//////////////////////////////////////////////////
//// CLICK LISTENERS
document.getElementById('aglaea').addEventListener('click', () => {
    document.getElementById('aglaea').classList.add('active')
    document.getElementById('euphre').classList.remove('active')
    document.getElementById('thalia').classList.remove('active')
    document.getElementById('content').innerHTML = 'Jayanth Annabhimoju worked on the backend systems which would print the certificates, manage the database to hold the volunteer hours, dates, and systems to read and authenticate volunteer timings. In addition to this, jayanth worked on the deployment of his own website to the cloud through github pages.'
    animateCamera({ x: .15, y: 1.5, z: 1.36 },{ y: .7 })
})

document.getElementById('thalia').addEventListener('click', () => {
    document.getElementById('thalia').classList.add('active')
    document.getElementById('aglaea').classList.remove('active')
    document.getElementById('euphre').classList.remove('active')
    document.getElementById('content').innerHTML = 'Aaditya matampalli was the man responisble for creating the AI chatbot and volunteer oppportunity finder. He initially created the mdeol locallly on machine, and then utilized LangChain and StreamLit to host the AI Chatbot which we then integrated into the main site.'
    animateCamera({ x: .25, y: 1.5, z: 1.3 },{ y: -0.1 })
})

document.getElementById('euphre').addEventListener('click', () => {
    document.getElementById('euphre').classList.add('active')
    document.getElementById('aglaea').classList.remove('active')
    document.getElementById('thalia').classList.remove('active')
    document.getElementById('content').innerHTML = 'Vishruth Meda was responsible for the development of the website itself, along with the development of models, working with THREE.js, javascript, html, css, to combine the websites of the other members into one main site, which can allow the user to access all of the places.'
    animateCamera({ x: 1, y: 1.3, z: 2 },{ y: .6 })
})

/////////////////////////////////////////////////////////////////////////
//// ANIMATE CAMERA
function animateCamera(position, rotation){
    new TWEEN.Tween(camera2.position).to(position, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () {
        TWEEN.remove(this)
    })
    new TWEEN.Tween(camera2.rotation).to(rotation, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () {
        TWEEN.remove(this)
    })
}

/////////////////////////////////////////////////////////////////////////
//// PARALLAX CONFIG
const cursor = {x:0, y:0}
const clock = new Clock()
let previousTime = 0

/////////////////////////////////////////////////////////////////////////
//// RENDER LOOP FUNCTION

function rendeLoop() {

    TWEEN.update()

    if (secondContainer){
        renderer2.render(scene, camera2)
    } else{
        renderer.render(scene, camera)
    }

    

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    const parallaxY = cursor.y
    fillLight.position.y -= ( parallaxY *9 + fillLight.position.y - 2) * deltaTime


    const parallaxX = cursor.x
    fillLight.position.x += (parallaxX *8 - fillLight.position.x) * 2 *deltaTime


    cameraGroup.position.z -= (parallaxY/3 + cameraGroup.position.z) * 2 * deltaTime
    cameraGroup.position.x += (parallaxX/3 - cameraGroup.position.x) * 2 * deltaTime


    const moon = scene.children[0]    
    requestAnimationFrame(rendeLoop)
}

rendeLoop()

//////////////////////////////////////////////////
//// ON MOUSE MOVE TO GET CAMERA POSITION
document.addEventListener('mousemove', (event) => {
    event.preventDefault()

    cursor.x = event.clientX / window.innerWidth -0.5
    cursor.y = event.clientY / window.innerHeight -0.5

    handleCursor(event)
}, false)

//////////////////////////////////////////////////
//// DISABLE RENDERER BASED ON CONTAINER VIEW
const watchedSection = document.querySelector('.second')

function obCallback(payload) {
    if (payload[0].intersectionRatio > 0.05){
        secondContainer = true
    }else{
        secondContainer = false
    }
}

const ob = new IntersectionObserver(obCallback, {
    threshold: 0.05
})

ob.observe(watchedSection)

//////////////////////////////////////////////////
//// MAGNETIC MENU
const btn = document.querySelectorAll('nav > .a')
const customCursor = document.querySelector('.cursor')

function update(e) {
    const span = this.querySelector('span')
    
    if(e.type === 'mouseleave') {
        span.style.cssText = ''
    } else {
        const { offsetX: x, offsetY: y } = e,{ offsetWidth: width, offsetHeight: height } = this,
        walk = 20, xWalk = (x / width) * (walk * 2) - walk, yWalk = (y / height) * (walk * 2) - walk
        span.style.cssText = `transform: translate(${xWalk}px, ${yWalk}px);`
    }
}

const handleCursor = (e) => {
    const x = e.clientX
    const y =  e.clientY
    customCursor.style.cssText =`left: ${x}px; top: ${y}px;`
}

btn.forEach(b => b.addEventListener('mousemove', update))
btn.forEach(b => b.addEventListener('mouseleave', update))