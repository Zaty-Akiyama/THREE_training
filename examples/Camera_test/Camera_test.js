import * as THREE from "three"
import GUI from 'lil-gui'

const gui = new GUI()
const guiConfig = {
  resetWindow: () => {
    document.location.reload()
  },
  fov: 45,
  near: 0.1,
  far: 1000
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

  const camera = new THREE.PerspectiveCamera( 45, width/height, 5, 1000 )
  camera.position.set(130,30,60)
  camera.lookAt(0,0,0)
  scene.add(camera)

  gui.add( guiConfig, 'fov', 0, 100)
    .onChange( value => {
      camera.fov = value
    })
  gui.add( guiConfig, 'near', 0.001, 1000)
    .onChange( value => {
      camera.near = value
    })
  gui.add( guiConfig, 'far', 0.001, 1000)
    .onChange( value => {
      camera.far = value
    })


  const planeGeo = new THREE.PlaneGeometry( 1000, 1000, 50, 50)
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0x333333,
    wireframe: true
  })
  const plane = new THREE.Mesh(planeGeo,planeMat)
  plane.rotation.set(-Math.PI/2,0,0)
  scene.add(plane)
  

  const animate = (delta) => {
    requestAnimationFrame( animate )

    camera.updateProjectionMatrix()
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