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

  const shapes = new THREE.Shape() 
  const x=-5
  const y=-5
  shapes.moveTo( x + 5, y + 5 )
  shapes.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y )
  shapes.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 )
  shapes.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 )
  shapes.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 )
  shapes.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y )
  shapes.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 )

  const geo = new THREE.ShapeGeometry(shapes)
  const mat = new THREE.MeshNormalMaterial({wireframe:true})
  mat.side = THREE.DoubleSide
  const mesh = new THREE.Mesh(geo,mat)
  mesh.scale.set(.8,.8,.8)
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