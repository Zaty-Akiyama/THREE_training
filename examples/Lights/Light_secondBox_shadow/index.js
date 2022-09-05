import * as THREE from "three"
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
  renderer.shadowMap.enabled = true

  const scene = new THREE.Scene()

  const light = new THREE.SpotLight( 0xf0f0f0 )
  light.position.set( -10, 30, 40 )
  light.castShadow = true
  
  scene.add(light)

  const lightHelper = new THREE.SpotLightHelper( light )
  const lightGuiObj = { helper: false }
  // gui.add( lightGuiObj, 'helper' )
  //   .name( 'Light Helper' )
  //   .onChange( enable => {
  //     if( enable )
  //     {
  //       scene.add( lightHelper )
  //     }else
  //     {
  //       scene.remove( lightHelper )
  //     }
  //   })

  const camera = new THREE.PerspectiveCamera( 45, width/height, 5, 1000 )
  camera.position.set(-130,80,100)
  camera.lookAt( 0, 0, 0 )
  scene.add(camera)

  const boxGeo = new THREE.BoxGeometry(10,10,10)
  const boxMat = new THREE.MeshStandardMaterial()
  const box = new THREE.Mesh(boxGeo,boxMat)
  box.castShadow = true
  box.receiveShadow = true
  scene.add(box)

  const secondBoxGeo = new THREE.BoxGeometry( 3, 3, 3 )
  const secondBoxMat = new THREE.MeshStandardMaterial()
  const secondBox = new THREE.Mesh( secondBoxGeo, secondBoxMat )
  secondBox.castShadow = true
  secondBox.position.y = 20

  scene.add(secondBox)

  const planeGeo = new THREE.PlaneGeometry( 1000, 1000, 50, 50)
  const planeMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
  })
  const plane = new THREE.Mesh(planeGeo,planeMat)
  plane.rotation.set(-Math.PI/2,0,0)
  plane.receiveShadow = true
  scene.add(plane)

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

    box.position.y = 4 * (Math.cos(delta * .002) + 1) + 10
    box.rotation.x += .01
    box.rotation.y += .008
    box.rotation.z -= .005

    secondBox.position.z = 10 * (Math.sin(delta * .004) + 1) + 10
    secondBox.rotation.x += .01
    secondBox.rotation.y -= .008
    secondBox.rotation.z -= .005

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