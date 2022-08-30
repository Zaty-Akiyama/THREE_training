import * as THREE from "three"
import * as CANNON from "cannon-es"
import CannonDebugger from "cannon-es-debugger"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

const gui = new GUI()
const guiConfig = {
  activeOrbit: false,
  resetWindow: () => {
    document.location.reload()
  }
}
gui.add( guiConfig, 'resetWindow' )
   .name('ページをリセット')

const createCannonWorld = () => {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3( 0, -9.78, 0 )
  })
  return world
}
const createPlanePhysics = () => {
  const planeShape = new CANNON.Plane()
  const planeBody = new CANNON.Body({
    mass: 0
  })
  planeBody.addShape( planeShape )
  planeBody.quaternion.setFromEuler( -Math.PI/2, 0, 0 )
  
  return planeBody
}
const createBoxPhysics = (size) => {
  const boxShape = new CANNON.Box( new CANNON.Vec3(size/2,size/2,size/2))
  const boxBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 15, 0)
  })
  boxBody.addShape( boxShape )
  boxBody.quaternion.setFromEuler( -Math.PI/4,Math.PI/4,0 )
  
  return boxBody
}

init()
function init () {
  const width = window.innerWidth
  const height = window.innerHeight


  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  document.body.appendChild(renderer.domElement)
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( width, height )
  renderer.outputEncoding = THREE.sRGBEncoding

  const scene = new THREE.Scene()

  scene.add(new THREE.AxesHelper(100))

  const camera = new THREE.PerspectiveCamera( 45, width/height, 5, 1000 )
  camera.position.set(30,30,60)
  scene.add(camera)
  
  const world = createCannonWorld()

  const planeGeo = new THREE.PlaneGeometry( 1000, 1000, 50, 50)
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0x333333,
    wireframe: true
  })
  const plane = new THREE.Mesh(planeGeo,planeMat)
  scene.add(plane)
  const planeBody = createPlanePhysics()
  
  world.addBody(planeBody)
  
  const boxSize = 10
  const boxGeo = new THREE.BoxGeometry(boxSize,boxSize,boxSize)
  const boxMat = new THREE.MeshNormalMaterial()
  const box = new THREE.Mesh(boxGeo,boxMat)
  box.position.y = 15
  scene.add(box)
  const boxBody = createBoxPhysics(boxSize)

  world.addBody(boxBody)

  const controls = new OrbitControls( camera, renderer.domElement )
  controls.enableZoom = false
  controls.enablePan = false
  controls.enableRotate = false

  gui.add( guiConfig, 'activeOrbit' )
    .name('コントロールを有効')
    .onChange( value => {
      controls.enableZoom = value
      controls.enablePan = value
      controls.enableRotate = value
    })

  const animate = (delta) => {
    requestAnimationFrame( animate )
    
    plane.position.copy( planeBody.position )
    plane.quaternion.copy( planeBody.quaternion )
    
    box.position.copy( boxBody.position )
    box.quaternion.copy( boxBody.quaternion )

    world.step(1/60)
    controls.update(delta);
    renderer.render( scene, camera )
  }
  animate()
  
  const onWindowResize = () => {
    const resizeWidth = window.innerWidth
    const resizeHeight = window.innerHeight
    
    camera.aspect = resizeWidth/resizeHeight
    camera.updateProjectionMatrix()
    renderer.setSize(resizeWidth,resizeHeight)
  }
  window.addEventListener('resize',onWindowResize,false)
}