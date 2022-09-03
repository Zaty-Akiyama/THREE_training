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

  const cameraObject = {
    getCamera: () => {
      const cameraPosition = `\n  x:${camera.position.x},\n  y:${camera.position.y},\n  z:${camera.position.z}`
      const cameraRotation = `\n  x:${camera.rotation.x},\n  y:${camera.rotation.y},\n  z:${camera.rotation.z}`
      alert('カメラポジション: {'+cameraPosition+'\n}\n\nカメラ角度: {'+cameraRotation+'\n}')
    }
  }
  gui.add( cameraObject, 'getCamera' ).name( 'カメラ情報を取得' )

  const boxGeo = new THREE.BoxGeometry(10,10,10)
  const boxMat = new THREE.MeshNormalMaterial()
  const box = new THREE.Mesh(boxGeo,boxMat)
  scene.add(box)

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