import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

init()
function init () {

  const width = window.innerWidth
  const height = window.innerHeight

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  document.body.appendChild(renderer.domElement)
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( width, height )
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera( 45, width/height, 5, 1000 )
  camera.position.set( 0,0,30 )
  camera.lookAt( 0, 0, 0 )
  scene.add(camera)

  const vertices = [
    -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
    -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
  ]
  const indices = [
    2,1,0,    0,3,2,
    7,3,0,    1,2,6,    
    6,7,4,    7,6,2
  ]

  const geo = new THREE.PolyhedronGeometry(vertices,indices,10,1)
  const mat = new THREE.MeshNormalMaterial({wireframe: true})
  mat.side = THREE.DoubleSide
  const mesh = new THREE.Mesh(geo,mat)
  scene.add(mesh)

  const controls = new OrbitControls( camera, renderer.domElement )

  const animate = (delta) => {
    requestAnimationFrame( animate )

    mesh.rotation.x += .005
    mesh.rotation.y += .005
    mesh.rotation.z += .005

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