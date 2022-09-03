import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

const gui = new GUI()
const guiConfig = {
  activeOrbit: false,
  resetWindow: () => {
    document.location.reload()
  },
}
const positionConfig = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
}
gui.add( guiConfig, 'resetWindow' )
  .name('ページをリセット')

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

  const camera = new THREE.PerspectiveCamera( 45, width/height, 5, 1000 )
  camera.position.set(30,30,60)
  scene.add(camera)

  const cameraConfig = {
    position: new THREE.Vector3(0,0,0),
    rotation: new THREE.Vector3(0,0,0)
  }  

  const cameraGUI = gui.addFolder( 'Camera' )

  cameraGUI.add( cameraConfig.position, 'x' ).listen().name('Position X')
  cameraGUI.add( cameraConfig.position, 'y' ).listen().name('Position X')
  cameraGUI.add( cameraConfig.position, 'z' ).listen().name('Position X')

  cameraGUI.add( cameraConfig.rotation, 'x' ).listen().name('Rotation X')
  cameraGUI.add( cameraConfig.rotation, 'y' ).listen().name('Rotation Y')
  cameraGUI.add( cameraConfig.rotation, 'z' ).listen().name('Rotation Z')

  const boxGeo = new THREE.BoxGeometry(10,10,10)
  const boxMat = new THREE.MeshNormalMaterial()
  const box = new THREE.Mesh(boxGeo,boxMat)
  scene.add(box)

  const propGUI = gui.addFolder( 'property' )

  propGUI.add( positionConfig, 'positionX', -50, 50 )
  propGUI.add( positionConfig, 'positionY', -50, 50 )
  propGUI.add( positionConfig, 'positionZ', -50, 50 )

  propGUI.add( positionConfig, 'rotationX', -10, 10 )
  propGUI.add( positionConfig, 'rotationY', -10, 10 )
  propGUI.add( positionConfig, 'rotationZ', -10, 10 )

  propGUI.add( positionConfig, 'scaleX', 0.1, 10 )
  propGUI.add( positionConfig, 'scaleY', 0.1, 10 )
  propGUI.add( positionConfig, 'scaleZ', 0.1, 10 )

  function boxUpdate () 
  {
    box.position.set( positionConfig.positionX, positionConfig.positionY, positionConfig.positionZ )
    box.rotation.set( positionConfig.rotationX, positionConfig.rotationY, positionConfig.rotationZ )
    box.scale.set( positionConfig.scaleX, positionConfig.scaleY, positionConfig.scaleZ )
  }

  const planeGeo = new THREE.PlaneGeometry( 1000, 1000, 50, 50)
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0x333333,
    wireframe: true
  })
  const plane = new THREE.Mesh(planeGeo,planeMat)
  plane.rotation.set(-Math.PI/2,0,0)
  scene.add(plane)

  const controls = new OrbitControls( camera, renderer.domElement )
  controls.addEventListener('change', e => {
    cameraConfig.position.copy( camera.position )
    cameraConfig.rotation.copy( camera.rotation )
  })
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
  
  const animate = () => {
    requestAnimationFrame( animate )

    boxUpdate()
    controls.update()
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