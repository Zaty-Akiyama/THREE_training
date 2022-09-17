import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
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

  const loader = new FontLoader()
  const group = new THREE.Group()
  scene.add(group)
  loader.load( './helvetiker_regular.typeface.json', font => {
    const geo = new TextGeometry('white-sesame.jp',{
      font: font,
      size: 3,
      height: 2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: .1,
      bevelOffset: 0,
      bevelSegments: 1  
    })
    const mat = new THREE.MeshNormalMaterial()
    mat.side = THREE.DoubleSide
    const mesh = new THREE.Mesh(geo,mat)
    mesh.position.x = -14

    group.add(mesh)
  })

  const controls = new OrbitControls( camera, renderer.domElement )

  const animate = (delta) => {
    requestAnimationFrame( animate )

    if( group === undefined ) return

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